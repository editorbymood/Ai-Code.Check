import { BaseAgent, AgentResult } from './baseAgent';
import vm from 'vm';

export class SandboxAgent extends BaseAgent {
    name = 'RUNTIME_PERFORMANCE';
    systemPrompt = "You are a Runtime Performance Profiler...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        const issues: any[] = [];
        let score = 100;
        let executionTime = 0;

        try {
            const start = process.hrtime();

            const sandbox = { console: { log: () => { } } };
            vm.createContext(sandbox);

            vm.runInContext(code, sandbox, { timeout: 500 });

            const end = process.hrtime(start);
            executionTime = (end[0] * 1000 + end[1] / 1e6); // ms

            if (executionTime > 200) {
                issues.push({
                    severity: 'medium',
                    type: 'performance',
                    description: `Slow execution detected (${executionTime.toFixed(2)}ms).`,
                    suggestion: 'Optimize algorithm complexity.'
                });
                score -= 20;
            }

        } catch (e: any) {
            if (e.message.includes('Script execution timed out')) {
                issues.push({
                    severity: 'critical',
                    type: 'performance',
                    description: 'Execution timed out (>500ms). Possible infinite loop.',
                    suggestion: 'Check loop termination conditions.'
                });
                score -= 50;
            }
        }

        return {
            type: 'RUNTIME_PERFORMANCE',
            issues,
            score: Math.max(0, score),
            summary: issues.length > 0
                ? `Runtime Analysis found issues (Time: ${executionTime.toFixed(2)}ms).`
                : `Runtime verification passed (${executionTime.toFixed(2)}ms).`
        };
    }
}
