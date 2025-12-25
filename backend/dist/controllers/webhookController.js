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
exports.handleGithubWebhook = void 0;
const client_1 = require("@prisma/client");
const queueService_1 = require("../services/queueService");
const prisma = new client_1.PrismaClient();
const handleGithubWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const event = req.headers['x-github-event'];
        const payload = req.body;
        console.log(`Received GitHub Webhook: ${event}`);
        if (event === 'push') {
            const repoUrl = (_a = payload.repository) === null || _a === void 0 ? void 0 : _a.html_url;
            const commitId = payload.after;
            const pusher = (_b = payload.pusher) === null || _b === void 0 ? void 0 : _b.name;
            // In a real app, we would clone the repo here or download the archive using the token.
            // For this MVP/Mock, we will simulate queueing a job for this repo.
            // We'll create a "Review" linked to a placeholder user or system.
            // Check if we have a tenant/repo matching this URL (mock logic)
            // const repo = await prisma.repository.findFirst({ where: { url: repoUrl } });
            console.log(`Triggering Review for Push: ${commitId} by ${pusher} in ${repoUrl}`);
            const review = yield prisma.review.create({
                data: {
                    summary: `GitHub Push: ${commitId}`,
                    status: 'QUEUED',
                    codeSnapshot: `Repository: ${repoUrl}\nCommit: ${commitId}`
                }
            });
            // Add a mock "Zip" job or just text job
            queueService_1.queueService.addJob(review.id, "// GitHub Repo Content would be here...", "javascript");
            return res.json({ message: 'Webhook received and review queued', reviewId: review.id });
        }
        res.json({ message: 'Event ignored' });
    }
    catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Webhook failed' });
    }
});
exports.handleGithubWebhook = handleGithubWebhook;
