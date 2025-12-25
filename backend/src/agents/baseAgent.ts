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
        // In real implementation, this calls LLM with systemPrompt + code
        // For now, returning mock data based on simple heuristics or simulated delay
        return this.mockAnalyze(code);
    }

    abstract mockAnalyze(code: string): Promise<AgentResult>;
}
