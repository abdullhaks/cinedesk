import { Document, Types } from 'mongoose';
import { OnboardingStatus, ContractorType } from '../utils/enum';

export interface IOnboardingApplicationDocument extends Document {
  _id: Types.ObjectId;
  applicant: Types.ObjectId;
  contractorType: ContractorType;
  status: OnboardingStatus;
  steps: {
    yourInformation: {
      name: string;
      photo: string;
      contact: string;
      department: string;
      position: string;
      experience: string;
    };
    financial: {
      paymentType: string;
      bankDetails: string;
      taxInfo: string;
    };
    documents: Array<{
      type: string;
      fileUrl: string;
      uploadedAt: Date;
    }>;
    sign: {
      agreedAt: Date | null;
      signatureText: string;
    };
  };
  reviewer: Types.ObjectId | null;
  reviewedAt: Date | null;
  reviewComments: string;
  rejectionReason: string;
  submittedAt: Date | null;
  resubmissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}
