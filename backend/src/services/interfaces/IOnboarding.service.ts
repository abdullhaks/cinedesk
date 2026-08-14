import { IOnboardingApplicationDocument } from '../../entities/onboardingApplicationEntity';
import { ContractorType } from '../../utils/enum';

export interface IOnboardingService {
  createDraft(applicantId: string, contractorType: ContractorType): Promise<IOnboardingApplicationDocument>;
  updateStep(
    id: string,
    stepName: string,
    stepData: any,
    actorId: string
  ): Promise<IOnboardingApplicationDocument>;
  submit(id: string, actorId: string): Promise<IOnboardingApplicationDocument>;
  getByApplicant(applicantId: string): Promise<IOnboardingApplicationDocument | null>;
  getById(id: string, actorId: string, hasReviewPermission: boolean): Promise<IOnboardingApplicationDocument>;
  reviewApplication(
    id: string,
    action: 'approve' | 'reject' | 'request_changes',
    reviewerId: string,
    comments?: string,
    rejectionReason?: string
  ): Promise<IOnboardingApplicationDocument>;
  list(
    filter: { contractorType?: string; status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IOnboardingApplicationDocument[]; total: number }>;
}
