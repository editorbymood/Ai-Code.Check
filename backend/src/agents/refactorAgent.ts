import { BaseAgent, AgentResult } from './baseAgent';

export class RefactorAgent extends BaseAgent {
    name = 'REFACTOR';
    systemPrompt = "You are a Senior Architect. Provide a cleaner, refactored version of the code...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        // Determine refactored code (mock)
        const refactored = code.replace(/var /g, 'const ').replace(/eval\(.*\)/g, '// eval removed');

        return {
            type: 'REFACTOR',
            issues: [],
            score: 100,
            summary: 'Refactoring suggestions generated.',
            // @ts-ignore - specialized field for runtime usage
            refactoredCode: refactored
        };
    }
}
