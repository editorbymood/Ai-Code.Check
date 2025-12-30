"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = void 0;
const socket_io_1 = require("socket.io");
class SocketServer {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> socketId
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*", // Adjust for production
                methods: ["GET", "POST"]
            }
        });
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('register', (userId) => {
                this.userSockets.set(userId, socket.id);
                socket.join(`user:${userId}`);
                console.log(`User registered: ${userId} -> ${socket.id}`);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    emitProgress(userId, data) {
        if (!this.io)
            return;
        if (userId) {
            this.io.to(`user:${userId}`).emit('analysis:progress', data);
        }
        else {
            // If no user ID (anon), emit to everyone (demo mode) or handle via session ID
            // For this demo, let's assume we pass a session ID or just broadcast for 'anon' users who join a room
            // Revert: simplistic approach, broadcast to all for demo if strict user match fails?
            // Better: 'reviewId' based room.
        }
    }
    emitToReview(reviewId, event, data) {
        if (!this.io)
            return;
        this.io.to(`review:${reviewId}`).emit(event, data);
    }
    // Allow clients to join a review room
    joinReview(socketId, reviewId) {
        // Logic to find socket by ID not easily exposed unless we track it or handle 'join' event from client
    }
}
exports.socketServer = new SocketServer();
