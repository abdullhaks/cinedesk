import type { User } from './user';

export interface AuditLogItem {
  _id: string;
  actor: User;
  action: string;
  targetEntity: string;
  targetId: string;
  meta: Record<string, any>;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
}
