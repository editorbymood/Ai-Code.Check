
import { app } from './app';
import http from 'http';
import { env } from './config/env';
import { logger } from './utils/logger';
import { socketServer } from './services/socketServer';

const server = http.createServer(app);

// Initialize Socket.io
socketServer.initialize(server);

server.listen(env.PORT, () => {
    logger.info(`Server running at http://localhost:${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Health Check: http://localhost:${env.PORT}/health`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
