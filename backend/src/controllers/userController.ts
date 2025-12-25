import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                marketingEmails: true,
                securityAlerts: true,
                tenant: { select: { name: true, plan: true } }
            }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;
        const { name, marketingEmails, securityAlerts } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                marketingEmails,
                securityAlerts
            }
        });

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const getApiKeys = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;

        const keys = await prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(keys);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch API keys' });
    }
};

export const createApiKey = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: 'Key name required' });
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const key = `dx_${uuidv4().replace(/-/g, '')}`; // Mock key generation

        const apiKey = await prisma.apiKey.create({
            data: {
                userId: userId,
                name,
                key
            }
        });

        res.json(apiKey);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create API key' });
    }
};

export const deleteApiKey = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;
        const { id } = req.params;

        // Verify ownership
        const key = await prisma.apiKey.findUnique({ where: { id } });
        if (!key || key.userId !== userId) {
            return res.status(404).json({ error: 'Key not found' });
        }

        await prisma.apiKey.delete({ where: { id } });

        res.json({ message: 'Key deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete API key' });
    }
};
