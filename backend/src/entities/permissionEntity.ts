import { Document, Types } from 'mongoose';

export interface IPermissionDocument extends Document {
  _id: Types.ObjectId;
  key: string;
  module: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
