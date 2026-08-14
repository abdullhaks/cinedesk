import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { INotificationController } from '../controllers/interfaces/INotification.controller';
import { authenticate } from '../middlewares/authenticate';
import { catchAsync } from '../utils/catchAsync';

const notificationRouter = express.Router();
const controller = container.get<INotificationController>(TYPES.INotificationController);

notificationRouter.use(authenticate);

// GET /api/notifications — list authenticated user's notifications
notificationRouter.get(
  '/',
  catchAsync((req, res) => controller.getMyNotifications(req, res))
);

// PATCH /api/notifications/:id/read — mark single notification as read
notificationRouter.patch(
  '/:id/read',
  catchAsync((req, res) => controller.markAsRead(req, res))
);

// PATCH /api/notifications/read-all — mark all notifications as read
notificationRouter.patch(
  '/read-all',
  catchAsync((req, res) => controller.markAllAsRead(req, res))
);

export default notificationRouter;
