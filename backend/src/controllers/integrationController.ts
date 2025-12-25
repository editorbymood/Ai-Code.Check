import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// In a real app, these would come from env vars
const PROVIDERS = {
    github: { authUrl: 'https://github.com/login/oauth/authorize', clientId: 'mock_client_id' },
    gitlab: { authUrl: 'https://gitlab.com/oauth/authorize', clientId: 'mock_client_id' },
    bitbucket: { authUrl: 'https://bitbucket.org/site/oauth2/authorize', clientId: 'mock_client_id' },
    slack: { authUrl: 'https://slack.com/oauth/v2/authorize', clientId: 'mock_client_id' }
};

export const listIntegrations = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;

        const integrations = await prisma.integration.findMany({
            where: { userId }
        });

        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch integrations' });
    }
};

export const connectIntegration = async (req: Request, res: Response) => {
    try {
        const { provider } = req.params;
        const { token } = req.query; // Auth token passed in query for window redirect

        // Serve a simple HTML page that simulates the provider's login
        // This avoids needing real OAuth credentials for the demo
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Connect ${provider}</title>
                <style>
                    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; color: #333; }
                    .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; width: 300px; }
                    .btn { display: block; width: 100%; padding: 10px; margin-top: 20px; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 16px; }
                    .authorize { background: #2ea44f; }
                    .cancel { background: #666; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>Authorize Devoxa</h2>
                    <p>Devoxa would like to access your <strong>${provider}</strong> account.</p>
                    <form action="/api/auth/${provider}/callback" method="GET">
                        <input type="hidden" name="token" value="${token}" />
                        <input type="hidden" name="code" value="mock_auth_code_123" />
                        <button type="submit" class="btn authorize">Authorize ${provider}</button>
                    </form>
                    <button onclick="window.close()" class="btn cancel">Cancel</button>
                </div>
            </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        res.status(500).send('Error initiating connection');
    }
};

export const handleCallback = async (req: Request, res: Response) => {
    try {
        const { provider } = req.params;
        const { token } = req.query; // In real flow, we'd use session/cookie, but utilizing query for simplicity here

        if (!token) return res.send("Error: Missing auth token. Please go back and try again.");

        // Decode token to get userId (Mock verify)
        // In real app: verify(token, secret)
        // We'll trust the token passed back from our own mock form for MVP simplicity or import jsonwebtoken to verify
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(token as string) as any;

        if (!decoded || !decoded.userId) return res.send("Error: Invalid token.");

        const userId = decoded.userId;

        // Check if exists
        const existing = await prisma.integration.findFirst({
            where: { userId, provider }
        });

        if (existing) {
            await prisma.integration.update({
                where: { id: existing.id },
                data: { accessToken: 'mock_access_token_updated' }
            });
        } else {
            await prisma.integration.create({
                data: {
                    userId,
                    provider,
                    accessToken: 'mock_access_token_new',
                    profileData: JSON.stringify({ username: `${provider}_user` })
                }
            });
        }

        // Redirect back to frontend
        // Note: In production this should be dynamic or env var
        res.redirect('http://localhost:3000/integrations?success=true');

    } catch (error) {
        console.error(error);
        res.status(500).send('Integration failed');
    }
};
