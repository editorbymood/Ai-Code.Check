import { PrismaClient } from '@prisma/client';
import { agentOrchestrator } from '../agents/orchestrator';
import AdmZip from 'adm-zip';

const prisma = new PrismaClient();

interface Job {
    reviewId: string;
    code?: string; // Text snippet
    fileBuffer?: Buffer; // ZIP content
    type: 'TEXT' | 'ZIP';
    language?: string;
    mode?: string; // Added mode: 'DEBATE' etc.
}

const queue: Job[] = [];
let processing = false;

import { redisQueueService } from './redisQueueService';

// Fallback in-memory queue for dev/mvp
const memoryQueue: Job[] = [];
// ...

export const queueService = {
    addJob: async (reviewId: string, code: string, language?: string, mode?: string) => {
        // Logic to prefer Redis
        if (process.env.USE_REDIS === 'true') {
            return redisQueueService.addJob(reviewId, code, language, mode);
        }
        // Fallback
        queue.push({ reviewId, code, type: 'TEXT', language, mode });
        processQueue();
    },
    addZipJob: async (reviewId: string, fileBuffer: Buffer) => {
        if (process.env.USE_REDIS === 'true') {
            return redisQueueService.addZipJob(reviewId, fileBuffer);
        }
        queue.push({ reviewId, fileBuffer, type: 'ZIP' });
        processQueue();
    }
};

const processQueue = async () => {
    if (processing || queue.length === 0) return;
    processing = true;

    const job = queue.shift();
    if (!job) {
        processing = false;
        return;
    }

    try {
        console.log(`Processing review ${job.reviewId} (${job.type})...`);
        await prisma.review.update({
            where: { id: job.reviewId },
            data: { status: 'PROCESSING' }
        });

        if (job.type === 'ZIP' && job.fileBuffer) {
            // Extract Zip
            const zip = new AdmZip(job.fileBuffer);
            const zipEntries = zip.getEntries();

            let totalScore = 0;
            let fileCount = 0;

            for (const entry of zipEntries) {
                if (entry.isDirectory || entry.entryName.startsWith('.') || entry.entryName.includes('node_modules')) continue;

                const content = entry.getData().toString('utf8');
                const path = entry.entryName;

                // Basic language detection from extension
                const ext = path.split('.').pop() || 'txt';
                // Only process code files
                if (!['js', 'ts', 'jsx', 'tsx', 'py', 'go', 'java', 'cpp'].includes(ext)) continue;

                // Create File Record
                const reviewFile = await prisma.reviewFile.create({
                    data: {
                        reviewId: job.reviewId,
                        path: path,
                        content: content,
                        language: ext
                    }
                });

                // Analyze File
                const results = await agentOrchestrator.runAll(content, ext);

                // Store Results for this file
                for (const res of results) {
                    await prisma.agentOutput.create({
                        data: {
                            fileId: reviewFile.id,
                            agentType: res.type,
                            content: JSON.stringify(res)
                        }
                    });
                }

                const fileScore = Math.floor(results.reduce((acc, curr) => acc + curr.score, 0) / results.length);
                totalScore += fileScore;
                fileCount++;
            }

            // Finalize Review
            await prisma.review.update({
                where: { id: job.reviewId },
                data: {
                    status: 'COMPLETED',
                    score: fileCount > 0 ? Math.floor(totalScore / fileCount) : 0,
                    summary: `Analyzed ${fileCount} files from repository archive.`,
                    finishedAt: new Date()
                }
            });

        } else if (job.type === 'TEXT' && job.code) {
            // Check for Debate Mode
            if (job.mode === 'DEBATE') {
                const debateTranscript = await agentOrchestrator.runDebate(job.code);

                // Store as a special Agent Output
                await prisma.agentOutput.create({
                    data: {
                        reviewId: job.reviewId,
                        agentType: 'DEBATE_TRANSCRIPT',
                        content: JSON.stringify({ summary: debateTranscript, score: 50, issues: [] })
                    }
                });

                await prisma.review.update({
                    where: { id: job.reviewId },
                    data: {
                        status: 'COMPLETED',
                        score: 50, // Neutral score for debate
                        summary: "Debate Concluded. See Transcript.",
                        finishedAt: new Date()
                    }
                });

            } else {
                // Standard Multi-Agent Analysis
                const results = await agentOrchestrator.runAll(job.code, job.language || 'javascript');

                for (const res of results) {
                    await prisma.agentOutput.create({
                        data: {
                            reviewId: job.reviewId,
                            agentType: res.type,
                            content: JSON.stringify(res)
                        }
                    });
                }

                const overallScore = Math.floor(results.reduce((acc, curr) => acc + curr.score, 0) / results.length);
                const summary = results.map(r => r.summary).join(' ');

                await prisma.review.update({
                    where: { id: job.reviewId },
                    data: {
                        status: 'COMPLETED',
                        score: overallScore,
                        summary: summary,
                        finishedAt: new Date()
                    }
                });
            }
        }

        console.log(`Review ${job.reviewId} completed.`);

    } catch (error) {
        console.error(`Job ${job.reviewId} failed`, error);
        await prisma.review.update({
            where: { id: job.reviewId },
            data: { status: 'FAILED' }
        });
    } finally {
        processing = false;
        processQueue();
    }
};
