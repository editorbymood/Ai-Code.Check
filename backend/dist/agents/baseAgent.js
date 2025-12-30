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
exports.BaseAgent = void 0;
const aiService_1 = require("../services/aiService");
class BaseAgent {
    analyze(code_1) {
        return __awaiter(this, arguments, void 0, function* (code, fileName = 'unknown.ts') {
            try {
                // Call real AI service
                const response = yield aiService_1.aiService.generateReview(code, this.systemPrompt);
                // Transform response to AgentResult
                return {
                    type: this.name.toUpperCase(),
                    issues: response.issues.map(issue => (Object.assign(Object.assign({}, issue), { type: issue.type // ensure type is preserved
                     }))),
                    score: response.qualityScore,
                    summary: response.summary
                };
            }
            catch (error) {
                console.error(`Agent ${this.name} failed to use AI Service, falling back to mock.`, error);
                // Fallback to mock behavior if AI service fails (network/quota)
                return this.mockAnalyze(code);
            }
        });
    }
}
exports.BaseAgent = BaseAgent;
