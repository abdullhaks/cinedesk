import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IAuditLogController } from '../interfaces/IAuditLog.controller';
import { IAuditLogService } from '../../services/interfaces/IAuditLog.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { parsePagination } from '../../utils/pagination';

@injectable()
export default class AuditLogController implements IAuditLogController {
  constructor(
    @inject(TYPES.IAuditLogService) private _auditService: IAuditLogService
  ) {}

  async listLogs(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      action: req.query.action as string,
      targetEntity: req.query.targetEntity as string,
      actor: req.query.actor as string,
      search: req.query.search as string,
    };

    const result = await this._auditService.listLogs(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }
}
