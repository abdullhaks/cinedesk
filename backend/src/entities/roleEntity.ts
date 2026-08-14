import { Document, Types } from 'mongoose';
import { IPermissionDocument } from './permissionEntity';

export interface IRoleDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  permissions: Types.ObjectId[] | IPermissionDocument[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}
