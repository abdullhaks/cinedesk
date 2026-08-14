import { Schema, model } from 'mongoose';
import { IUserDocument } from '../entities/userEntity';
import { UserStatus, ContractorType } from '../utils/enum';

const userSchema = new Schema<IUserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
    contractorType: {
      type: String,
      enum: Object.values(ContractorType),
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING_ONBOARDING,
    },
    profilePhoto: { type: String, default: '' },
    phone: { type: String, default: '' },
    department: { type: String, default: '' },
    position: { type: String, default: '' },
    onboardingApplication: {
      type: Schema.Types.ObjectId,
      ref: 'OnboardingApplication',
      default: null,
    },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = model<IUserDocument>('User', userSchema);
export default User;
