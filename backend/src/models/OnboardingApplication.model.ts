import { Schema, model } from 'mongoose';
import { IOnboardingApplicationDocument } from '../entities/onboardingApplicationEntity';
import { OnboardingStatus, ContractorType } from '../utils/enum';

const onboardingApplicationSchema = new Schema<IOnboardingApplicationDocument>(
  {
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contractorType: {
      type: String,
      enum: Object.values(ContractorType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OnboardingStatus),
      default: OnboardingStatus.DRAFT,
    },
    steps: {
      yourInformation: {
        name: { type: String, default: '' },
        photo: { type: String, default: '' },
        contact: { type: String, default: '' },
        department: { type: String, default: '' },
        position: { type: String, default: '' },
        experience: { type: String, default: '' },
      },
      financial: {
        paymentType: { type: String, default: '' },
        bankDetails: { type: String, default: '' },
        taxInfo: { type: String, default: '' },
      },
      documents: [
        {
          type: { type: String },
          fileUrl: { type: String },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      sign: {
        agreedAt: { type: Date, default: null },
        signatureText: { type: String, default: '' },
      },
    },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    reviewComments: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    submittedAt: { type: Date, default: null },
    resubmissionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const OnboardingApplication = model<IOnboardingApplicationDocument>(
  'OnboardingApplication',
  onboardingApplicationSchema
);
export default OnboardingApplication;
