import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getAnalytics = (req: Request, res: Response) => {
    try {
        const dbPath = path.join(process.cwd(), 'code_memory.json');
        if (!fs.existsSync(dbPath)) {
            return res.json({ history: [], summary: { averageScore: 0, totalFiles: 0 } });
        }

        const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const history = Object.values(data);

        // Calculate simple metrics
        const totalFiles = history.length;
        const averageScore = history.reduce((acc: number, h: any) => acc + h.lastScore, 0) / (totalFiles || 1);
        const regressionCount = history.filter((h: any) => h.trend === 'regression').length;

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

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};
