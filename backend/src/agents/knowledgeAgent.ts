import { BaseAgent, AgentResult } from './baseAgent';

// Simple in-memory graph structure for MVP
// In production, this would use Neo4j or a vector DB
interface GraphNode {
    id: string; // filename
    imports: string[];
    exports: string[];
    hash: string; // for duplicate detection
}

export class KnowledgeGraphAgent extends BaseAgent {
    name = 'KNOWLEDGE_GRAPH';
    systemPrompt = "You are a Repository Architect analyzing the dependency graph...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        // Single file analysis is limited, this agent usually runs on the whole repo.
        // But we can approximate by analyzing imports in this single file.
        const imports = this.extractImports(code);
        return {
            type: 'KNOWLEDGE_GRAPH',
            issues: [],
            score: 100,
            summary: `Analyzed dependencies: Found ${imports.length} imports.`
        };
    }

    // This method is called by the orchestrator when processing a ZIP/Repo
    async analyzeRepo(files: { path: string, content: string }[]): Promise<AgentResult> {
        const nodes: Map<string, GraphNode> = new Map();
        const issues: any[] = [];
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
        const hashes = new Map<string, string[]>();
        nodes.forEach(node => {
            if (!hashes.has(node.hash)) hashes.set(node.hash, []);
            hashes.get(node.hash)?.push(node.id);
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
    }

    private extractImports(code: string): string[] {
        const imports: string[] = [];
        const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
        let match;
        while ((match = regex.exec(code)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    }

    private simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}
