
import { Router } from 'express';
import * as billingController from '../controllers/billingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/create-session', authenticateToken, billingController.createCheckoutSession);

export default router;
