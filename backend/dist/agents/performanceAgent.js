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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class PerformanceAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'PERFORMANCE';
        this.systemPrompt = "You are a Performance Engineer. Analyze Big-O time complexity...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = [];
            if (code.includes('for (') && code.includes('for (', code.indexOf('for (') + 1)) {
                // Very naive nested loop check
                issues.push({ severity: 'medium', type: 'complexity', description: 'Nested loops detected (Possible O(n^2))', suggestion: 'Optimize to O(n) using a map' });
            }
            return {
                type: 'PERFORMANCE',
                issues,
                score: 85,
                summary: 'Performance analysis complete.'
            };
        });
    }
}
exports.PerformanceAgent = PerformanceAgent;
