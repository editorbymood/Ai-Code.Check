"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTAgent = void 0;
const baseAgent_1 = require("./baseAgent");
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
class ASTAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'AST_ANALYSIS';
        this.systemPrompt = "You are a Static Analysis Expert having access to the Abstract Syntax Tree...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = [];
            let score = 100;
            try {
                const ast = (0, parser_1.parse)(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'jsx']
                });
                // First Pass: General Issues
                (0, traverse_1.default)(ast, {
                    // 1. Dangerous Functions & Memory Leaks
                    CallExpression(path) {
                        var _a;
                        // @ts-ignore
                        const callee = path.node.callee;
                        // Eval
                        // @ts-ignore
                        if (callee.name === 'eval') {
                            issues.push({ severity: 'critical', type: 'security', description: 'Usage of eval() detected.', suggestion: 'Remove eval().' });
                            score -= 30;
                        }
                        // innerHTML
                        // @ts-ignore
                        if (callee.type === 'MemberExpression' && callee.property.name === 'innerHTML') {
                            issues.push({ severity: 'high', type: 'security', description: 'Direct assignment to innerHTML.', suggestion: 'Use textContent.' });
                            score -= 15;
                        }
                        // Memory Leak: addEventListener
                        // @ts-ignore
                        if (((_a = callee.property) === null || _a === void 0 ? void 0 : _a.name) === 'addEventListener') {
                            issues.push({ severity: 'minor', type: 'memory_leak', description: 'Event listener added.', suggestion: 'Verify cleanup.' });
                        }
                        // Memory Leak: setInterval
                        // @ts-ignore
                        if (callee.name === 'setInterval') {
                            issues.push({ severity: 'medium', type: 'memory_leak', description: 'setInterval detected.', suggestion: 'Ensure clearInterval.' });
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
                        // @ts-ignore
                        const container = path.container;
                        // @ts-ignore
                        if (Array.isArray(container)) {
                            // @ts-ignore
                            const index = path.key;
                            if (typeof index === 'number' && index < container.length - 1) {
                                issues.push({ severity: 'minor', type: 'dead_code', description: 'Unreachable code after return.', suggestion: 'Remove.' });
                            }
                        }
                    }
                });
                // Second Pass: Complexity & Big-O (Per Function)
                (0, traverse_1.default)(ast, {
                    Function(path) {
                        let complexity = 1;
                        let maxNesting = 0;
                        path.traverse({
                            "IfStatement|ForStatement|WhileStatement|DoWhileStatement|SwitchCase|CatchClause|ConditionalExpression"(innerPath) {
                                complexity++;
                                // Calculate Nesting Depth
                                let depth = 0;
                                let current = innerPath;
                                // @ts-ignore
                                while (current.parentPath && (current.parentPath.isForStatement || current.parentPath.isWhileStatement || current.parentPath.isIfStatement)) {
                                    depth++;
                                    // @ts-ignore
                                    current = current.parentPath;
                                }
                                if (depth > maxNesting)
                                    maxNesting = depth;
                            }
                        });
                        // Big-O Estimation
                        let bigO = 'O(1)';
                        if (maxNesting === 1)
                            bigO = 'O(n)';
                        if (maxNesting === 2)
                            bigO = 'O(n^2)';
                        if (maxNesting >= 3)
                            bigO = 'O(n^!)';
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
            }
            catch (e) {
                console.warn("AST Error:", e.message);
            }
            return {
                type: 'AST_ANALYSIS',
                issues: issues.filter(issue => !code.includes(`// ignore-ai: ${issue.type}`)),
                score: Math.max(0, score),
                summary: issues.length > 0 ? `AST found ${issues.length} issues.` : 'AST Passed.'
            };
        });
    }
}
exports.ASTAgent = ASTAgent;
