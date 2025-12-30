"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const socketServer_1 = require("./services/socketServer");
const server = http_1.default.createServer(app_1.app);
// Initialize Socket.io
socketServer_1.socketServer.initialize(server);
server.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server running at http://localhost:${env_1.env.PORT}`);
    logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
    logger_1.logger.info(`Health Check: http://localhost:${env_1.env.PORT}/health`);
});
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    logger_1.logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger_1.logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
