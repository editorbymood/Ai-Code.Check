"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("./middleware/auth");
const ReviewController = __importStar(require("./controllers/reviewController"));
const AuthController = __importStar(require("./controllers/authController"));
const AnalyticsController = __importStar(require("./controllers/analyticsController"));
const webhookController = __importStar(require("./controllers/webhookController"));
const billingController = __importStar(require("./controllers/billingController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' })); // Increase limit for code snippets
// File Upload Config
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
// Auth Routes
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);
// Integration Routes (Enterprise)
app.post('/webhooks/github', webhookController.handleGithubWebhook);
app.post('/api/billing/create-session', auth_1.authenticateToken, billingController.createCheckoutSession);
// Protected Routes
app.post('/api/review', auth_1.authenticateToken, ReviewController.reviewCode);
app.get('/api/review/:id', auth_1.authenticateToken, ReviewController.getReviewStatus);
// Upload Repo Endpoint
app.post('/api/repo/upload', auth_1.authenticateToken, upload.single('file'), ReviewController.uploadRepo);
app.get('/api/file/:fileId', auth_1.authenticateToken, ReviewController.getFileDetails);
// Meta Features (Phase 14)
app.post('/api/meta/commit-message', auth_1.authenticateToken, ReviewController.generateCommitMessage);
app.post('/api/meta/feedback', auth_1.authenticateToken, ReviewController.submitFeedback);
app.get('/api/analytics', auth_1.authenticateToken, AnalyticsController.getAnalytics); // Phase 9 Analytics
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0-enterprise' });
});
// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
