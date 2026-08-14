import { Document, Types } from 'mongoose';
import { CostumeStatus } from '../utils/enum';

export interface ICostumeDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  size: string;
  character?: Types.ObjectId | null;
  production: Types.ObjectId;
  status: CostumeStatus;
  images: string[];
  notes: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
