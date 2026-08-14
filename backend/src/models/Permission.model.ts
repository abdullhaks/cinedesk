import { Schema, model } from 'mongoose';
import { IPermissionDocument } from '../entities/permissionEntity';

const permissionSchema = new Schema<IPermissionDocument>(
  {
    key: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const Permission = model<IPermissionDocument>('Permission', permissionSchema);
export default Permission;
