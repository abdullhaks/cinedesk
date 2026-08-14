import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IUserController } from '../controllers/interfaces/IUser.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { catchAsync } from '../utils/catchAsync';

const userRouter = express.Router();
const controller = container.get<IUserController>(TYPES.IUserController);

userRouter.use(authenticate);

// GET /api/users — list users
userRouter.get(
  '/',
  requirePermission('users.view'),
  catchAsync((req, res) => controller.listUsers(req, res))
);

// GET /api/users/:id — detail user
userRouter.get(
  '/:id',
  requirePermission('users.view'),
  catchAsync((req, res) => controller.getUserById(req, res))
);

// PATCH /api/users/:id/role — assign role to user
userRouter.patch(
  '/:id/role',
  requirePermission('users.assign_role'),
  catchAsync((req, res) => controller.assignRole(req, res))
);

// PATCH /api/users/:id/deactivate — deactivate user
userRouter.patch(
  '/:id/deactivate',
  requirePermission('users.deactivate'),
  catchAsync((req, res) => controller.deactivateUser(req, res))
);

export default userRouter;
