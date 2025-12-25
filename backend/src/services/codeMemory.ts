import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface FileHistory {
    path: string;
    lastScore: number;
    lastIssuesCount: number;
    hash: string;
    timestamp: string;
    trend: 'improved' | 'regression' | 'stable';
}

export class CodeMemory {
    private dbPath: string;
    private memory: Record<string, FileHistory> = {};

    constructor() {
        // Simple JSON store. In production, use Redis or Postgres.
        this.dbPath = path.join(process.cwd(), 'code_memory.json');
        this.load();
    }

    private load() {
        if (fs.existsSync(this.dbPath)) {
            try {
                this.memory = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
            } catch (e) {
                console.error("Failed to load CodeMemory:", e);
                this.memory = {};
            }
        }
    }

    private save() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.memory, null, 2));
    }

    private calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    public getHistory(filePath: string): FileHistory | undefined {
        return this.memory[filePath];
    }

    public update(filePath: string, content: string, score: number, issuesCount: number): FileHistory {
        const currentHash = this.calculateHash(content);
        const prev = this.memory[filePath];

        let trend: 'improved' | 'regression' | 'stable' = 'stable';

        if (prev) {
            if (prev.hash === currentHash) {
                // No content change, likely same result
                return prev;
            }
            if (score > prev.lastScore) trend = 'improved';
            if (score < prev.lastScore) trend = 'regression';
        }

        const history: FileHistory = {
            path: filePath,
            lastScore: score,
            lastIssuesCount: issuesCount,
            hash: currentHash,
            timestamp: new Date().toISOString(),
            trend
        };

        this.memory[filePath] = history;
        this.save();
        return history;
    }
}

export const codeMemory = new CodeMemory();
