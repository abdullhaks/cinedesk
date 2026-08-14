import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IFundRequestController } from '../controllers/interfaces/IFundRequest.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { catchAsync } from '../utils/catchAsync';

const fundRequestRouter = express.Router();
const controller = container.get<IFundRequestController>(TYPES.IFundRequestController);

fundRequestRouter.use(authenticate);

// GET /api/fund-requests — list fund requests
fundRequestRouter.get(
  '/',
  requirePermission('funds.view'),
  catchAsync((req, res) => controller.listRequests(req, res))
);

// POST /api/fund-requests — create fund request
fundRequestRouter.post(
  '/',
  requirePermission('funds.request'),
  catchAsync((req, res) => controller.createRequest(req, res))
);

// GET /api/fund-requests/:id — detail fund request
fundRequestRouter.get(
  '/:id',
  requirePermission('funds.view'),
  catchAsync((req, res) => controller.getRequestById(req, res))
);

// POST /api/fund-requests/:id/submit — submit draft request
fundRequestRouter.post(
  '/:id/submit',
  requirePermission('funds.request'),
  catchAsync((req, res) => controller.submitRequest(req, res))
);

// PATCH /api/fund-requests/:id/approve — approve fund request (with self-approval guard)
fundRequestRouter.patch(
  '/:id/approve',
  requirePermission('funds.approve'),
  catchAsync((req, res) => controller.approveRequest(req, res))
);

// PATCH /api/fund-requests/:id/reject — reject fund request
fundRequestRouter.patch(
  '/:id/reject',
  requirePermission('funds.approve'),
  catchAsync((req, res) => controller.rejectRequest(req, res))
);

// PATCH /api/fund-requests/:id/disburse — disburse/pay fund request
fundRequestRouter.patch(
  '/:id/disburse',
  requirePermission('funds.approve'),
  catchAsync((req, res) => controller.disburseRequest(req, res))
);

// DELETE /api/fund-requests/:id — delete request
fundRequestRouter.delete(
  '/:id',
  requirePermission('funds.request'),
  catchAsync((req, res) => controller.deleteRequest(req, res))
);

export default fundRequestRouter;
