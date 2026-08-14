import { Schema, model } from 'mongoose';
import { IFundRequestDocument } from '../entities/fundRequestEntity';
import { FundRequestStatus } from '../utils/enum';

const fundRequestSchema = new Schema<IFundRequestDocument>(
  {
    production: { type: Schema.Types.ObjectId, ref: 'Production', required: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    justification: { type: String, default: '' },
    requestedAmount: { type: Number },
    approvedAmount: { type: Number, default: null },
    reason: { type: String },
    requiredDate: { type: Date },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(FundRequestStatus),
      default: FundRequestStatus.SUBMITTED,
    },
    approver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    comments: { type: String, default: '' },
  },
  { timestamps: true }
);

const FundRequest = model<IFundRequestDocument>('FundRequest', fundRequestSchema);
export default FundRequest;
