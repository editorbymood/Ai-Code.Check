import { BaseAgent, AgentResult } from './baseAgent';

export class SecurityAgent extends BaseAgent {
    name = 'SECURITY';
    systemPrompt = "You are a Security Expert Authentication & authorization specialist... Analyze for OWASP Top 10...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        const issues = [];
        let score = 100;

        // 1. Literal Checks
        if (code.includes('eval(')) {
            issues.push({ severity: 'critical', type: 'injection', description: 'Usage of eval() detected', suggestion: 'Remove eval()' });
            score -= 20;
        }

        // 2. Simple Heuristic for Keys
        if ((code.includes('password = "') || code.includes("password = '")) && !code.includes('process.env')) {
            issues.push({ severity: 'high', type: 'credential', description: 'Hardcoded password detected', suggestion: 'Use environment variables' });
            score -= 20;
        }

        // 3. Advanced Pattern Matching (AWS, Generic Tokens)
        const awsRegex = /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/;
        if (awsRegex.test(code)) {
            issues.push({ severity: 'critical', type: 'secret', description: 'Possible AWS Access Key detected', suggestion: 'Revoke key and use IAM Roles.' });
            score -= 50;
        }

        // 4. Entropy Check (Detect random strings like API keys)
        const words = code.split(/[\s"',;=(){}\[\]]+/);
        for (const word of words) {
            if (word.length > 20 && this.calculateEntropy(word) > 4.5) {
                // Exclude common long strings like URLs or imports if possible (naive check)
                if (!word.startsWith('http') && !word.includes('/')) {
                    issues.push({
                        severity: 'high',
                        type: 'secret',
                        description: `High entropy string detected: ${word.substring(0, 5)}...`,
                        suggestion: 'Check if this is a hardcoded secret/token.'
                    });
                    score -= 10;
                }
            }
        }

        // 2. Entropy Check (Secrets)
        // ... (Existing)

        // 3. Prompt Injection Scanner (Phase 15)
        const injectionKeywords = ['ignore previous instructions', 'system prompt', 'you are a chat bot', 'DAN mode'];
        if (injectionKeywords.some(kw => code.toLowerCase().includes(kw))) {
            issues.push({
                severity: 'critical',
                type: 'security',
                description: 'Potential Prompt Injection Vector detected in code strings.',
                suggestion: 'Ensure user input is never directly concatenated into LLM prompts.'
            });
            score -= 25;
        }

        return {
            type: 'SECURITY',
            issues,
            score: Math.max(0, score),
            summary: issues.length > 0 ? `Security Agent found ${issues.length} potential vulnerabilities.` : 'No obvious security issues.'
        };
    }

    private calculateEntropy(str: string): number {
        const len = str.length;
        const frequencies: Record<string, number> = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;

        return Object.values(frequencies)
            .reduce((sum, f) => {
                const p = f / len;
                return sum - p * Math.log2(p);
            }, 0);
    };
}
