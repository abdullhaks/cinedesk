import { Schema, model } from 'mongoose';
import { IRoleDocument } from '../entities/roleEntity';

const roleSchema = new Schema<IRoleDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    isSystemRole: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Role = model<IRoleDocument>('Role', roleSchema);
export default Role;
