# Devoxa - AI-Powered Code Reviewer

An advanced code review assistant that uses Large Language Models to analyze code for bugs, security vulnerabilities, performance issues, and style violations.

## Features
- **Deep Analysis**: Detects logical errors, edge cases, and security risks.
- **Auto-Refactoring**: Provides a corrected version of the code.
- **Quality Score**: Assigns a 0-100 score based on code health.
- **Multi-Language**: Automatically detects and handles Python, JavaScript, TypeScript, Go, Java, C++, and more.
- **Detailed Report**: Sectioned breakdown of issues (Bugs, Security, Style).
- **Download & Copy**: Export reports and copy refactored code easily.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Monaco Editor, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript.
- **AI**: Integration ready for OpenAI/Gemini (Simulated/Mock mode enabled by default).

## Prerequisites
- Node.js v18+
- npm or yarn

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your API keys if needed
npm run build
npm start
```
The server runs on `http://localhost:3001`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build
npm start
```
The app runs on `http://localhost:3000`.

## Configuration
Create a `.env` file in `backend/` with the following:
```env
PORT=3001
# Optional: Add your API key to enable real AI analysis
OPENAI_API_KEY=sk-...
# or
GEMINI_API_KEY=...
```
*Note: Without an API key, the system runs in Mock Mode for demonstration.*

## API Endpoints
- `POST /review` - Analyze code and get report.
- `POST /score` - Get logic quality score.
- `POST /refactor` - Get refactored code.

## Architecture
- **Frontend**: Client-side app with Monaco Editor state management. Sends code to backend.
- **Backend**: Express controller receiving code, calling `aiService`.
- **AI Service**: Constructs a specialized Code Review System Prompt and calls LLM.

## License
MIT
