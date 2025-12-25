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
exports.SandboxAgent = void 0;
const baseAgent_1 = require("./baseAgent");
const vm_1 = __importDefault(require("vm"));
class SandboxAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'RUNTIME_PERFORMANCE';
        this.systemPrompt = "You are a Runtime Performance Profiler...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = [];
            let score = 100;
            let executionTime = 0;
            try {
                const start = process.hrtime();
                const sandbox = { console: { log: () => { } } };
                vm_1.default.createContext(sandbox);
                vm_1.default.runInContext(code, sandbox, { timeout: 500 });
                const end = process.hrtime(start);
                executionTime = (end[0] * 1000 + end[1] / 1e6); // ms
                if (executionTime > 200) {
                    issues.push({
                        severity: 'medium',
                        type: 'performance',
                        description: `Slow execution detected (${executionTime.toFixed(2)}ms).`,
                        suggestion: 'Optimize algorithm complexity.'
                    });
                    score -= 20;
                }
            }
            catch (e) {
                if (e.message.includes('Script execution timed out')) {
                    issues.push({
                        severity: 'critical',
                        type: 'performance',
                        description: 'Execution timed out (>500ms). Possible infinite loop.',
                        suggestion: 'Check loop termination conditions.'
                    });
                    score -= 50;
                }
            }
            return {
                type: 'RUNTIME_PERFORMANCE',
                issues,
                score: Math.max(0, score),
                summary: issues.length > 0
                    ? `Runtime Analysis found issues (Time: ${executionTime.toFixed(2)}ms).`
                    : `Runtime verification passed (${executionTime.toFixed(2)}ms).`
            };
        });
    }
}
exports.SandboxAgent = SandboxAgent;
