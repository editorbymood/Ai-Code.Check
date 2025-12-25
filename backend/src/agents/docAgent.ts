import { BaseAgent, AgentResult } from './baseAgent';

export class DocumentationAgent extends BaseAgent {
    name = 'DOCUMENTATION';
    systemPrompt = "You are a Technical Writer...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        // In a real app, this would generate a full Markdown file.
        // For this mock, we analyze IF the code is documented.

        const issues = [];
        let score = 100;

        // naive check for JSDoc or comments
        const commentCount = (code.match(/\/\//g) || []).length + (code.match(/\/\*/g) || []).length;
        const loc = code.split('\n').length;

        if (loc > 10 && commentCount === 0) {
            issues.push({ severity: 'low', type: 'docs', description: 'No comments found in >10 LOC.', suggestion: 'Add JSDoc for functions.' });
            score -= 10;
        }

        return {
            type: 'DOCUMENTATION',
            issues,
            score,
            summary: `Documentation Check: Found ${commentCount} comments.`,
            // Return a generated mock doc as 'refactoredCode' or similar field if we had one?
            // We'll stick to issues for now.
        };
    }
}
