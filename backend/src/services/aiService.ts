import axios from 'axios';

// Define the structure of the expected output
export interface CodeReviewResponse {
    summary: string;
    issues: Array<{
        type: 'bug' | 'security' | 'performance' | 'style' | 'maintainability';
        severity: 'critical' | 'major' | 'minor';
        line?: number;
        description: string;
        suggestion: string;
    }>;
    qualityScore: number;
    refactoredCode: string;
    language: string;
}

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

export const aiService = {
    generateReview: async (code: string, systemPrompt?: string): Promise<CodeReviewResponse> => {
        const prompt = systemPrompt || SYSTEM_PROMPT;

        // 1. Google Gemini (Priority)
        if (process.env.GEMINI_API_KEY) {
            try {
                // Determine model based on availability (gemini-pro is standard)
                const model = 'gemini-pro';

                // Construct Gemini Prompt structure
                // Gemini is strict about JSON, so we emphasize it in the text.
                const finalPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON matching the structure. \n\nCODE TO REVIEW:\n\n${code}`;

                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        contents: [{
                            parts: [{
                                text: finalPrompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.2,
                            // responseMimeType: "application/json" // Gemini 1.5 Pro supports this, but let's be safe for older keys
                        }
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!textResponse) throw new Error("Empty response from Gemini");

                return parseLLMResponse(textResponse);

            } catch (error: any) {
                console.error("Gemini API Failed", error.response?.data || error.message);
                if (!process.env.OPENAI_API_KEY) throw error; // If no fallback, throw
                // Fallback to OpenAI if available...
            }
        }

        // 2. OpenAI (Fallback or Primary)
        if (process.env.OPENAI_API_KEY) {
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-4o', // or gpt-3.5-turbo if cost is concern, but gpt-4o is standard now
                        messages: [
                            { role: 'system', content: prompt },
                            { role: 'user', content: `Review this code:\n\n${code}` }
                        ],
                        temperature: 0.2,
                        response_format: { type: "json_object" }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const content = response.data.choices[0].message.content;
                return JSON.parse(content);

            } catch (error: any) {
                console.error("OpenAI API Failed", error.response?.data || error.message);
                // Fallback to mock
            }
        }

        console.warn("No valid API keys found or APIs failed. Using Mock Data.");
        return mockReview(code);
    }
};

function parseLLMResponse(text: string): CodeReviewResponse {
    try {
        // Clean markdown backticks if present
        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.slice(7);
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.slice(3);
        }
        if (cleanText.endsWith("```")) {
            cleanText = cleanText.slice(0, -3);
        }
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse LLM JSON", e);
        throw new Error("Invalid JSON response from AI");
    }
}

function mockReview(code: string): CodeReviewResponse {
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
