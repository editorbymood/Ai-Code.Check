import { Server, Socket } from 'socket.io';
import http from 'http';

interface AnalysisProgress {
    agentName: string;
    status: 'pending' | 'scanning' | 'complete' | 'error';
    message: string;
    details?: any;
    progress?: number;
}

class SocketServer {
    private io: Server | null = null;
    private userSockets: Map<string, string> = new Map(); // userId -> socketId

    initialize(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: "*", // Adjust for production
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected:', socket.id);

            socket.on('register', (userId: string) => {
                this.userSockets.set(userId, socket.id);
                socket.join(`user:${userId}`);
                console.log(`User registered: ${userId} -> ${socket.id}`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    emitProgress(userId: string | undefined, data: AnalysisProgress) {
        if (!this.io) return;

        if (userId) {
            this.io.to(`user:${userId}`).emit('analysis:progress', data);
        } else {
            // If no user ID (anon), emit to everyone (demo mode) or handle via session ID
            // For this demo, let's assume we pass a session ID or just broadcast for 'anon' users who join a room
            // Revert: simplistic approach, broadcast to all for demo if strict user match fails?
            // Better: 'reviewId' based room.
        }
    }

    emitToReview(reviewId: string, event: string, data: any) {
        if (!this.io) return;
        this.io.to(`review:${reviewId}`).emit(event, data);
    }

    // Allow clients to join a review room
    joinReview(socketId: string, reviewId: string) {
        // Logic to find socket by ID not easily exposed unless we track it or handle 'join' event from client
    }
}

export const socketServer = new SocketServer();
