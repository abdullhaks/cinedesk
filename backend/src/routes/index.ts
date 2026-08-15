import express from 'express';
import authRouter from './auth.routes';
import roleRouter from './role.routes';
import onboardingRouter from './onboarding.routes';
import userRouter from './user.routes';
import productionRouter from './production.routes';
import locationRouter from './location.routes';
import fundRequestRouter from './fundRequest.routes';
import costumeRouter from './costume.routes';
import auditLogRouter from './auditLog.routes';
import notificationRouter from './notification.routes';
import dashboardRouter from './dashboard.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/roles', roleRouter);
router.use('/onboarding', onboardingRouter);
router.use('/users', userRouter);
router.use('/productions', productionRouter);
router.use('/locations', locationRouter);
router.use('/fund-requests', fundRequestRouter);
router.use('/funds', fundRequestRouter);
router.use('/costumes', costumeRouter);
router.use('/audit-logs', auditLogRouter);
router.use('/notifications', notificationRouter);
router.use('/dashboard', dashboardRouter);

export default router;
