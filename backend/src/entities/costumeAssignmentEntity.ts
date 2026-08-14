import { Document, Types } from 'mongoose';

export interface ICostumeAssignmentDocument extends Document {
  _id: Types.ObjectId;
  costume: Types.ObjectId;
  actor: Types.ObjectId;
  castMember?: Types.ObjectId;
  character?: Types.ObjectId | null;
  production?: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
  assignedDate?: Date;
  returnedAt?: Date | null;
  returnDate?: Date | null;
  notes?: string;
  status?: string;
  conditionBefore?: string;
  conditionAfter?: string;
  createdAt: Date;
  updatedAt: Date;
}
