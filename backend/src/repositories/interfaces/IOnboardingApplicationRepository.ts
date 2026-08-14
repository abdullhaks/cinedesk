import { IOnboardingApplicationDocument } from '../../entities/onboardingApplicationEntity';

export interface IOnboardingApplicationRepository {
  create(data: Partial<IOnboardingApplicationDocument>): Promise<IOnboardingApplicationDocument>;
  findById(id: string): Promise<IOnboardingApplicationDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: IOnboardingApplicationDocument[]; total: number }>;
  updateById(id: string, data: Partial<IOnboardingApplicationDocument>): Promise<IOnboardingApplicationDocument | null>;
  findByApplicant(applicantId: string): Promise<IOnboardingApplicationDocument | null>;
}
