import express, { Request } from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IProductionController } from '../controllers/interfaces/IProduction.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { requireOwnershipOrElevated } from '../middlewares/requireOwnershipOrElevated';
import { catchAsync } from '../utils/catchAsync';
import Production from '../models/Production.model';

const productionRouter = express.Router();
const controller = container.get<IProductionController>(TYPES.IProductionController);

productionRouter.use(authenticate);

// Helper for resource-level ownership check on productionManager
const getProductionManagerId = async (req: Request): Promise<string | null> => {
  try {
    const prod = await Production.findById(req.params.id);
    if (!prod) return null;
    return prod.productionManager ? prod.productionManager.toString() : null;
  } catch {
    return null;
  }
};

// GET /api/productions — list productions
productionRouter.get(
  '/',
  requirePermission('productions.view'),
  catchAsync((req, res) => controller.listProductions(req, res))
);

// POST /api/productions — create production
productionRouter.post(
  '/',
  requirePermission('productions.create'),
  catchAsync((req, res) => controller.createProduction(req, res))
);

// GET /api/productions/:id — detail production
productionRouter.get(
  '/:id',
  requirePermission('productions.view'),
  catchAsync((req, res) => controller.getProductionById(req, res))
);

// PUT /api/productions/:id — update production (Ownership by productionManager OR elevated 'productions.update' permission)
productionRouter.put(
  '/:id',
  requireOwnershipOrElevated(getProductionManagerId, 'productions.update'),
  catchAsync((req, res) => controller.updateProduction(req, res))
);

// DELETE /api/productions/:id — delete production
productionRouter.delete(
  '/:id',
  requirePermission('productions.delete'),
  catchAsync((req, res) => controller.deleteProduction(req, res))
);

// POST /api/productions/:id/cast — assign cast member
productionRouter.post(
  '/:id/cast',
  requirePermission('productions.update'),
  catchAsync((req, res) => controller.assignCast(req, res))
);

// DELETE /api/productions/:id/cast — remove cast member
productionRouter.delete(
  '/:id/cast',
  requirePermission('productions.update'),
  catchAsync((req, res) => controller.removeCast(req, res))
);

// POST /api/productions/:id/crew — assign crew member
productionRouter.post(
  '/:id/crew',
  requirePermission('productions.update'),
  catchAsync((req, res) => controller.assignCrew(req, res))
);

// DELETE /api/productions/:id/crew — remove crew member
productionRouter.delete(
  '/:id/crew',
  requirePermission('productions.update'),
  catchAsync((req, res) => controller.removeCrew(req, res))
);

// POST /api/productions/:id/characters — create character
productionRouter.post(
  '/:id/characters',
  requirePermission('productions.update'),
  catchAsync((req, res) => controller.createCharacter(req, res))
);

// GET /api/productions/:id/characters — list characters
productionRouter.get(
  '/:id/characters',
  requirePermission('productions.view'),
  catchAsync((req, res) => controller.listCharacters(req, res))
);

export default productionRouter;
