import { BaseAgent, AgentResult } from './baseAgent';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { CallExpression, MemberExpression, Identifier, ReturnStatement, BlockStatement, IfStatement, ForStatement, WhileStatement, DoWhileStatement, SwitchCase, CatchClause, ConditionalExpression } from '@babel/types';

export class ASTAgent extends BaseAgent {
    name = 'AST_ANALYSIS';
    systemPrompt = "You are a Static Analysis Expert having access to the Abstract Syntax Tree...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        return this.analyze(code);
    }

    async analyze(code: string): Promise<AgentResult> {
        const issues: any[] = [];
        let score = 100;

        try {
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx']
            });

            // First Pass: General Issues
            traverse(ast, {
                // 1. Dangerous Functions & Memory Leaks
                CallExpression(path) {
                    const node = path.node;
                    const callee = node.callee;

                    // Eval
                    if (callee.type === 'Identifier' && callee.name === 'eval') {
                        issues.push({ severity: 'critical', type: 'security', description: 'Usage of eval() detected.', suggestion: 'Remove eval().' });
                        score -= 30;
                    }

                    // Memory Leak: addEventListener
                    if (callee.type === 'MemberExpression' &&
                        callee.property.type === 'Identifier' &&
                        callee.property.name === 'addEventListener') {
                        issues.push({ severity: 'minor', type: 'memory_leak', description: 'Event listener added.', suggestion: 'Verify cleanup.' });
                    }

                    // Memory Leak: setInterval
                    if (callee.type === 'Identifier' && callee.name === 'setInterval') {
                        issues.push({ severity: 'medium', type: 'memory_leak', description: 'setInterval detected.', suggestion: 'Ensure clearInterval.' });
                    }
                },

                // innerHTML should be checked in AssignmentExpression
                AssignmentExpression(path) {
                    const left = path.node.left;
                    if (left.type === 'MemberExpression' &&
                        left.property.type === 'Identifier' &&
                        left.property.name === 'innerHTML') {
                        issues.push({ severity: 'high', type: 'security', description: 'Direct assignment to innerHTML.', suggestion: 'Use textContent.' });
                        score -= 15;
                    }
                },

                // 2. Empty Blocks
                BlockStatement(path) {
                    if (path.node.body.length === 0) {
                        issues.push({ severity: 'minor', type: 'style', description: 'Empty block statement.', suggestion: 'Remove or comment.' });
                    }
                },

                // 3. Unreachable Code
                ReturnStatement(path) {
                    const container = path.container;
                    if (Array.isArray(container)) {
                        // key is usually number for arrays, but can be string for objects. In BlockStatement body it is array.
                        const index = path.key;
                        if (typeof index === 'number' && index < container.length - 1) {
                            issues.push({ severity: 'minor', type: 'dead_code', description: 'Unreachable code after return.', suggestion: 'Remove.' });
                        }
                    }
                }
            });

            // Second Pass: Complexity & Big-O (Per Function)
            traverse(ast, {
                Function(path) {
                    let complexity = 1;
                    let maxNesting = 0;

                    path.traverse({
                        "IfStatement|ForStatement|WhileStatement|DoWhileStatement|SwitchCase|CatchClause|ConditionalExpression"(innerPath) {
                            complexity++;
                            // Calculate Nesting Depth
                            let depth = 0;
                            // @ts-ignore
                            let current = innerPath.parentPath;

                            while (current) {
                                if (current.isForStatement() ||
                                    current.isWhileStatement() ||
                                    current.isDoWhileStatement() ||
                                    current.isIfStatement()) {
                                    depth++;
                                }
                                // Stop if we hit the function implementation itself
                                if (current.isFunction()) break;

                                current = current.parentPath;
                            }
                            if (depth > maxNesting) maxNesting = depth;
                        }
                    });

                    // Big-O Estimation
                    let bigO = 'O(1)';
                    if (maxNesting === 1) bigO = 'O(n)';
                    if (maxNesting === 2) bigO = 'O(n^2)';
                    if (maxNesting >= 3) bigO = 'O(n^!)';

                    if (maxNesting >= 2) {
                        issues.push({
                            severity: 'medium',
                            type: 'complexity',
                            description: `High Time Complexity detected: ~${bigO}`,
                            suggestion: 'Optimize nested loops.'
                        });
                        score -= 10;
                    }

                    if (complexity > 10) {
                        issues.push({
                            severity: complexity > 20 ? 'critical' : 'medium',
                            type: 'complexity',
                            description: `High Cyclomatic Complexity (${complexity})`,
                            suggestion: 'Split function.'
                        });
                        score -= 10;
                    }
                }
            });

        } catch (e: any) {
            console.warn("AST Error:", e.message);
        }

        return {
            type: 'AST_ANALYSIS',
            issues: issues.filter(issue => !code.includes(`// ignore-ai: ${issue.type}`)),
            score: Math.max(0, score),
            summary: issues.length > 0 ? `AST found ${issues.length} issues.` : 'AST Passed.'
        };
    }
}
