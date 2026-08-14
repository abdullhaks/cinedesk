import { Request, Response } from 'express';

export interface IAuditLogController {
  listLogs(req: Request, res: Response): Promise<void>;
}
