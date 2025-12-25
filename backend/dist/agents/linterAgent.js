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
exports.LinterAgent = void 0;
const baseAgent_1 = require("./baseAgent");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const uuid_1 = require("uuid");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class LinterAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'LINTER_STATIC';
        this.systemPrompt = "You are a Static Code Analyzer (ESLint/Pylint)...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 0: Determine language (very basic for now, handled by orchestrator usually)
            // Check signature heuristic
            if (code.includes('import ') || code.includes('console.log') || code.includes('function ')) {
                return this.analyzeReal(code, 'javascript');
            }
            return { type: 'LINTER_STATIC', issues: [], score: 100, summary: 'Skipped Linter (Unknown Lang)' };
        });
    }
    analyze(code, language) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.analyzeReal(code, language);
        });
    }
    analyzeReal(code, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = [];
            let score = 100;
            // Create temp file
            const tempDir = path_1.default.join(__dirname, '../../temp');
            if (!fs_1.default.existsSync(tempDir))
                fs_1.default.mkdirSync(tempDir, { recursive: true });
            const ext = language === 'python' ? 'py' : 'ts';
            const filePath = path_1.default.join(tempDir, `lint_${(0, uuid_1.v4)()}.${ext}`);
            try {
                fs_1.default.writeFileSync(filePath, code);
                let cmd = '';
                if (language === 'python') {
                    // Assume pylint is installed in environment
                    // cmd = `pylint ${filePath} --output-format=json`; // Enable if python env exists
                }
                else if (['javascript', 'typescript', 'ts', 'js'].includes(language)) {
                    // Use local eslint
                    const eslintPath = path_1.default.join(__dirname, '../../node_modules/.bin/eslint');
                    // We need a basic config or use --no-eslintrc with flags
                    // For MVP, simplistic check:
                    cmd = `${eslintPath} --no-eslintrc --parser @typescript-eslint/parser --plugin @typescript-eslint ${filePath} --format json`;
                }
                if (cmd) {
                    try {
                        const { stdout } = yield execAsync(cmd);
                        // Parsing logic would go here
                    }
                    catch (error) {
                        // ESLint returns exit 1 on errors, so we parse stdout from error
                        if (error.stdout) {
                            try {
                                const lintResults = JSON.parse(error.stdout);
                                // eslint returns array of results
                                lintResults.forEach((res) => {
                                    res.messages.forEach((msg) => {
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
                            }
                            catch (e) {
                                console.warn("Failed to parse linter output", e);
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.error("Linter failed", e);
            }
            finally {
                if (fs_1.default.existsSync(filePath))
                    fs_1.default.unlinkSync(filePath);
            }
            return {
                type: 'LINTER_STATIC',
                issues,
                score: Math.max(0, score),
                summary: issues.length > 0 ? `Linter found ${issues.length} violation(s).` : 'Linter passed clean.'
            };
        });
    }
}
exports.LinterAgent = LinterAgent;
