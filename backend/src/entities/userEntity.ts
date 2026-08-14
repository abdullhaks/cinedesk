import { Document, Types } from 'mongoose';
import { UserStatus, ContractorType } from '../utils/enum';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  role: Types.ObjectId | null;
  contractorType: ContractorType | null;
  status: UserStatus;
  profilePhoto: string;
  phone: string;
  department: string;
  position: string;
  onboardingApplication: Types.ObjectId | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
