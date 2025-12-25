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
exports.KnowledgeGraphAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class KnowledgeGraphAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'KNOWLEDGE_GRAPH';
        this.systemPrompt = "You are a Repository Architect analyzing the dependency graph...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Single file analysis is limited, this agent usually runs on the whole repo.
            // But we can approximate by analyzing imports in this single file.
            const imports = this.extractImports(code);
            return {
                type: 'KNOWLEDGE_GRAPH',
                issues: [],
                score: 100,
                summary: `Analyzed dependencies: Found ${imports.length} imports.`
            };
        });
    }
    // This method is called by the orchestrator when processing a ZIP/Repo
    analyzeRepo(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = new Map();
            const issues = [];
            let score = 100;
            // 1. Build Graph
            files.forEach(file => {
                nodes.set(file.path, {
                    id: file.path,
                    imports: this.extractImports(file.content),
                    exports: [], // Todo: parse exports
                    hash: this.simpleHash(file.content)
                });
            });
            // 2. Detect Circular Dependencies (DFS)
            // ... (Simplified check)
            // 3. Detect Duplicate Logic (Copy-Paste)
            const hashes = new Map();
            nodes.forEach(node => {
                var _a;
                if (!hashes.has(node.hash))
                    hashes.set(node.hash, []);
                (_a = hashes.get(node.hash)) === null || _a === void 0 ? void 0 : _a.push(node.id);
            });
            hashes.forEach((paths, hash) => {
                if (paths.length > 1) {
                    issues.push({
                        severity: 'medium',
                        type: 'duplication',
                        description: `Duplicate file content detected in: ${paths.join(', ')}`,
                        suggestion: 'Extract common logic to a shared utility.'
                    });
                    score -= 5 * paths.length;
                }
            });
            // 4. God Object Detection (Connections)
            nodes.forEach(node => {
                if (node.imports.length > 20) {
                    issues.push({
                        severity: 'medium',
                        type: 'coupling',
                        description: `File ${node.id} has high coupling (${node.imports.length} imports).`,
                        suggestion: 'Break down into smaller modules.'
                    });
                    score -= 10;
                }
            });
            return {
                type: 'KNOWLEDGE_GRAPH',
                issues,
                score: Math.max(0, score),
                summary: `Repository Graph: ${nodes.size} nodes. Found ${issues.length} architectural issues.`
            };
        });
    }
    extractImports(code) {
        const imports = [];
        const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
        let match;
        while ((match = regex.exec(code)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}
exports.KnowledgeGraphAgent = KnowledgeGraphAgent;
