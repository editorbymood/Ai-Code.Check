
import { Router } from 'express';
import * as IntegrationController from '../controllers/integrationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// /api/integrations
router.get('/integrations', authenticateToken, IntegrationController.listIntegrations);

// /api/auth/:provider...
router.get('/auth/:provider/connect', IntegrationController.connectIntegration);
router.get('/auth/:provider/callback', IntegrationController.handleCallback);

export default router;
