import { aiService } from '../services/aiService';

export interface AgentResult {
    type: string;
    issues: any[];
    score: number;
    summary: string;
}

export interface Agent {
    name: string;
    analyze(code: string, fileName?: string): Promise<AgentResult>;
}

export abstract class BaseAgent implements Agent {
    abstract name: string;
    abstract systemPrompt: string;

    async analyze(code: string, fileName: string = 'unknown.ts'): Promise<AgentResult> {
        try {
            // Call real AI service
            const response = await aiService.generateReview(code, this.systemPrompt);

            // Transform response to AgentResult
            return {
                type: this.name.toUpperCase(),
                issues: response.issues.map(issue => ({
                    ...issue,
                    type: issue.type // ensure type is preserved
                })),
                score: response.qualityScore,
                summary: response.summary
            };
        } catch (error) {
            console.error(`Agent ${this.name} failed to use AI Service, falling back to mock.`, error);
            // Fallback to mock behavior if AI service fails (network/quota)
            return this.mockAnalyze(code);
        }
    }

    abstract mockAnalyze(code: string): Promise<AgentResult>;
}
