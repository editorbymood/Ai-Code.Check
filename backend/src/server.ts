import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { authenticateToken } from './middleware/auth';
import * as ReviewController from './controllers/reviewController';
import * as AuthController from './controllers/authController';
import * as AnalyticsController from './controllers/analyticsController';
import * as webhookController from './controllers/webhookController';
import * as billingController from './controllers/billingController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for code snippets

// File Upload Config
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

import * as UserController from './controllers/userController';

// ... (existing imports)

// Auth Routes
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);

// User Routes
app.get('/api/user/profile', authenticateToken, UserController.getProfile);
app.put('/api/user/profile', authenticateToken, UserController.updateProfile);
app.get('/api/user/keys', authenticateToken, UserController.getApiKeys);
app.post('/api/user/keys', authenticateToken, UserController.createApiKey);
app.delete('/api/user/keys/:id', authenticateToken, UserController.deleteApiKey);

import * as IntegrationController from './controllers/integrationController';
app.get('/api/integrations', authenticateToken, IntegrationController.listIntegrations);
app.get('/api/auth/:provider/connect', IntegrationController.connectIntegration);
app.get('/api/auth/:provider/callback', IntegrationController.handleCallback);

// Integration Routes (Enterprise)
app.post('/webhooks/github', webhookController.handleGithubWebhook);
app.post('/api/billing/create-session', authenticateToken, billingController.createCheckoutSession);

// Protected Routes
app.post('/api/review', authenticateToken, ReviewController.reviewCode);
app.get('/api/review/:id', authenticateToken, ReviewController.getReviewStatus);

// Upload Repo Endpoint
app.post('/api/repo/upload', authenticateToken, upload.single('file'), ReviewController.uploadRepo);
app.get('/api/file/:fileId', authenticateToken, ReviewController.getFileDetails);

// Meta Features (Phase 14)
app.post('/api/meta/commit-message', authenticateToken, ReviewController.generateCommitMessage);
app.post('/api/meta/feedback', authenticateToken, ReviewController.submitFeedback);
app.get('/api/analytics', authenticateToken, AnalyticsController.getAnalytics); // Phase 9 Analytics

app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0-enterprise' });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
