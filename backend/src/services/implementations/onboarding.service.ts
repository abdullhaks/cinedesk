import { injectable, inject } from 'inversify';
import { IOnboardingService } from '../interfaces/IOnboarding.service';
import { IAuditLogService } from '../interfaces/IAuditLog.service';
import { INotificationService } from '../interfaces/INotification.service';
import { IOnboardingApplicationRepository } from '../../repositories/interfaces/IOnboardingApplicationRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IOnboardingApplicationDocument } from '../../entities/onboardingApplicationEntity';
import TYPES from '../../config/inversify.types';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { OnboardingStatus, ContractorType, UserStatus } from '../../utils/enum';
import { canTransitionOnboarding } from '../../stateMachines/onboarding.stateMachine';

@injectable()
export default class OnboardingService implements IOnboardingService {
  constructor(
    @inject(TYPES.IOnboardingApplicationRepository)
    private _onboardingRepo: IOnboardingApplicationRepository,
    @inject(TYPES.IUserRepository)
    private _userRepo: IUserRepository,
    @inject(TYPES.IAuditLogService)
    private _auditService: IAuditLogService,
    @inject(TYPES.INotificationService)
    private _notifService: INotificationService
  ) {}

  async createDraft(
    applicantId: string,
    contractorType: ContractorType
  ): Promise<IOnboardingApplicationDocument> {
    // Duplicate submission guard: check if user already has an active application
    const existing = await this._onboardingRepo.findByApplicant(applicantId);
    if (existing && existing.status !== OnboardingStatus.REJECTED) {
      throw ApiError.conflict(MESSAGES.onboarding.duplicateApplication);
    }

    // Update user contractorType and status
    await this._userRepo.updateById(applicantId, {
      contractorType,
      status: UserStatus.PENDING_ONBOARDING,
    } as any);

    // Create new onboarding application draft
    const app = await this._onboardingRepo.create({
      applicant: applicantId as any,
      contractorType,
      status: OnboardingStatus.DRAFT,
      steps: {
        yourInformation: {
          name: '',
          photo: '',
          contact: '',
          department: '',
          position: '',
          experience: '',
        },
        financial: {
          paymentType: '',
          bankDetails: '',
          taxInfo: '',
        },
        documents: [],
        sign: {
          agreedAt: null,
          signatureText: '',
        },
      },
      resubmissionCount: existing ? existing.resubmissionCount + 1 : 0,
    } as any);

    // Link application to user
    await this._userRepo.updateById(applicantId, {
      onboardingApplication: app._id as any,
    } as any);

    return (await this._onboardingRepo.findById(app._id.toString()))!;
  }

  async updateStep(
    id: string,
    stepName: string,
    stepData: any,
    actorId: string
  ): Promise<IOnboardingApplicationDocument> {
    const app = await this._onboardingRepo.findById(id);
    if (!app) {
      throw ApiError.notFound(MESSAGES.onboarding.notFound);
    }

    const applicantId = (app.applicant as any)._id?.toString() || app.applicant.toString();
    if (applicantId !== actorId) {
      throw ApiError.forbidden(MESSAGES.permission.denied);
    }

    if (
      app.status !== OnboardingStatus.DRAFT &&
      app.status !== OnboardingStatus.CHANGES_REQUESTED
    ) {
      throw ApiError.badRequest('Cannot edit application after submission');
    }

    const currentSteps = app.steps || {};
    if (stepName === 'documents') {
      currentSteps.documents = currentSteps.documents || [];
      if (stepData.action === 'remove') {
        currentSteps.documents = currentSteps.documents.filter((d: any) => d.type !== stepData.type);
      } else {
        currentSteps.documents.push({
          type: stepData.type,
          fileUrl: stepData.fileUrl,
          uploadedAt: new Date(),
        });
      }
    } else if (stepName === 'sign') {
      currentSteps.sign = {
        agreedAt: new Date(),
        signatureText: stepData.signatureText,
      };
    } else if (stepName === 'yourInformation') {
      currentSteps.yourInformation = {
        ...currentSteps.yourInformation,
        ...stepData,
      };
    } else if (stepName === 'financial') {
      currentSteps.financial = {
        ...currentSteps.financial,
        ...stepData,
      };
    }

    const updated = await this._onboardingRepo.updateById(id, {
      steps: currentSteps,
    } as any);

    return updated!;
  }

  async submit(id: string, actorId: string): Promise<IOnboardingApplicationDocument> {
    const app = await this._onboardingRepo.findById(id);
    if (!app) {
      throw ApiError.notFound(MESSAGES.onboarding.notFound);
    }

    const applicantId = (app.applicant as any)._id?.toString() || app.applicant.toString();
    if (applicantId !== actorId) {
      throw ApiError.forbidden(MESSAGES.permission.denied);
    }

    if (!canTransitionOnboarding(app.status, OnboardingStatus.PENDING_REVIEW)) {
      throw ApiError.badRequest(MESSAGES.onboarding.invalidTransition);
    }

    const updated = await this._onboardingRepo.updateById(id, {
      status: OnboardingStatus.PENDING_REVIEW,
      submittedAt: new Date(),
    } as any);

    return updated!;
  }

  async getByApplicant(
    applicantId: string
  ): Promise<IOnboardingApplicationDocument | null> {
    return await this._onboardingRepo.findByApplicant(applicantId);
  }

  async getById(
    id: string,
    actorId: string,
    hasReviewPermission: boolean
  ): Promise<IOnboardingApplicationDocument> {
    const app = await this._onboardingRepo.findById(id);
    if (!app) {
      throw ApiError.notFound(MESSAGES.onboarding.notFound);
    }

    const applicantId = (app.applicant as any)._id?.toString() || app.applicant.toString();
    if (applicantId !== actorId && !hasReviewPermission) {
      throw ApiError.forbidden(MESSAGES.permission.denied);
    }

    return app;
  }

  async reviewApplication(
    id: string,
    action: 'approve' | 'reject' | 'request_changes',
    reviewerId: string,
    comments?: string,
    rejectionReason?: string
  ): Promise<IOnboardingApplicationDocument> {
    const app = await this._onboardingRepo.findById(id);
    if (!app) {
      throw ApiError.notFound(MESSAGES.onboarding.notFound);
    }

    let targetStatus: OnboardingStatus;
    if (action === 'approve') targetStatus = OnboardingStatus.APPROVED;
    else if (action === 'reject') targetStatus = OnboardingStatus.REJECTED;
    else targetStatus = OnboardingStatus.CHANGES_REQUESTED;

    if (!canTransitionOnboarding(app.status, targetStatus)) {
      throw ApiError.badRequest(MESSAGES.onboarding.invalidTransition);
    }

    const applicantId = (app.applicant as any)._id?.toString() || app.applicant.toString();

    // If approved -> update user status to ACTIVE (no role assigned automatically per plan.md Section 5.2)
    if (targetStatus === OnboardingStatus.APPROVED) {
      await this._userRepo.updateById(applicantId, {
        status: UserStatus.ACTIVE,
      } as any);
    }

    const updated = await this._onboardingRepo.updateById(id, {
      status: targetStatus,
      reviewer: reviewerId as any,
      reviewedAt: new Date(),
      reviewComments: comments || '',
      rejectionReason: rejectionReason || '',
    } as any);

    // AuditLog Write Hook
    await this._auditService.logAction(
      reviewerId,
      `onboarding_${action}`,
      'OnboardingApplication',
      id,
      { targetStatus, applicantId }
    );

    // Send Notification to Applicant
    await this._notifService.createNotification(
      applicantId,
      `Onboarding Status: ${targetStatus.toUpperCase()}`,
      `Your onboarding application status has been updated to ${targetStatus}.`,
      targetStatus === 'approved' ? 'success' : 'info',
      '/onboarding/status'
    );

    return updated!;
  }

  async list(
    filter: { contractorType?: string; status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IOnboardingApplicationDocument[]; total: number }> {
    const queryFilter: any = {};
    if (filter.contractorType) queryFilter.contractorType = filter.contractorType;
    if (filter.status) queryFilter.status = filter.status;

    return await this._onboardingRepo.findMany(queryFilter, page, limit);
  }
}
