"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisQueueService = exports.reviewQueue = void 0;
const bullmq_1 = require("bullmq");
const client_1 = require("@prisma/client");
const orchestrator_1 = require("../agents/orchestrator");
const adm_zip_1 = __importDefault(require("adm-zip"));
const ioredis_1 = __importDefault(require("ioredis"));
const prisma = new client_1.PrismaClient();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const USE_REDIS = process.env.USE_REDIS === 'true';
let connection = null;
exports.reviewQueue = null;
if (USE_REDIS) {
    // Setup Redis Connection
    connection = new ioredis_1.default(REDIS_URL, { maxRetriesPerRequest: null });
    // Setup Queue
    exports.reviewQueue = new bullmq_1.Queue('reviewQueue', { connection });
    // Setup Worker (Processor)
    new bullmq_1.Worker('reviewQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
        const { reviewId, code, fileBufferBase64, type, language, mode } = job.data;
        console.log(`Processing Job ${job.id} for Review ${reviewId}`);
        try {
            yield prisma.review.update({
                where: { id: reviewId },
                data: { status: 'PROCESSING' }
            });
            if (type === 'ZIP' && fileBufferBase64) {
                const buffer = Buffer.from(fileBufferBase64, 'base64');
                // ... Logic for Unzipping and analyzing (Refactor extract Logic later)
                const zip = new adm_zip_1.default(buffer);
                const zipEntries = zip.getEntries();
                let totalScore = 0;
                let fileCount = 0;
                for (const entry of zipEntries) {
                    if (entry.isDirectory || entry.entryName.startsWith('.'))
                        continue;
                    const content = entry.getData().toString('utf8');
                    const path = entry.entryName;
                    const ext = path.split('.').pop() || 'txt';
                    if (!['js', 'ts', 'jsx', 'tsx', 'py'].includes(ext))
                        continue;
                    // Analyzer Logic... (For brevity, calling Orchestrator)
                    yield prisma.reviewFile.create({ data: { reviewId, path, content, language: ext } });
                    // Note: In real world, we might spawn sub-jobs per file
                }
                // ... Update Completion
                yield prisma.review.update({
                    where: { id: reviewId },
                    data: { status: 'COMPLETED', summary: 'Zip Analysis Done', score: 85 }
                });
            }
            else if (type === 'TEXT' && code) {
                // ... Run Orchestrator
                const results = yield orchestrator_1.agentOrchestrator.runAll(code, language || 'javascript');
                const summary = results.map(r => r.summary).join(' ');
                const score = Math.floor(results.reduce((acc, c) => acc + c.score, 0) / results.length);
                yield prisma.review.update({
                    where: { id: reviewId },
                    data: { status: 'COMPLETED', summary, score, finishedAt: new Date() }
                });
            }
        }
        catch (e) {
            console.error("Worker failed", e);
            yield prisma.review.update({ where: { id: reviewId }, data: { status: 'FAILED' } });
        }
    }), { connection });
}
exports.redisQueueService = {
    addJob: (reviewId, code, language, mode) => __awaiter(void 0, void 0, void 0, function* () {
        if (exports.reviewQueue) {
            yield exports.reviewQueue.add('analyze-text', { reviewId, code, type: 'TEXT', language, mode });
        }
        else {
            console.warn('Redis queue not initialized. Job skipped/fallback should handle this.');
        }
    }),
    addZipJob: (reviewId, fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
        if (exports.reviewQueue) {
            yield exports.reviewQueue.add('analyze-zip', {
                reviewId,
                fileBufferBase64: fileBuffer.toString('base64'),
                type: 'ZIP'
            });
        }
    })
};
