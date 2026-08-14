import { injectable, inject } from 'inversify';
import { IAuditLogService } from '../interfaces/IAuditLog.service';
import { IAuditLogRepository } from '../../repositories/interfaces/IAuditLogRepository';
import { IAuditLogDocument } from '../../entities/auditLogEntity';
import TYPES from '../../config/inversify.types';

@injectable()
export default class AuditLogService implements IAuditLogService {
  constructor(
    @inject(TYPES.IAuditLogRepository) private _auditRepo: IAuditLogRepository
  ) {}

  async logAction(
    actorId: string,
    action: string,
    targetEntity: string,
    targetId?: string,
    meta?: Record<string, any>,
    ipAddress?: string
  ): Promise<IAuditLogDocument> {
    return await this._auditRepo.create({
      actor: actorId as any,
      user: actorId as any,
      action,
      targetEntity,
      module: targetEntity,
      targetId: targetId ? (targetId as any) : undefined,
      resourceId: targetId ? (targetId as any) : undefined,
      meta: meta || {},
      metadata: meta || {},
      ipAddress: ipAddress || '127.0.0.1',
      timestamp: new Date(),
    } as any);
  }

  async listLogs(
    filter: { action?: string; targetEntity?: string; actor?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IAuditLogDocument[]; total: number }> {
    const queryFilter: any = {};
    if (filter.action) queryFilter.action = filter.action;
    if (filter.targetEntity) queryFilter.targetEntity = filter.targetEntity;
    if (filter.actor) queryFilter.actor = filter.actor;
    if (filter.search) {
      queryFilter.action = { $regex: filter.search, $options: 'i' };
    }

    return await this._auditRepo.findMany(queryFilter, page, limit);
  }
}
