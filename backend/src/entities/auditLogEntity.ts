import { Document, Types } from 'mongoose';

export interface IAuditLogDocument extends Document {
  _id: Types.ObjectId;
  actor: Types.ObjectId;
  user?: Types.ObjectId;
  action: string;
  targetEntity: string;
  module?: string;
  targetId?: Types.ObjectId;
  resourceId?: Types.ObjectId;
  meta?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
  createdAt: Date;
}
