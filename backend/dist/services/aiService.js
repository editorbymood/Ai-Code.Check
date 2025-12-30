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
    generateReview: (code, systemPrompt) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const prompt = systemPrompt || SYSTEM_PROMPT;
        // 1. Google Gemini (Priority)
        if (process.env.GEMINI_API_KEY) {
            try {
                // Determine model based on availability (gemini-pro is standard)
                const model = 'gemini-pro';
                // Construct Gemini Prompt structure
                // Gemini is strict about JSON, so we emphasize it in the text.
                const finalPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON matching the structure. \n\nCODE TO REVIEW:\n\n${code}`;
                const response = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                    contents: [{
                            parts: [{
                                    text: finalPrompt
                                }]
                        }],
                    generationConfig: {
                        temperature: 0.2,
                        // responseMimeType: "application/json" // Gemini 1.5 Pro supports this, but let's be safe for older keys
                    }
                }, { headers: { 'Content-Type': 'application/json' } });
                const textResponse = (_e = (_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
                if (!textResponse)
                    throw new Error("Empty response from Gemini");
                return parseLLMResponse(textResponse);
            }
            catch (error) {
                console.error("Gemini API Failed", ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message);
                if (!process.env.OPENAI_API_KEY)
                    throw error; // If no fallback, throw
                // Fallback to OpenAI if available...
            }
        }
        // 2. OpenAI (Fallback or Primary)
        if (process.env.OPENAI_API_KEY) {
            try {
                const response = yield axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-4o', // or gpt-3.5-turbo if cost is concern, but gpt-4o is standard now
                    messages: [
                        { role: 'system', content: prompt },
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
                console.error("OpenAI API Failed", ((_g = error.response) === null || _g === void 0 ? void 0 : _g.data) || error.message);
                // Fallback to mock
            }
        }
        console.warn("No valid API keys found or APIs failed. Using Mock Data.");
        return mockReview(code);
    })
};
function parseLLMResponse(text) {
    try {
        // Clean markdown backticks if present
        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.slice(7);
        }
        else if (cleanText.startsWith("```")) {
            cleanText = cleanText.slice(3);
        }
        if (cleanText.endsWith("```")) {
            cleanText = cleanText.slice(0, -3);
        }
        return JSON.parse(cleanText);
    }
    catch (e) {
        console.error("Failed to parse LLM JSON", e);
        throw new Error("Invalid JSON response from AI");
    }
}
function mockReview(code) {
    return {
        summary: "This is a mock review. Configure OPENAI_API_KEY or GEMINI_API_KEY in backend/.env for real analysis.",
        language: "TypeScript (Mock)",
        qualityScore: 75,
        issues: [
            {
                type: "maintainability",
                severity: "minor",
                description: "This is a placeholder result.",
                suggestion: "Add API keys to enable the real AI engine.",
                line: 1
            }
        ],
        refactoredCode: code
    };
}
