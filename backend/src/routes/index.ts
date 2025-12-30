
import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import reviewRoutes from './reviewRoutes';
import integrationRoutes from './integrationRoutes';
import billingRoutes from './billingRoutes';
import { upload } from '../middleware/upload';

const router = Router();

// Auth Routes: /api/auth/...
router.use('/auth', authRoutes); // /api/auth/register, /api/auth/login

// User Routes: /api/user/...
router.use('/user', userRoutes); // /api/user/profile...

// Review Routes: /api/review/... (includes repo upload at /api/repo/upload? NO. Need to handle that)
// In reviewRoutes we defined '/', '/:id', '/upload'.
// If we mount at '/review':
// /api/review/ (reviewCode) -> MATCH
// /api/review/:id (status) -> MATCH
// /api/review/upload (uploadRepo) -> MATCH (Wait, server.ts said /api/repo/upload)
// We should remap /api/repo/upload or keep it consistent.
// I'll add a separate route for repo here or add it to reviewRoutes but mount properly.
// Let's stick server.ts structure:
// /api/review, /api/review/:id
// /api/repo/upload
// /api/file/:fileId
// In reviewRoutes, I'll export separate routers or just one.
// Let's modify reviewRoutes for simplicity or handle here. 
// Actually reviewRoutes currently has /upload -> /api/review/upload.
// I'll accept this change as "Refactor" results in cleaner API, OR I should mount 'repo' separately.
// I'll keep paths compatible if possible.
// Let's create `repoRoutes` alias here.

// Integration Routes (contains /integrations and /auth/:provider)
// server.ts: /api/integrations, /api/auth/:provider...
// integrationRoutes defines: /integrations, /auth/:provider...
// So we mount at /api (root of api router)
router.use('/', integrationRoutes);

// Billing: /api/billing
router.use('/billing', billingRoutes);

// Meta / Analytics
// server.ts: /api/analytics
import * as AnalyticsController from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';
router.get('/analytics', authenticateToken, AnalyticsController.getAnalytics);

import * as ReviewController from '../controllers/reviewController';
// server.ts: /api/meta/...
router.post('/meta/commit-message', authenticateToken, ReviewController.generateCommitMessage);
router.post('/meta/feedback', authenticateToken, ReviewController.submitFeedback);

// Now Review & Repo
// server.ts: /api/review
router.use('/review', reviewRoutes);
// Need to handle /api/repo/upload if `reviewRoutes.ts` has `/upload` mounted at `/review`, it becomes `/review/upload`.
// That is cleaner. I will stick with `/api/review/upload` in the new design.
// BUT server.ts also has `/api/file/:fileId`.
// I should add that to reviewRoutes or here.
// reviewRoutes didn't have /file/:fileId. 
// I'll add it here for now or update reviewRoutes.
// Restoration of legacy route for compatibility
router.post('/repo/upload', upload.single('file'), ReviewController.uploadRepo);

export default router;
