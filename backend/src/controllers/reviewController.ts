import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { queueService } from '../services/queueService';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const reviewCode = async (req: Request, res: Response) => {
    try {
        const { code, language, mode } = req.body;
        const authReq = req as AuthRequest;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        // Mock Analysis Logic (to simulate "Real" engine)
        const mockResults = [];
        let score = 85;

        // 1. Security Check
        if (code.includes('password') || code.includes('secret') || code.includes('token')) {
            score -= 20;
            mockResults.push({
                type: 'SECURITY',
                score: 60,
                summary: 'Potential hardcoded credentials detected.',
                issues: [{
                    line: 1, // Simple approximation
                    severity: 'critical',
                    description: 'Hardcoded sensitive information detected',
                    suggestion: 'Use environment variables (process.env.VAR)'
                }]
            });
        } else {
            mockResults.push({
                type: 'SECURITY',
                score: 95,
                summary: 'No obvious security vulnerabilities found.',
                issues: []
            });
        }

        // 2. Refactor Suggestion
        const refactoredCode = code.replace(/var /g, 'const ').replace(/function /g, 'const ').replace(/\(([^)]+)\) \{/g, ' = ($1) => {') + '\n // Optimized by Devoxa';

        mockResults.push({
            type: 'REFACTOR',
            score: 90,
            summary: 'Modern ES6+ syntax improvements available.',
            refactoredCode: refactoredCode,
            issues: []
        });

        // Create Completed Review Record
        const review = await prisma.review.create({
            data: {
                userId: authReq.user?.userId,
                codeSnapshot: code.substring(0, 100) + "...",
                status: 'COMPLETED', // Immediate completion
                score: score,
                summary: 'Analysis complete. Issues found in security and style.',
                agentOutputs: {
                    create: mockResults.map(r => ({
                        agentType: r.type, // Added required field
                        content: JSON.stringify(r)
                    }))
                }
            }
        });

        // Return the full result immediately for valid UX
        res.json({
            message: 'Analysis complete',
            reviewId: review.id,
            status: 'COMPLETED',
            qualityScore: score,
            summary: review.summary,
            results: mockResults,
            originalCode: code
        });

    } catch (error) {
        console.error('Error processing review:', error);
        res.status(500).json({ error: 'Failed to process review' });
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
