import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IOnboardingController } from '../controllers/interfaces/IOnboarding.controller';
import { authenticate } from '../middlewares/authenticate';
import { requirePermission } from '../middlewares/requirePermission';
import { upload } from '../middlewares/uploadHandler';
import { catchAsync } from '../utils/catchAsync';

const onboardingRouter = express.Router();
const controller = container.get<IOnboardingController>(TYPES.IOnboardingController);

onboardingRouter.use(authenticate);

// GET /api/onboarding/my-application — authenticated user's own application
onboardingRouter.get(
  '/my-application',
  catchAsync((req, res) => controller.getMyApplication(req, res))
);

// POST /api/onboarding — creates draft application, blocks duplicate non-rejected app
onboardingRouter.post(
  '/',
  catchAsync((req, res) => controller.createDraft(req, res))
);

// POST /api/onboarding/upload — upload document file
onboardingRouter.post(
  '/upload',
  upload.single('file'),
  catchAsync((req, res) => controller.uploadDocument(req, res))
);

// PUT /api/onboarding/:id/step/:stepName — update step data
onboardingRouter.put(
  '/:id/step/:stepName',
  catchAsync((req, res) => controller.updateStep(req, res))
);

// POST /api/onboarding/:id/submit — submit application -> pending_review
onboardingRouter.post(
  '/:id/submit',
  catchAsync((req, res) => controller.submit(req, res))
);

// GET /api/onboarding — list applications (onboarding.review permission)
onboardingRouter.get(
  '/',
  requirePermission('onboarding.review'),
  catchAsync((req, res) => controller.list(req, res))
);

// GET /api/onboarding/:id — detail application (onboarding.review or own)
onboardingRouter.get(
  '/:id',
  catchAsync((req, res) => controller.getById(req, res))
);

// PATCH /api/onboarding/:id/review — review application (approve, reject, request_changes)
onboardingRouter.patch(
  '/:id/review',
  requirePermission('onboarding.review'),
  catchAsync((req, res) => controller.review(req, res))
);

export default onboardingRouter;
