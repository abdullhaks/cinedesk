import express from 'express';
import container from '../config/inversify';
import TYPES from '../config/inversify.types';
import { IAuthController } from '../controllers/interfaces/IAuth.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { catchAsync } from '../utils/catchAsync';

const authRouter = express.Router();

const authController = container.get<IAuthController>(TYPES.IAuthController);

// POST /api/auth/register — public (internal use only)
authRouter.post(
  '/register',
  validate(registerSchema),
  catchAsync((req, res) => authController.register(req, res))
);

// POST /api/auth/register-contractor & /signup-contractor — public contractor onboarding signup
authRouter.post(
  '/register-contractor',
  catchAsync((req, res) => authController.registerContractor(req, res))
);
authRouter.post(
  '/signup-contractor',
  catchAsync((req, res) => authController.registerContractor(req, res))
);

// POST /api/auth/login — public
authRouter.post(
  '/login',
  validate(loginSchema),
  catchAsync((req, res) => authController.login(req, res))
);

// POST /api/auth/refresh — public (valid refresh cookie)
authRouter.post(
  '/refresh',
  catchAsync((req, res) => authController.refresh(req, res))
);

// POST /api/auth/logout — authenticated
authRouter.post(
  '/logout',
  authenticate,
  catchAsync((req, res) => authController.logout(req, res))
);

// GET /api/auth/me — authenticated
authRouter.get(
  '/me',
  authenticate,
  catchAsync((req, res) => authController.getMe(req, res))
);

export default authRouter;
