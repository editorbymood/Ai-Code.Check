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
exports.aiService = void 0;
const axios_1 = __importDefault(require("axios"));
const SYSTEM_PROMPT = `
You are an expert Senior Software Engineer and Code Reviewer. 
Your task is to analyze the provided code snippet deeply and provide a structured review in JSON format.

Analyze for:
1. Correctness & Bugs (Logical errors, edge cases)
2. Security Vulnerabilities (Injection, data leaks, etc.)
3. Performance Issues (Complexity, memory leaks)
4. Readability & Maintainability (Naming, structure, comments)
5. Style Guide Violations (PEP8, ESLint depending on language)

You must also provide a Refactored Version of the code that fixes all issues and follows best practices.
You must assign a Quality Score from 0 to 100.

Auto-detect the programming language.

**CRITICAL**: You MUST return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON object.

JSON Structure:
{
  "summary": "High-level summary of the code quality.",
  "language": "Detected Language",
  "issues": [
    {
      "type": "bug" | "security" | "performance" | "style" | "maintainability",
      "severity": "critical" | "major" | "minor",
      "line": <number or null>,
      "description": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ],
  "qualityScore": <number 0-100>,
  "refactoredCode": "Full content of the improved code string"
}
`;
exports.aiService = {
    generateReview: (code, languageHint) => __awaiter(void 0, void 0, void 0, function* () {
        // NOTE: This uses a proprietary LLM API. 
        // Since I don't have a real API key in the prompt, I will assume the user has one or I would use a mock if this was a test.
        // However, the prompt asks for "LLM integration". Use a standard placeholder for OpenAI or similar.
        // If running in Antigravity environment, we can't make external calls without implicit permission or proxy.
        // I will write the code for OpenAI API.
        // For DEMO purposes, if no API key is set, I'll return a mock response so the UI works immediately for the user to see.
        if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
            console.warn("No API Key found. Returning mock response.");
            return mockReview(code);
        }
        try {
            // Example implementation for OpenAI
            const response = yield axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o', // or gpt-4-turbo
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Review this code:\n\n${code}` }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const content = response.data.choices[0].message.content;
            return JSON.parse(content);
        }
        catch (error) {
            console.error("LLM Call Failed", error);
            throw error;
        }
    })
};
function mockReview(code) {
    return {
        summary: "This is a mock review because no API Key was configured. The code looks like a basic snippet.",
        language: "JavaScript (Mock)",
        qualityScore: 75,
        issues: [
            {
                type: "style",
                severity: "minor",
                line: 1,
                description: "Variable 'x' has a non-descriptive name.",
                suggestion: "Rename 'x' to something more meaningful like 'userCount'."
            },
            {
                type: "bug",
                severity: "major",
                line: 5,
                description: "Potential infinite loop if condition is never met.",
                suggestion: "Add a break condition or ensure state updates."
            }
        ],
        refactoredCode: `// Refactored Code (Mock)\n${code}\n// Fixed issues...`
    };
}
