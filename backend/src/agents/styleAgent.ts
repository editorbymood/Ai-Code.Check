import { BaseAgent, AgentResult } from './baseAgent';

export class StyleAgent extends BaseAgent {
    name = 'STYLE';
    systemPrompt = "You are a Code Style Expert. Check for naming conventions, formatting, and linting rules...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        const issues = [];
        if (code.includes('var ')) {
            issues.push({ severity: 'minor', type: 'style', description: 'Usage of "var" detected', suggestion: 'Use "let" or "const"' });
        }

        return {
            type: 'STYLE',
            issues,
            score: 90,
            summary: 'Style checks complete.'
        };
    }
}
