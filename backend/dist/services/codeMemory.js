"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeMemory = exports.CodeMemory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class CodeMemory {
    constructor() {
        this.memory = {};
        // Simple JSON store. In production, use Redis or Postgres.
        this.dbPath = path_1.default.join(process.cwd(), 'code_memory.json');
        this.load();
    }
    load() {
        if (fs_1.default.existsSync(this.dbPath)) {
            try {
                this.memory = JSON.parse(fs_1.default.readFileSync(this.dbPath, 'utf-8'));
            }
            catch (e) {
                console.error("Failed to load CodeMemory:", e);
                this.memory = {};
            }
        }
    }
    save() {
        fs_1.default.writeFileSync(this.dbPath, JSON.stringify(this.memory, null, 2));
    }
    calculateHash(content) {
        return crypto_1.default.createHash('sha256').update(content).digest('hex');
    }
    getHistory(filePath) {
        return this.memory[filePath];
    }
    update(filePath, content, score, issuesCount) {
        const currentHash = this.calculateHash(content);
        const prev = this.memory[filePath];
        let trend = 'stable';
        if (prev) {
            if (prev.hash === currentHash) {
                // No content change, likely same result
                return prev;
            }
            if (score > prev.lastScore)
                trend = 'improved';
            if (score < prev.lastScore)
                trend = 'regression';
        }
        const history = {
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
exports.CodeMemory = CodeMemory;
exports.codeMemory = new CodeMemory();
