import { IAuditLogDocument } from '../../entities/auditLogEntity';
export interface IAuditLogRepository {
  create(data: Partial<IAuditLogDocument>): Promise<IAuditLogDocument>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: IAuditLogDocument[]; total: number }>;
}
