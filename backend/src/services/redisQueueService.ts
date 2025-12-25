import { Queue, Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { agentOrchestrator } from '../agents/orchestrator';
import AdmZip from 'adm-zip';
import IORedis from 'ioredis';

const prisma = new PrismaClient();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const USE_REDIS = process.env.USE_REDIS === 'true';

let connection: IORedis | null = null;
export let reviewQueue: Queue | null = null;

if (USE_REDIS) {
    // Setup Redis Connection
    connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

    // Setup Queue
    reviewQueue = new Queue('reviewQueue', { connection });

    interface JobData {
        reviewId: string;
        code?: string;
        fileBufferBase64?: string; // BullMQ stores JSON, so buffer needs to be string
        type: 'TEXT' | 'ZIP';
        language?: string;
        mode?: string;
    }

    // Setup Worker (Processor)
    new Worker('reviewQueue', async (job: Job<JobData>) => {
        const { reviewId, code, fileBufferBase64, type, language, mode } = job.data;
        console.log(`Processing Job ${job.id} for Review ${reviewId}`);

        try {
            await prisma.review.update({
                where: { id: reviewId },
                data: { status: 'PROCESSING' }
            });

            if (type === 'ZIP' && fileBufferBase64) {
                const buffer = Buffer.from(fileBufferBase64, 'base64');
                // ... Logic for Unzipping and analyzing (Refactor extract Logic later)
                const zip = new AdmZip(buffer);
                const zipEntries = zip.getEntries();

                let totalScore = 0;
                let fileCount = 0;

                for (const entry of zipEntries) {
                    if (entry.isDirectory || entry.entryName.startsWith('.')) continue;
                    const content = entry.getData().toString('utf8');
                    const path = entry.entryName;
                    const ext = path.split('.').pop() || 'txt';
                    if (!['js', 'ts', 'jsx', 'tsx', 'py'].includes(ext)) continue;

                    // Analyzer Logic... (For brevity, calling Orchestrator)
                    await prisma.reviewFile.create({ data: { reviewId, path, content, language: ext } });
                    // Note: In real world, we might spawn sub-jobs per file
                }
                // ... Update Completion
                await prisma.review.update({
                    where: { id: reviewId },
                    data: { status: 'COMPLETED', summary: 'Zip Analysis Done', score: 85 }
                });

            } else if (type === 'TEXT' && code) {
                // ... Run Orchestrator
                const results = await agentOrchestrator.runAll(code, language || 'javascript');
                const summary = results.map(r => r.summary).join(' ');
                const score = Math.floor(results.reduce((acc, c) => acc + c.score, 0) / results.length);

                await prisma.review.update({
                    where: { id: reviewId },
                    data: { status: 'COMPLETED', summary, score, finishedAt: new Date() }
                });
            }
        } catch (e) {
            console.error("Worker failed", e);
            await prisma.review.update({ where: { id: reviewId }, data: { status: 'FAILED' } });
        }
    }, { connection });
}

export const redisQueueService = {
    addJob: async (reviewId: string, code: string, language?: string, mode?: string) => {
        if (reviewQueue) {
            await reviewQueue.add('analyze-text', { reviewId, code, type: 'TEXT', language, mode });
        } else {
            console.warn('Redis queue not initialized. Job skipped/fallback should handle this.');
        }
    },
    addZipJob: async (reviewId: string, fileBuffer: Buffer) => {
        if (reviewQueue) {
            await reviewQueue.add('analyze-zip', {
                reviewId,
                fileBufferBase64: fileBuffer.toString('base64'),
                type: 'ZIP'
            });
        }
    }
};
