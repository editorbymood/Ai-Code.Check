import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { queueService } from '../services/queueService';
import { AuthRequest } from '../middleware/auth';
import { agentOrchestrator } from '../agents/orchestrator';
import { socketServer } from '../services/socketServer';

const prisma = new PrismaClient();

export interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Removed duplicate import

export const reviewCode = async (req: Request, res: Response) => {
    try {
        const { code, language, mode } = req.body;
        const authReq = req as AuthRequest;

        // Use user ID or a temporary session ID
        const userId = authReq.user?.userId || 'anon';

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        console.log(`[ReviewController] Starting real analysis for user ${userId}`);

        // 1. Create a Pending Review Record
        const review = await prisma.review.create({
            data: {
                userId: authReq.user?.userId,
                codeSnapshot: code.substring(0, 100) + "...",
                status: 'ANALYZING',
                score: 0,
                summary: 'Initializing analysis engines...'
            }
        });

        // 2. Return the review ID immediately so client can subscribe
        res.json({
            message: 'Analysis started',
            reviewId: review.id,
            status: 'ANALYZING'
        });

        // 3. Run Analysis Asynchronously
        (async () => {
            try {
                // Notify Start
                socketServer.emitToReview(review.id, 'analysis:start', { reviewId: review.id });

                // We need to modify AgentOrchestrator to support callbacks or event emission
                // For now, we wrap the call and simulate "streaming" via the orchestrator returning promises?
                // Actually, let's inject a progress callback into runAll

                // Hack: We will modify orchestrator in the next step to accept a callback.
                // For now, let's just emit "Complete" after it's done.

                // Import moved to top level in previous step
                const agentResults = await agentOrchestrator.runAll(
                    code,
                    'snippet.ts',
                    mode || 'STANDARD',
                    (progress) => {
                        socketServer.emitToReview(review.id, 'analysis:progress', progress);
                    }
                );

                // Calculate aggregate score
                const totalScore = agentResults.reduce((acc: number, r: any) => acc + r.score, 0);
                const avgScore = Math.round(totalScore / (agentResults.length || 1));

                // Generate Summary
                const metaResult = agentResults.find((r: any) => r.type === 'META_ANALYSIS');
                const summary = metaResult ? metaResult.summary : `Analysis complete. Quality Score: ${avgScore}/100`;

                // Update DB
                await prisma.review.update({
                    where: { id: review.id },
                    data: {
                        status: 'COMPLETED',
                        score: avgScore,
                        summary: summary,
                        agentOutputs: {
                            create: agentResults.map((r: any) => ({
                                agentType: r.type,
                                content: JSON.stringify(r)
                            }))
                        }
                    }
                });

                // Emit Completion
                socketServer.emitToReview(review.id, 'analysis:complete', {
                    reviewId: review.id,
                    score: avgScore,
                    summary,
                    results: agentResults
                });

            } catch (err) {
                console.error("Async Analysis Failed:", err);
                socketServer.emitToReview(review.id, 'analysis:error', { message: 'Internal Engine Failure' });
                await prisma.review.update({ where: { id: review.id }, data: { status: 'FAILED' } });
            }
        })();

    } catch (error) {
        console.error('Error processing review request:', error);
        res.status(500).json({ error: 'Failed to initiate review' });
    }
};

export const uploadRepo = async (req: Request, res: Response) => {
    try {
        const file = (req as MulterRequest).file;
        const authReq = req as AuthRequest;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const review = await prisma.review.create({
            data: {
                userId: authReq.user?.userId,
                summary: `Repository Upload: ${file.originalname}`,
                status: 'QUEUED'
            }
        });

        queueService.addZipJob(review.id, file.buffer);

        res.json({
            message: 'Repository queued for analysis',
            reviewId: review.id,
            status: 'QUEUED'
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to process upload' });
    }
}

export const getReviewStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const review = await prisma.review.findUnique({
            where: { id },
            include: { agentOutputs: true, files: true }
        });
        if (!review) return res.status(404).json({ error: "Review not found" });

        // If completed, return the Analysis Result structure
        // Since we have multiple agents, we need to aggregate them for the frontend
        if (review.status === 'COMPLETED') {
            // If multi-file
            if (review.files.length > 0) {
                return res.json({
                    status: 'COMPLETED',
                    reviewId: id,
                    summary: review.summary,
                    qualityScore: review.score,
                    files: review.files.map(f => ({ id: f.id, path: f.path, score: 0 })) // Basic file list
                });
            }

            // Single file legacy
            const results = review.agentOutputs.map((ao: any) => {
                try { return JSON.parse(ao.content); } catch (e) { return null; }
            }).filter(Boolean);

            return res.json({
                status: 'COMPLETED',
                reviewId: id,
                summary: review.summary,
                qualityScore: review.score,
                results: results
            });
        }

        res.json({ status: review.status, reviewId: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching status" });
    }
}

export const getFileDetails = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        const file = await prisma.reviewFile.findUnique({
            where: { id: fileId },
            include: { agentOutputs: true }
        });
        if (!file) return res.status(404).json({ error: "File not found" });

        const results = file.agentOutputs.map((ao: any) => {
            try { return JSON.parse(ao.content); } catch (e) { return null; }
        }).filter(Boolean);

        res.json({
            id: file.id,
            path: file.path,
            content: file.content,
            results: results
        });

    } catch (err) {
        res.status(500).json({ error: "Error fetching file" });
    }
}



export const getScore = async (req: Request, res: Response) => { res.status(501).json({ error: "Use /review endpoint" }); }
export const getRefactor = async (req: Request, res: Response) => { res.status(501).json({ error: "Use /review endpoint" }); }

// Phase 14: Meta Features
export const generateCommitMessage = async (req: Request, res: Response) => {
    try {
        const { diff } = req.body;
        if (!diff) return res.status(400).json({ error: "Diff required" });

        // Mock AI Generation for now (avoids LLM cost in this loop)
        const messages = [
            `feat: implement requested changes based on diff`,
            `fix: resolve logical issues identified in review`,
            `refactor: optimize code structure and readability`
        ];

        res.json({ message: messages[Math.floor(Math.random() * messages.length)] });
    } catch (e) {
        res.status(500).json({ error: "Failed to generate commit message" });
    }
}

export const submitFeedback = async (req: Request, res: Response) => {
    // Log feedback to DB or File for "Self-Improvement"
    console.log("User Feedback Received:", req.body);
    res.json({ status: "recorded" });
}

export default { reviewCode, uploadRepo, getReviewStatus, getFileDetails, getScore, getRefactor, generateCommitMessage, submitFeedback };
