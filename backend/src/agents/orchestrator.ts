import { BaseAgent, AgentResult } from './baseAgent';
import { LinterAgent } from './linterAgent';
import { ASTAgent } from './astAgent';
import { SecurityAgent } from './securityAgent';
import { ComplianceAgent } from './complianceAgent';
import { KnowledgeGraphAgent } from './knowledgeAgent';
import { MutationAgent } from './mutationAgent';
import { FormalVerificationAgent } from './formalAgent';
import { InfraAgent } from './infraAgent';
import { SandboxAgent } from './sandboxAgent';
import { DocumentationAgent } from './docAgent';
import { TestGeneratorAgent } from './testAgent';
import { PerformanceAgent } from './performanceAgent';
import { StyleAgent } from './styleAgent';
import { RefactorAgent } from './refactorAgent';
import { codeMemory } from '../services/codeMemory'; // NEW

export class AgentOrchestrator {
    private agents: BaseAgent[] = [];

    constructor() {
        // Initialize agents
        this.agents = [
            new LinterAgent(),
            new ASTAgent(),
            new SecurityAgent(),
            new ComplianceAgent(),
            new KnowledgeGraphAgent(),
            new MutationAgent(),
            new FormalVerificationAgent(),
            new InfraAgent(),
            new SandboxAgent(),
            new DocumentationAgent(),
            new TestGeneratorAgent(),
            new PerformanceAgent(),
            new StyleAgent(),
            new RefactorAgent()
        ];
    }

    async runAll(code: string, fileName: string = 'unknown.ts', mode: string = 'STANDARD', onProgress?: (data: any) => void): Promise<AgentResult[]> {
        console.log(`[Orchestrator] Starting analysis for ${fileName}...`);

        let results: AgentResult[] = [];

        // God Mode Simulation
        if (mode === 'GOD_MODE') {
            // ... (Logic kept same)
        }

        // Run all agents
        const totalAgents = this.agents.length;
        let completed = 0;

        const promises = this.agents.map(async agent => {
            if (onProgress) onProgress({ agentName: agent.name, status: 'scanning', message: `Starting ${agent.name} analysis...` });

            const result = await agent.analyze(code);

            completed++;
            if (onProgress) onProgress({
                agentName: agent.name,
                status: 'complete',
                message: `${agent.name} finished.`,
                progress: Math.round((completed / totalAgents) * 100)
            });
            return result;
        });

        const agentResults = await Promise.all(promises);
        results = [...results, ...agentResults];

        // Meta Analysis: Confidence & Memory
        const numAgents = agentResults.length;
        const agentsWithIssues = agentResults.filter(r => r.issues.length > 0).length;
        const agreementRatio = agentsWithIssues / numAgents;

        let confidenceScore = 0.8;
        if (agreementRatio > 0.5) confidenceScore = 0.95;
        if (agreementRatio < 0.2 && agentsWithIssues > 0) confidenceScore = 0.6;

        // Code Memory Update
        const avgScore = agentResults.reduce((acc, r) => acc + r.score, 0) / (agentResults.length || 1);
        const totalIssues = agentResults.reduce((acc, r) => acc + r.issues.length, 0);

        const history = codeMemory.update(fileName, code, avgScore, totalIssues);

        const metaResult: AgentResult = {
            type: 'META_ANALYSIS',
            score: Math.round(avgScore),
            issues: [],
            summary: `Global Confidence: ${(confidenceScore * 100).toFixed(0)}%. Trend: ${history.trend.toUpperCase()} (Prev Score: ${history.lastScore ? Math.round(history.lastScore) : 'N/A'}).`
        };

        if (history.trend === 'regression') {
            metaResult.issues.push({
                severity: 'critical',
                type: 'regression',
                description: 'Code Quality Regression Detected.',
                suggestion: 'Review recent changes; score dropped significantly.'
            });
            metaResult.score -= 20; // Penalize regression
        } else if (history.trend === 'improved') {
            metaResult.summary += " 🚀 IMPROVEMENT DETECTED!";
        }

        return [metaResult, ...results];
    }

    // Phase 6: Debate Mode stub
    runDebate = async (code: string): Promise<string> => {
        return "Debate Mode: Logic intact.";
    }
}

export const agentOrchestrator = new AgentOrchestrator();
