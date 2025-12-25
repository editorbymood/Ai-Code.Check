import { BaseAgent, AgentResult } from './baseAgent';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export class LinterAgent extends BaseAgent {
    name = 'LINTER_STATIC';
    systemPrompt = "You are a Static Code Analyzer (ESLint/Pylint)...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        // Step 0: Determine language (very basic for now, handled by orchestrator usually)
        // Check signature heuristic
        if (code.includes('import ') || code.includes('console.log') || code.includes('function ')) {
            return this.analyzeReal(code, 'javascript');
        }
        return { type: 'LINTER_STATIC', issues: [], score: 100, summary: 'Skipped Linter (Unknown Lang)' };
    }

    async analyze(code: string, language: string): Promise<AgentResult> {
        return this.analyzeReal(code, language);
    }

    private async analyzeReal(code: string, language: string): Promise<AgentResult> {
        const issues: any[] = [];
        let score = 100;

        // Create temp file
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const ext = language === 'python' ? 'py' : 'ts';
        const filePath = path.join(tempDir, `lint_${uuidv4()}.${ext}`);

        try {
            fs.writeFileSync(filePath, code);

            let cmd = '';
            if (language === 'python') {
                // Assume pylint is installed in environment
                // cmd = `pylint ${filePath} --output-format=json`; // Enable if python env exists
            } else if (['javascript', 'typescript', 'ts', 'js'].includes(language)) {
                // Use local eslint
                const eslintPath = path.join(__dirname, '../../node_modules/.bin/eslint');
                // We need a basic config or use --no-eslintrc with flags
                // For MVP, simplistic check:
                cmd = `${eslintPath} --no-eslintrc --parser @typescript-eslint/parser --plugin @typescript-eslint ${filePath} --format json`;
            }

            if (cmd) {
                try {
                    const { stdout } = await execAsync(cmd);
                    // Parsing logic would go here
                } catch (error: any) {
                    // ESLint returns exit 1 on errors, so we parse stdout from error
                    if (error.stdout) {
                        try {
                            const lintResults = JSON.parse(error.stdout);
                            // eslint returns array of results
                            lintResults.forEach((res: any) => {
                                res.messages.forEach((msg: any) => {
                                    issues.push({
                                        severity: msg.severity === 2 ? 'high' : 'medium',
                                        type: 'linter',
                                        description: msg.message,
                                        line: msg.line,
                                        suggestion: `Fix ESLint rule: ${msg.ruleId}`
                                    });
                                    score -= (msg.severity === 2 ? 10 : 5);
                                });
                            });
                        } catch (e) {
                            console.warn("Failed to parse linter output", e);
                        }
                    }
                }
            }

        } catch (e) {
            console.error("Linter failed", e);
        } finally {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        return {
            type: 'LINTER_STATIC',
            issues,
            score: Math.max(0, score),
            summary: issues.length > 0 ? `Linter found ${issues.length} violation(s).` : 'Linter passed clean.'
        };
    }
}
