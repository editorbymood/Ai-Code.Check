"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAnalytics = (req, res) => {
    try {
        const dbPath = path_1.default.join(process.cwd(), 'code_memory.json');
        if (!fs_1.default.existsSync(dbPath)) {
            return res.json({ history: [], summary: { averageScore: 0, totalFiles: 0 } });
        }
        const data = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
        const history = Object.values(data);
        // Calculate simple metrics
        const totalFiles = history.length;
        const averageScore = history.reduce((acc, h) => acc + h.lastScore, 0) / (totalFiles || 1);
        const regressionCount = history.filter((h) => h.trend === 'regression').length;
        // Mock daily activity for the chart (since we just started)
        const activity = [
            { date: '2023-10-01', score: 65 },
            { date: '2023-10-02', score: 70 },
            { date: '2023-10-03', score: 68 },
            { date: '2023-10-04', score: 75 },
            { date: '2023-10-05', score: 82 },
            { date: 'Today', score: Math.round(averageScore) }
        ];
        res.json({
            history,
            summary: {
                averageScore: Math.round(averageScore),
                totalFiles,
                regressionCount
            },
            activity
        });
    }
    catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};
exports.getAnalytics = getAnalytics;
