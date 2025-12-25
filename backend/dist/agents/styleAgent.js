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
exports.StyleAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class StyleAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'STYLE';
        this.systemPrompt = "You are a Code Style Expert. Check for naming conventions, formatting, and linting rules...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = [];
            if (code.includes('var ')) {
                issues.push({ severity: 'minor', type: 'style', description: 'Usage of "var" detected', suggestion: 'Use "let" or "const"' });
            }
            return {
                type: 'STYLE',
                issues,
                score: 90,
                summary: 'Style checks complete.'
            };
        });
    }
}
exports.StyleAgent = StyleAgent;
