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
exports.DocumentationAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class DocumentationAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'DOCUMENTATION';
        this.systemPrompt = "You are a Technical Writer...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real app, this would generate a full Markdown file.
            // For this mock, we analyze IF the code is documented.
            const issues = [];
            let score = 100;
            // naive check for JSDoc or comments
            const commentCount = (code.match(/\/\//g) || []).length + (code.match(/\/\*/g) || []).length;
            const loc = code.split('\n').length;
            if (loc > 10 && commentCount === 0) {
                issues.push({ severity: 'low', type: 'docs', description: 'No comments found in >10 LOC.', suggestion: 'Add JSDoc for functions.' });
                score -= 10;
            }
            return {
                type: 'DOCUMENTATION',
                issues,
                score,
                summary: `Documentation Check: Found ${commentCount} comments.`,
                // Return a generated mock doc as 'refactoredCode' or similar field if we had one?
                // We'll stick to issues for now.
            };
        });
    }
}
exports.DocumentationAgent = DocumentationAgent;
