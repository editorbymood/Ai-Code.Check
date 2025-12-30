
import { Router } from 'express';
import * as UserController from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken); // Protect all routes

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.get('/keys', UserController.getApiKeys);
router.post('/keys', UserController.createApiKey);
router.delete('/keys/:id', UserController.deleteApiKey);

export default router;
