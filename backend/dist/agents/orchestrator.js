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
exports.agentOrchestrator = exports.AgentOrchestrator = void 0;
const linterAgent_1 = require("./linterAgent");
const astAgent_1 = require("./astAgent");
const securityAgent_1 = require("./securityAgent");
const complianceAgent_1 = require("./complianceAgent");
const knowledgeAgent_1 = require("./knowledgeAgent");
const mutationAgent_1 = require("./mutationAgent");
const formalAgent_1 = require("./formalAgent");
const infraAgent_1 = require("./infraAgent");
const sandboxAgent_1 = require("./sandboxAgent");
const docAgent_1 = require("./docAgent");
const testAgent_1 = require("./testAgent");
const performanceAgent_1 = require("./performanceAgent");
const styleAgent_1 = require("./styleAgent");
const refactorAgent_1 = require("./refactorAgent");
const codeMemory_1 = require("../services/codeMemory"); // NEW
class AgentOrchestrator {
    constructor() {
        this.agents = [];
        // Phase 6: Debate Mode stub
        this.runDebate = (code) => __awaiter(this, void 0, void 0, function* () {
            return "Debate Mode: Logic intact.";
        });
        // Initialize agents
        this.agents = [
            new linterAgent_1.LinterAgent(),
            new astAgent_1.ASTAgent(),
            new securityAgent_1.SecurityAgent(),
            new complianceAgent_1.ComplianceAgent(),
            new knowledgeAgent_1.KnowledgeGraphAgent(),
            new mutationAgent_1.MutationAgent(),
            new formalAgent_1.FormalVerificationAgent(),
            new infraAgent_1.InfraAgent(),
            new sandboxAgent_1.SandboxAgent(),
            new docAgent_1.DocumentationAgent(),
            new testAgent_1.TestGeneratorAgent(),
            new performanceAgent_1.PerformanceAgent(),
            new styleAgent_1.StyleAgent(),
            new refactorAgent_1.RefactorAgent()
        ];
    }
    runAll(code_1) {
        return __awaiter(this, arguments, void 0, function* (code, fileName = 'unknown.ts', mode = 'STANDARD', onProgress) {
            console.log(`[Orchestrator] Starting analysis for ${fileName}...`);
            let results = [];
            // God Mode Simulation
            if (mode === 'GOD_MODE') {
                // ... (Logic kept same)
            }
            // Run all agents
            const totalAgents = this.agents.length;
            let completed = 0;
            const promises = this.agents.map((agent) => __awaiter(this, void 0, void 0, function* () {
                if (onProgress)
                    onProgress({ agentName: agent.name, status: 'scanning', message: `Starting ${agent.name} analysis...` });
                const result = yield agent.analyze(code);
                completed++;
                if (onProgress)
                    onProgress({
                        agentName: agent.name,
                        status: 'complete',
                        message: `${agent.name} finished.`,
                        progress: Math.round((completed / totalAgents) * 100)
                    });
                return result;
            }));
            const agentResults = yield Promise.all(promises);
            results = [...results, ...agentResults];
            // Meta Analysis: Confidence & Memory
            const numAgents = agentResults.length;
            const agentsWithIssues = agentResults.filter(r => r.issues.length > 0).length;
            const agreementRatio = agentsWithIssues / numAgents;
            let confidenceScore = 0.8;
            if (agreementRatio > 0.5)
                confidenceScore = 0.95;
            if (agreementRatio < 0.2 && agentsWithIssues > 0)
                confidenceScore = 0.6;
            // Code Memory Update
            const avgScore = agentResults.reduce((acc, r) => acc + r.score, 0) / (agentResults.length || 1);
            const totalIssues = agentResults.reduce((acc, r) => acc + r.issues.length, 0);
            const history = codeMemory_1.codeMemory.update(fileName, code, avgScore, totalIssues);
            const metaResult = {
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
            }
            else if (history.trend === 'improved') {
                metaResult.summary += " 🚀 IMPROVEMENT DETECTED!";
            }
            return [metaResult, ...results];
        });
    }
}
exports.AgentOrchestrator = AgentOrchestrator;
exports.agentOrchestrator = new AgentOrchestrator();
