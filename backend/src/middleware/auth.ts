import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../utils/AppError';

// JWT_SECRET is now guaranteed by env.ts

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
        tenantId?: string;
    };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError('No token provided', 401));
    }

    jwt.verify(token, env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return next(new AppError('Invalid or expired token', 403));
        }
        (req as AuthRequest).user = user;
        next();
    });
};

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as AuthRequest).user;
        if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
