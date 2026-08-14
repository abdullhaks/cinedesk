import { Schema, model } from 'mongoose';
import { IAuditLogDocument } from '../entities/auditLogEntity';

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    targetEntity: { type: String, required: true },
    module: { type: String },
    targetId: { type: Schema.Types.ObjectId },
    resourceId: { type: Schema.Types.ObjectId },
    meta: { type: Schema.Types.Mixed, default: {} },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

auditLogSchema.set('timestamps', { createdAt: true, updatedAt: false });

const AuditLog = model<IAuditLogDocument>('AuditLog', auditLogSchema);
export default AuditLog;
