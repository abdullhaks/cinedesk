import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IAuditLogController } from '../controllers/interfaces/IAuditLog.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { catchAsync } from '../utils/catchAsync';

const auditLogRouter = express.Router();
const controller = container.get<IAuditLogController>(TYPES.IAuditLogController);

auditLogRouter.use(authenticate);

// GET /api/audit-logs — list audit logs
auditLogRouter.get(
  '/',
  requirePermission('audit_logs.view'),
  catchAsync((req, res) => controller.listLogs(req, res))
);

export default auditLogRouter;
