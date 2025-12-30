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
exports.deleteApiKey = exports.createApiKey = exports.getApiKeys = exports.updateProfile = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = yield prisma.user.findUnique({
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
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { name, marketingEmails, securityAlerts } = req.body;
        const user = yield prisma.user.update({
            where: { id: userId },
            data: {
                name,
                marketingEmails,
                securityAlerts
            }
        });
        res.json({ message: 'Profile updated', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.updateProfile = updateProfile;
const getApiKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId;
        const keys = yield prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(keys);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch API keys' });
    }
});
exports.getApiKeys = getApiKeys;
const createApiKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ error: 'Key name required' });
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const key = `dx_${(0, uuid_1.v4)().replace(/-/g, '')}`; // Mock key generation
        const apiKey = yield prisma.apiKey.create({
            data: {
                userId: userId,
                name,
                key
            }
        });
        res.json(apiKey);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create API key' });
    }
});
exports.createApiKey = createApiKey;
const deleteApiKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        // Verify ownership
        const key = yield prisma.apiKey.findUnique({ where: { id } });
        if (!key || key.userId !== userId) {
            return res.status(404).json({ error: 'Key not found' });
        }
        yield prisma.apiKey.delete({ where: { id } });
        res.json({ message: 'Key deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete API key' });
    }
});
exports.deleteApiKey = deleteApiKey;
