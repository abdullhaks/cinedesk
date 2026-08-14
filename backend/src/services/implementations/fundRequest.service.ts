import { injectable, inject } from 'inversify';
import { IFundRequestService } from '../interfaces/IFundRequest.service';
import { IAuditLogService } from '../interfaces/IAuditLog.service';
import { INotificationService } from '../interfaces/INotification.service';
import { IFundRequestRepository } from '../../repositories/interfaces/IFundRequestRepository';
import { IProductionRepository } from '../../repositories/interfaces/IProductionRepository';
import { IFundRequestDocument } from '../../entities/fundRequestEntity';
import TYPES from '../../config/inversify.types';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { FundRequestStatus } from '../../utils/enum';

@injectable()
export default class FundRequestService implements IFundRequestService {
  constructor(
    @inject(TYPES.IFundRequestRepository) private _fundRepo: IFundRequestRepository,
    @inject(TYPES.IProductionRepository) private _prodRepo: IProductionRepository,
    @inject(TYPES.IAuditLogService) private _auditService: IAuditLogService,
    @inject(TYPES.INotificationService) private _notifService: INotificationService
  ) {}

  async createRequest(data: any, requesterId: string): Promise<IFundRequestDocument> {
    const prod = await this._prodRepo.findById(data.productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    const reqDoc = await this._fundRepo.create({
      production: data.productionId as any,
      requester: requesterId as any,
      amount: Number(data.amount),
      category: data.category || 'General',
      justification: data.justification || '',
      status: FundRequestStatus.SUBMITTED,
      approver: null,
      reviewedAt: null,
      comments: '',
    } as any);

    return (await this._fundRepo.findById(reqDoc._id.toString()))!;
  }

  async getRequestById(id: string): Promise<IFundRequestDocument> {
    const doc = await this._fundRepo.findById(id);
    if (!doc) {
      throw ApiError.notFound(MESSAGES.fundRequest.notFound);
    }
    return doc;
  }

  async listRequests(
    filter: { status?: string; production?: string; category?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IFundRequestDocument[]; total: number }> {
    const queryFilter: any = {};
    if (filter.status) queryFilter.status = filter.status;
    if (filter.production) queryFilter.production = filter.production;
    if (filter.category) queryFilter.category = filter.category;
    if (filter.search) {
      queryFilter.category = { $regex: filter.search, $options: 'i' };
    }

    return await this._fundRepo.findMany(queryFilter, page, limit);
  }

  async submitRequest(id: string, actorId: string): Promise<IFundRequestDocument> {
    const reqDoc = await this._fundRepo.findById(id);
    if (!reqDoc) {
      throw ApiError.notFound(MESSAGES.fundRequest.notFound);
    }

    const requesterId = (reqDoc.requester as any)._id?.toString() || reqDoc.requester.toString();
    if (requesterId !== actorId) {
      throw ApiError.forbidden(MESSAGES.permission.denied);
    }

    if (reqDoc.status !== FundRequestStatus.DRAFT) {
      throw ApiError.badRequest('Only draft requests can be submitted');
    }

    const updated = await this._fundRepo.updateById(id, {
      status: FundRequestStatus.SUBMITTED,
    } as any);

    return updated!;
  }

  async approveRequest(id: string, approverId: string, comments?: string): Promise<IFundRequestDocument> {
    const reqDoc = await this._fundRepo.findById(id);
    if (!reqDoc) {
      throw ApiError.notFound(MESSAGES.fundRequest.notFound);
    }

    const requesterId = (reqDoc.requester as any)._id?.toString() || reqDoc.requester.toString();

    // SELF-APPROVAL GUARD (Section 11 Edge-Case Table)
    // If requester === approver -> HTTP 403 Forbidden ("Self-approval of fund requests is prohibited")
    if (requesterId === approverId) {
      throw ApiError.forbidden(MESSAGES.fundRequest.selfApproval);
    }

    if (
      reqDoc.status === FundRequestStatus.APPROVED ||
      reqDoc.status === FundRequestStatus.PAID
    ) {
      throw ApiError.badRequest('Fund request is already approved or paid');
    }

    const updated = await this._fundRepo.updateById(id, {
      status: FundRequestStatus.APPROVED,
      approver: approverId as any,
      reviewedAt: new Date(),
      comments: comments || reqDoc.comments || '',
    } as any);

    // Also update production spent budget
    if (reqDoc.production) {
      const prodId = (reqDoc.production as any)._id?.toString() || reqDoc.production.toString();
      const prod = await this._prodRepo.findById(prodId);
      if (prod) {
        const currentSpent = prod.budget?.spent || 0;
        await this._prodRepo.updateById(prodId, {
          budget: {
            ...prod.budget,
            spent: currentSpent + reqDoc.amount,
          },
        } as any);
      }
    }

    // AuditLog Write Hook
    await this._auditService.logAction(
      approverId,
      'fund_request_approved',
      'FundRequest',
      id,
      { amount: reqDoc.amount, requester: requesterId }
    );

    // Send Notification to Requester
    await this._notifService.createNotification(
      requesterId,
      'Fund Request Approved',
      `Your fund request for $${reqDoc.amount} has been approved.`,
      'success',
      '/funds'
    );

    return updated!;
  }

  async rejectRequest(id: string, approverId: string, comments?: string): Promise<IFundRequestDocument> {
    const reqDoc = await this._fundRepo.findById(id);
    if (!reqDoc) {
      throw ApiError.notFound(MESSAGES.fundRequest.notFound);
    }

    const updated = await this._fundRepo.updateById(id, {
      status: FundRequestStatus.REJECTED,
      approver: approverId as any,
      reviewedAt: new Date(),
      comments: comments || '',
    } as any);

    return updated!;
  }

  async disburseRequest(id: string, _actorId: string): Promise<IFundRequestDocument> {
    const reqDoc = await this._fundRepo.findById(id);
    if (!reqDoc) {
      throw ApiError.notFound(MESSAGES.fundRequest.notFound);
    }

    if (reqDoc.status !== FundRequestStatus.APPROVED) {
      throw ApiError.badRequest('Only approved fund requests can be disbursed/paid');
    }

    const updated = await this._fundRepo.updateById(id, {
      status: FundRequestStatus.PAID,
    } as any);

    return updated!;
  }

  async deleteRequest(id: string): Promise<boolean> {
    const reqDoc = await this._fundRepo.findById(id);
    if (!reqDoc) {
      throw ApiError.notFound(MESSAGES.fundRequest.notFound);
    }
    return await this._fundRepo.deleteById(id);
  }
}
