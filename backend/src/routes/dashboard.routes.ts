import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IDashboardController } from '../controllers/interfaces/IDashboard.controller';
import { authenticate } from '../middlewares/authenticate';
import { catchAsync } from '../utils/catchAsync';

const dashboardRouter = express.Router();
const controller = container.get<IDashboardController>(TYPES.IDashboardController);

dashboardRouter.use(authenticate);

// GET /api/dashboard/stats
dashboardRouter.get(
  '/stats',
  catchAsync((req, res) => controller.getStats(req, res))
);

export default dashboardRouter;
