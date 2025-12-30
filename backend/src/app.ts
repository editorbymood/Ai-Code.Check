
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error';
import routes from './routes';
import webhookRoutes from './routes/webhookRoutes';

const app = express();

// Middleware
app.use(cors());

// Webhooks (before body parser if they need raw body, but current controller uses body parser)
// server.ts: /webhooks/github
app.use('/webhooks', express.json(), webhookRoutes);

// Global Body Parser
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '2.0.0-layered' });
});

// API Routes
app.use('/api', routes);

// 404
app.all('*', (req, res, next) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

export { app };
