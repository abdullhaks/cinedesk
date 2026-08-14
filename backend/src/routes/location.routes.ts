import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { ILocationController } from '../controllers/interfaces/ILocation.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { upload } from '../middlewares/uploadHandler';
import { catchAsync } from '../utils/catchAsync';

const locationRouter = express.Router();
const controller = container.get<ILocationController>(TYPES.ILocationController);

locationRouter.use(authenticate);

// POST /api/locations/upload — upload location image / permit document
locationRouter.post(
  '/upload',
  requirePermission('locations.create'),
  upload.single('file'),
  catchAsync((req, res) => controller.uploadMedia(req, res))
);

// GET /api/locations — list locations
locationRouter.get(
  '/',
  requirePermission('locations.view'),
  catchAsync((req, res) => controller.listLocations(req, res))
);

// POST /api/locations — create location
locationRouter.post(
  '/',
  requirePermission('locations.create'),
  catchAsync((req, res) => controller.createLocation(req, res))
);

// GET /api/locations/:id — detail location
locationRouter.get(
  '/:id',
  requirePermission('locations.view'),
  catchAsync((req, res) => controller.getLocationById(req, res))
);

// PUT /api/locations/:id — update location
locationRouter.put(
  '/:id',
  requirePermission('locations.manage'),
  catchAsync((req, res) => controller.updateLocation(req, res))
);

// POST /api/locations/:id/book — book location date range (with conflict check)
locationRouter.post(
  '/:id/book',
  requirePermission('locations.book'),
  catchAsync((req, res) => controller.bookLocation(req, res))
);

// PATCH /api/locations/:id/approve — approve location
locationRouter.patch(
  '/:id/approve',
  requirePermission('locations.manage'),
  catchAsync((req, res) => controller.approveLocation(req, res))
);

// DELETE /api/locations/:id — delete location
locationRouter.delete(
  '/:id',
  requirePermission('locations.manage'),
  catchAsync((req, res) => controller.deleteLocation(req, res))
);

export default locationRouter;
