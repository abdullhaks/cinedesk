import type { ContractorType, UserStatus } from './user';

export type OnboardingStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

export interface YourInformationStep {
  name: string;
  photo: string;
  contact: string;
  department: string;
  position: string;
  experience: string;
}

export interface FinancialStep {
  paymentType: string;
  bankDetails: string;
  taxInfo: string;
}

export interface DocumentItem {
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface SignStep {
  agreedAt: string | null;
  signatureText: string;
}

export interface OnboardingApplication {
  _id: string;
  applicant: {
    _id: string;
    fullName: string;
    email: string;
    contractorType: ContractorType;
    status: UserStatus;
  } | string;
  contractorType: ContractorType;
  status: OnboardingStatus;
  steps: {
    yourInformation: YourInformationStep;
    financial: FinancialStep;
    documents: DocumentItem[];
    sign: SignStep;
  };
  reviewer?: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  reviewedAt?: string | null;
  reviewComments?: string;
  rejectionReason?: string;
  submittedAt?: string | null;
  resubmissionCount: number;
  createdAt: string;
  updatedAt: string;
}
