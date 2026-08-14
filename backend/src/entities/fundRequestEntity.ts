import { Document, Types } from 'mongoose';
import { FundRequestStatus } from '../utils/enum';

export interface IFundRequestDocument extends Document {
  _id: Types.ObjectId;
  production: Types.ObjectId;
  requester: Types.ObjectId;
  amount: number;
  category: string;
  justification?: string;
  reason?: string;
  requestedAmount?: number;
  approvedAmount?: number | null;
  requiredDate?: Date;
  attachments?: string[];
  status: FundRequestStatus;
  approver?: Types.ObjectId | null;
  reviewedAt?: Date | null;
  comments?: string;
  approvalHistory?: Array<{
    action: string;
    by: Types.ObjectId;
    comment: string;
    at: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
