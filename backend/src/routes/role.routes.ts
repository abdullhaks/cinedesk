import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IRoleController } from '../controllers/interfaces/IRole.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { catchAsync } from '../utils/catchAsync';

const roleRouter = express.Router();
const roleController = container.get<IRoleController>(TYPES.IRoleController);

roleRouter.use(authenticate);

// GET /api/roles/permissions — list all available permissions
roleRouter.get(
  '/permissions',
  requirePermission('roles.view'),
  catchAsync((req, res) => roleController.listPermissions(req, res))
);

// GET /api/roles — list all roles with populated permissions
roleRouter.get(
  '/',
  requirePermission('roles.view'),
  catchAsync((req, res) => roleController.listRoles(req, res))
);

// POST /api/roles — create a custom role
roleRouter.post(
  '/',
  requirePermission('roles.manage'),
  catchAsync((req, res) => roleController.createRole(req, res))
);

// PATCH /api/roles/:id/permissions — update role's permission keys
roleRouter.patch(
  '/:id/permissions',
  requirePermission('roles.manage'),
  catchAsync((req, res) => roleController.updatePermissions(req, res))
);

export default roleRouter;
