import { IAuditLogDocument } from '../../entities/auditLogEntity';

export interface IAuditLogService {
  logAction(
    actorId: string,
    action: string,
    targetEntity: string,
    targetId?: string,
    meta?: Record<string, any>,
    ipAddress?: string
  ): Promise<IAuditLogDocument>;
  listLogs(
    filter: { action?: string; targetEntity?: string; actor?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IAuditLogDocument[]; total: number }>;
}
