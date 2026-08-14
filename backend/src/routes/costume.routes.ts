import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { ICostumeController } from '../controllers/interfaces/ICostume.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { upload } from '../middlewares/uploadHandler';
import { catchAsync } from '../utils/catchAsync';

const costumeRouter = express.Router();
const controller = container.get<ICostumeController>(TYPES.ICostumeController);

costumeRouter.use(authenticate);

// POST /api/costumes/upload — upload costume photo
costumeRouter.post(
  '/upload',
  requirePermission('costumes.create'),
  upload.single('file'),
  catchAsync((req, res) => controller.uploadMedia(req, res))
);

// GET /api/costumes — list costumes
costumeRouter.get(
  '/',
  requirePermission('costumes.view'),
  catchAsync((req, res) => controller.listCostumes(req, res))
);

// POST /api/costumes — create costume
costumeRouter.post(
  '/',
  requirePermission('costumes.create'),
  catchAsync((req, res) => controller.createCostume(req, res))
);

// GET /api/costumes/:id — detail costume
costumeRouter.get(
  '/:id',
  requirePermission('costumes.view'),
  catchAsync((req, res) => controller.getCostumeById(req, res))
);

// PUT /api/costumes/:id — update costume
costumeRouter.put(
  '/:id',
  requirePermission('costumes.update'),
  catchAsync((req, res) => controller.updateCostume(req, res))
);

// POST /api/costumes/:id/assign — assign costume to actor (availability check)
costumeRouter.post(
  '/:id/assign',
  requirePermission('costumes.assign'),
  catchAsync((req, res) => controller.assignCostume(req, res))
);

// POST /api/costumes/:id/return — return assigned costume
costumeRouter.post(
  '/:id/return',
  requirePermission('costumes.assign'),
  catchAsync((req, res) => controller.returnCostume(req, res))
);

// DELETE /api/costumes/:id — delete costume
costumeRouter.delete(
  '/:id',
  requirePermission('costumes.update'),
  catchAsync((req, res) => controller.deleteCostume(req, res))
);

export default costumeRouter;
