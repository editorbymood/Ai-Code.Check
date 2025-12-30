
import { Router } from 'express';
import * as ReviewController from '../controllers/reviewController';
import * as AnalyticsController from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

// Review
router.post('/', ReviewController.reviewCode); // /api/review
router.get('/:id', ReviewController.getReviewStatus); // /api/review/:id

// Repo Upload
router.post('/upload', upload.single('file'), ReviewController.uploadRepo); // /api/repo/upload -> but wait, index.ts will mount this. 
// Server.ts had /api/repo/upload. 
// If I mount this at /api/review, it becomes /api/review/upload. 
// If I mount at /api, I need separate files or handle it cleanly.
// I will create a separate repoRoutes or just handle generic review things. 
// server.ts had:
// app.post('/api/review', ...);
// app.post('/api/repo/upload', ...); 
// I'll stick to server.ts paths but organized via index.ts. 
// Let's make this file `reviewRoutes` handle `/api/review` and I'll create `repoRoutes` for `/api/repo`. 
// OR I can group them if logical. Repo upload IS a review initiation. 
// But the path in server.ts was /api/repo/upload. 
// I should probably follow the existing API contract unless I want to break frontend.
// I will create `repoRoutes.ts` separately for `/api/repo`.

// Meta & Analytics
// Server.ts: /api/meta/..., /api/analytics
// I'll handle these in their own or here? 
// Analytics is simple. Meta is simple. 
// I'll export multiple routers or just one router and mount it at /api and define full paths? 
// Standard express way is mounting at subpaths. 
// /api/review -> reviewRoutes
// /api/repo -> repoRoutes
// /api/meta -> metaRoutes
// /api/analytics -> analyticsRoutes
// This creates many small files but it's clean.

export default router;
