import { injectable, inject } from 'inversify';
import { ICostumeService } from '../interfaces/ICostume.service';
import { ICostumeRepository } from '../../repositories/interfaces/ICostumeRepository';
import { ICostumeAssignmentRepository } from '../../repositories/interfaces/ICostumeAssignmentRepository';
import { IProductionRepository } from '../../repositories/interfaces/IProductionRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IAuditLogService } from '../interfaces/IAuditLog.service';
import { INotificationService } from '../interfaces/INotification.service';
import { ICostumeDocument } from '../../entities/costumeEntity';
import { ICostumeAssignmentDocument } from '../../entities/costumeAssignmentEntity';
import TYPES from '../../config/inversify.types';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { CostumeStatus } from '../../utils/enum';

@injectable()
export default class CostumeService implements ICostumeService {
  constructor(
    @inject(TYPES.ICostumeRepository) private _costumeRepo: ICostumeRepository,
    @inject(TYPES.ICostumeAssignmentRepository) private _assignRepo: ICostumeAssignmentRepository,
    @inject(TYPES.IProductionRepository) private _prodRepo: IProductionRepository,
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IAuditLogService) private _auditService: IAuditLogService,
    @inject(TYPES.INotificationService) private _notifService: INotificationService
  ) {}

  async createCostume(data: any, actorId: string): Promise<ICostumeDocument> {
    const prod = await this._prodRepo.findById(data.productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    const costume = await this._costumeRepo.create({
      name: data.name,
      category: data.category || 'General',
      size: data.size || 'M',
      character: data.characterId ? (data.characterId as any) : null,
      production: data.productionId as any,
      status: CostumeStatus.AVAILABLE,
      images: data.images || [],
      notes: data.notes || '',
      createdBy: actorId as any,
    } as any);

    return (await this._costumeRepo.findById(costume._id.toString()))!;
  }

  async getCostumeById(id: string): Promise<ICostumeDocument> {
    const costume = await this._costumeRepo.findById(id);
    if (!costume) {
      throw ApiError.notFound(MESSAGES.costume.notFound);
    }
    return costume;
  }

  async listCostumes(
    filter: { status?: string; production?: string; category?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: ICostumeDocument[]; total: number }> {
    const queryFilter: any = {};
    if (filter.status) queryFilter.status = filter.status;
    if (filter.production) queryFilter.production = filter.production;
    if (filter.category) queryFilter.category = filter.category;
    if (filter.search) {
      queryFilter.name = { $regex: filter.search, $options: 'i' };
    }

    return await this._costumeRepo.findMany(queryFilter, page, limit);
  }

  async updateCostume(id: string, data: any, _actorId: string): Promise<ICostumeDocument> {
    const costume = await this._costumeRepo.findById(id);
    if (!costume) {
      throw ApiError.notFound(MESSAGES.costume.notFound);
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.category) updateData.category = data.category;
    if (data.size) updateData.size = data.size;
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updated = await this._costumeRepo.updateById(id, updateData);
    return updated!;
  }

  async deleteCostume(id: string): Promise<boolean> {
    const costume = await this._costumeRepo.findById(id);
    if (!costume) {
      throw ApiError.notFound(MESSAGES.costume.notFound);
    }
    return await this._costumeRepo.deleteById(id);
  }

  async assignCostume(
    costumeId: string,
    actorUserId: string,
    characterId?: string,
    notes = '',
    assignedByUserId = ''
  ): Promise<{ costume: ICostumeDocument; assignment: ICostumeAssignmentDocument }> {
    const costume = await this._costumeRepo.findById(costumeId);
    if (!costume) {
      throw ApiError.notFound(MESSAGES.costume.notFound);
    }

    // COSTUME AVAILABILITY GUARD (Section 11 Edge-Case Table)
    // If costume status is already Assigned or not Available -> throw HTTP 409 Conflict ("Costume is not available for assignment")
    if (costume.status !== CostumeStatus.AVAILABLE) {
      throw ApiError.conflict(MESSAGES.costume.notAvailable);
    }

    const actorUser = await this._userRepo.findById(actorUserId);
    if (!actorUser) {
      throw ApiError.notFound('Actor user not found');
    }

    const assignment = await this._assignRepo.create({
      costume: costumeId as any,
      character: characterId ? (characterId as any) : null,
      actor: actorUserId as any,
      assignedBy: assignedByUserId as any,
      assignedAt: new Date(),
      returnedAt: null,
      notes,
    } as any);

    // Update costume status to ASSIGNED
    const updatedCostume = await this._costumeRepo.updateById(costumeId, {
      status: CostumeStatus.ASSIGNED,
    } as any);

    // AuditLog Write Hook
    await this._auditService.logAction(
      assignedByUserId,
      'costume_assigned',
      'Costume',
      costumeId,
      { actor: actorUserId, assignmentId: assignment._id.toString() }
    );

    // Send Notification to Actor
    await this._notifService.createNotification(
      actorUserId,
      'Costume Assigned',
      `Costume "${costume.name}" has been assigned to you for production.`,
      'info',
      '/costumes'
    );

    return {
      costume: updatedCostume!,
      assignment,
    };
  }

  async returnCostume(
    assignmentId: string,
    notes = '',
    returnedByUserId = ''
  ): Promise<{ costume: ICostumeDocument; assignment: ICostumeAssignmentDocument }> {
    const assignment = await this._assignRepo.findById(assignmentId);
    if (!assignment) {
      throw ApiError.notFound('Costume assignment record not found');
    }

    const costumeId = (assignment.costume as any)._id?.toString() || assignment.costume.toString();

    const updatedAssignment = await this._assignRepo.updateById(assignmentId, {
      returnedAt: new Date(),
      notes: notes || assignment.notes,
    } as any);

    // Reset costume status to AVAILABLE
    const updatedCostume = await this._costumeRepo.updateById(costumeId, {
      status: CostumeStatus.AVAILABLE,
    } as any);

    // AuditLog Write Hook
    await this._auditService.logAction(
      returnedByUserId,
      'costume_returned',
      'Costume',
      costumeId,
      { assignmentId }
    );

    return {
      costume: updatedCostume!,
      assignment: updatedAssignment!,
    };
  }
}
