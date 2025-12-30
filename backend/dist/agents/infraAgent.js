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
exports.InfraAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class InfraAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'INFRASTRUCTURE';
        this.systemPrompt = "You are a DevOps Engineer reviewing Dockerfiles and Kubernetes manifests...";
    }
    analyze(code_1) {
        const _super = Object.create(null, {
            analyze: { get: () => super.analyze }
        });
        return __awaiter(this, arguments, void 0, function* (code, language = '') {
            // Override analyze to handle non-js files if needed, but BaseAgent MockAnalyze logic assumes 'code' string
            // We will add specific heuristics for Dockerfile/YAML
            if (language.toLowerCase() !== 'dockerfile' && language.toLowerCase() !== 'yaml' && language.toLowerCase() !== 'yml') {
                // Skip if not infra file (or maybe return neutral result)
                return { type: 'INFRASTRUCTURE', issues: [], score: 100, summary: 'Skipped (Not an Infra file)' };
            }
            return _super.analyze.call(this, code, language);
        });
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = [];
            let score = 100;
            // Docker Checks
            if (code.includes('FROM node:latest') || code.includes('FROM ubuntu:latest')) {
                issues.push({ severity: 'medium', type: 'infra', description: 'Using :latest tag is not reproducible.', suggestion: 'Use specific version (e.g., node:18-alpine).' });
                score -= 20;
            }
            if (code.includes('USER root')) {
                issues.push({ severity: 'high', type: 'security', description: 'Running as root detected.', suggestion: 'Create a non-root user.' });
                score -= 30;
            }
            // K8s Checks
            if (code.includes('apiVersion:') && code.includes('kind: Deployment')) {
                if (!code.includes('resources:')) {
                    issues.push({
                        severity: 'medium',
                        type: 'infra',
                        description: 'Missing resource limits in Kubernetes manifest',
                        suggestion: 'Define requests and limits for CPU/Memory.'
                    });
                    score -= 10;
                }
                // Phase 14: Chaos Readiness
                if (!code.includes('livenessProbe') || !code.includes('readinessProbe')) {
                    issues.push({
                        severity: 'high',
                        type: 'resilience',
                        description: 'Missing liveness/readiness probes (Chaos Risk)',
                        suggestion: 'Add probes to ensure self-healing during failures.'
                    });
                    score -= 20;
                }
            }
            return {
                type: 'INFRASTRUCTURE',
                issues,
                score: Math.max(0, score),
                summary: issues.length > 0 ? `Infrastructure Check found ${issues.length} issues.` : 'Infrastructure config looks solid.'
            };
        });
    }
}
exports.InfraAgent = InfraAgent;
