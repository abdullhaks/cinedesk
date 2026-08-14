import { Document, Types } from 'mongoose';

export interface ICharacterDocument extends Document {
  _id: Types.ObjectId;
  production: Types.ObjectId;
  name: string;
  description: string;
  castMember: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
