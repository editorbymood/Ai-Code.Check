import { BaseAgent, AgentResult } from './baseAgent';

export class PerformanceAgent extends BaseAgent {
    name = 'PERFORMANCE';
    systemPrompt = "You are a Performance Engineer. Analyze Big-O time complexity...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        const issues = [];
        if (code.includes('for (') && code.includes('for (', code.indexOf('for (') + 1)) {
            // Very naive nested loop check
            issues.push({ severity: 'medium', type: 'complexity', description: 'Nested loops detected (Possible O(n^2))', suggestion: 'Optimize to O(n) using a map' });
        }

        return {
            type: 'PERFORMANCE',
            issues,
            score: 85,
            summary: 'Performance analysis complete.'
        };
    }
}
