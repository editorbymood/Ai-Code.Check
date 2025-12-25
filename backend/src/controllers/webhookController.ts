import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { queueService } from '../services/queueService';

const prisma = new PrismaClient();

export const handleGithubWebhook = async (req: Request, res: Response) => {
    try {
        const event = req.headers['x-github-event'];
        const payload = req.body;

        console.log(`Received GitHub Webhook: ${event}`);

        if (event === 'push') {
            const repoUrl = payload.repository?.html_url;
            const commitId = payload.after;
            const pusher = payload.pusher?.name;

            // In a real app, we would clone the repo here or download the archive using the token.
            // For this MVP/Mock, we will simulate queueing a job for this repo.
            // We'll create a "Review" linked to a placeholder user or system.

            // Check if we have a tenant/repo matching this URL (mock logic)
            // const repo = await prisma.repository.findFirst({ where: { url: repoUrl } });

            console.log(`Triggering Review for Push: ${commitId} by ${pusher} in ${repoUrl}`);

            const review = await prisma.review.create({
                data: {
                    summary: `GitHub Push: ${commitId}`,
                    status: 'QUEUED',
                    codeSnapshot: `Repository: ${repoUrl}\nCommit: ${commitId}`
                }
            });

            // Add a mock "Zip" job or just text job
            queueService.addJob(review.id, "// GitHub Repo Content would be here...", "javascript");

            return res.json({ message: 'Webhook received and review queued', reviewId: review.id });
        }

        res.json({ message: 'Event ignored' });

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Webhook failed' });
    }
};
