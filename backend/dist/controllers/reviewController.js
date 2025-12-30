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
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFeedback = exports.generateCommitMessage = exports.getRefactor = exports.getScore = exports.getFileDetails = exports.getReviewStatus = exports.uploadRepo = exports.reviewCode = void 0;
const client_1 = require("@prisma/client");
const queueService_1 = require("../services/queueService");
const orchestrator_1 = require("../agents/orchestrator");
const socketServer_1 = require("../services/socketServer");
const prisma = new client_1.PrismaClient();
// Removed duplicate import
const reviewCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { code, language, mode } = req.body;
        const authReq = req;
        // Use user ID or a temporary session ID
        const userId = ((_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId) || 'anon';
        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }
        console.log(`[ReviewController] Starting real analysis for user ${userId}`);
        // 1. Create a Pending Review Record
        const review = yield prisma.review.create({
            data: {
                userId: (_b = authReq.user) === null || _b === void 0 ? void 0 : _b.userId,
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
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Notify Start
                socketServer_1.socketServer.emitToReview(review.id, 'analysis:start', { reviewId: review.id });
                // We need to modify AgentOrchestrator to support callbacks or event emission
                // For now, we wrap the call and simulate "streaming" via the orchestrator returning promises?
                // Actually, let's inject a progress callback into runAll
                // Hack: We will modify orchestrator in the next step to accept a callback.
                // For now, let's just emit "Complete" after it's done.
                // Import moved to top level in previous step
                const agentResults = yield orchestrator_1.agentOrchestrator.runAll(code, 'snippet.ts', mode || 'STANDARD', (progress) => {
                    socketServer_1.socketServer.emitToReview(review.id, 'analysis:progress', progress);
                });
                // Calculate aggregate score
                const totalScore = agentResults.reduce((acc, r) => acc + r.score, 0);
                const avgScore = Math.round(totalScore / (agentResults.length || 1));
                // Generate Summary
                const metaResult = agentResults.find((r) => r.type === 'META_ANALYSIS');
                const summary = metaResult ? metaResult.summary : `Analysis complete. Quality Score: ${avgScore}/100`;
                // Update DB
                yield prisma.review.update({
                    where: { id: review.id },
                    data: {
                        status: 'COMPLETED',
                        score: avgScore,
                        summary: summary,
                        agentOutputs: {
                            create: agentResults.map((r) => ({
                                agentType: r.type,
                                content: JSON.stringify(r)
                            }))
                        }
                    }
                });
                // Emit Completion
                socketServer_1.socketServer.emitToReview(review.id, 'analysis:complete', {
                    reviewId: review.id,
                    score: avgScore,
                    summary,
                    results: agentResults
                });
            }
            catch (err) {
                console.error("Async Analysis Failed:", err);
                socketServer_1.socketServer.emitToReview(review.id, 'analysis:error', { message: 'Internal Engine Failure' });
                yield prisma.review.update({ where: { id: review.id }, data: { status: 'FAILED' } });
            }
        }))();
    }
    catch (error) {
        console.error('Error processing review request:', error);
        res.status(500).json({ error: 'Failed to initiate review' });
    }
});
exports.reviewCode = reviewCode;
const uploadRepo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file;
        const authReq = req;
        if (!file)
            return res.status(400).json({ error: "No file uploaded" });
        const review = yield prisma.review.create({
            data: {
                userId: (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId,
                summary: `Repository Upload: ${file.originalname}`,
                status: 'QUEUED'
            }
        });
        queueService_1.queueService.addZipJob(review.id, file.buffer);
        res.json({
            message: 'Repository queued for analysis',
            reviewId: review.id,
            status: 'QUEUED'
        });
    }
    catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to process upload' });
    }
});
exports.uploadRepo = uploadRepo;
const getReviewStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const review = yield prisma.review.findUnique({
            where: { id },
            include: { agentOutputs: true, files: true }
        });
        if (!review)
            return res.status(404).json({ error: "Review not found" });
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
            const results = review.agentOutputs.map((ao) => {
                try {
                    return JSON.parse(ao.content);
                }
                catch (e) {
                    return null;
                }
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching status" });
    }
});
exports.getReviewStatus = getReviewStatus;
const getFileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const file = yield prisma.reviewFile.findUnique({
            where: { id: fileId },
            include: { agentOutputs: true }
        });
        if (!file)
            return res.status(404).json({ error: "File not found" });
        const results = file.agentOutputs.map((ao) => {
            try {
                return JSON.parse(ao.content);
            }
            catch (e) {
                return null;
            }
        }).filter(Boolean);
        res.json({
            id: file.id,
            path: file.path,
            content: file.content,
            results: results
        });
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching file" });
    }
});
exports.getFileDetails = getFileDetails;
const getScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () { res.status(501).json({ error: "Use /review endpoint" }); });
exports.getScore = getScore;
const getRefactor = (req, res) => __awaiter(void 0, void 0, void 0, function* () { res.status(501).json({ error: "Use /review endpoint" }); });
exports.getRefactor = getRefactor;
// Phase 14: Meta Features
const generateCommitMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diff } = req.body;
        if (!diff)
            return res.status(400).json({ error: "Diff required" });
        // Mock AI Generation for now (avoids LLM cost in this loop)
        const messages = [
            `feat: implement requested changes based on diff`,
            `fix: resolve logical issues identified in review`,
            `refactor: optimize code structure and readability`
        ];
        res.json({ message: messages[Math.floor(Math.random() * messages.length)] });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to generate commit message" });
    }
});
exports.generateCommitMessage = generateCommitMessage;
const submitFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Log feedback to DB or File for "Self-Improvement"
    console.log("User Feedback Received:", req.body);
    res.json({ status: "recorded" });
});
exports.submitFeedback = submitFeedback;
exports.default = { reviewCode: exports.reviewCode, uploadRepo: exports.uploadRepo, getReviewStatus: exports.getReviewStatus, getFileDetails: exports.getFileDetails, getScore: exports.getScore, getRefactor: exports.getRefactor, generateCommitMessage: exports.generateCommitMessage, submitFeedback: exports.submitFeedback };
