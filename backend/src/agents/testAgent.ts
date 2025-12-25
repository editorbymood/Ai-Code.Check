import { BaseAgent, AgentResult } from './baseAgent';

export class TestGeneratorAgent extends BaseAgent {
    name = 'TEST_GENERATOR';
    systemPrompt = "You are a QA Engineer...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        // Detect functions to test
        const functionRegex = /function\s+([a-zA-Z0-9_]+)/g;
        const matches = [...code.matchAll(functionRegex)];

        const issues = [];

        if (matches.length > 0) {
            // Suggest tests
            issues.push({
                severity: 'info',
                type: 'testing',
                description: `Found ${matches.length} testable functions.`,
                suggestion: `Consider adding: describe('${matches[0][1]}', () => { ... })`
            });
        }

        return {
            type: 'TEST_GENERATOR',
            issues,
            score: 100,
            summary: matches.length > 0 ? `Proposed tests for ${matches.length} functions.` : 'No obvious functions to test.'
        };
    }
}
