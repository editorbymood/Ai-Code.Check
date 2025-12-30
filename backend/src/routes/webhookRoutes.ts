
import { Router } from 'express';
import * as webhookController from '../controllers/webhookController';

const router = Router();

router.post('/github', webhookController.handleGithubWebhook);

export default router;
