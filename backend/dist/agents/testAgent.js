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
exports.TestGeneratorAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class TestGeneratorAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'TEST_GENERATOR';
        this.systemPrompt = "You are a QA Engineer...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Detect functions to test
            const functionRegex = /function\s+([a-zA-Z0-9_]+)/g;
            const matches = [...code.matchAll(functionRegex)];
            const issues = [];
            if (matches.length > 0) {
                // Suggest tests
                issues.push({
                    severity: 'info',
                    type: 'testing',
                    description: `Found ${matches.length} testable functions.`,
                    suggestion: `Consider adding: describe('${matches[0][1]}', () => { ... })`
                });
            }
            return {
                type: 'TEST_GENERATOR',
                issues,
                score: 100,
                summary: matches.length > 0 ? `Proposed tests for ${matches.length} functions.` : 'No obvious functions to test.'
            };
        });
    }
}
exports.TestGeneratorAgent = TestGeneratorAgent;
