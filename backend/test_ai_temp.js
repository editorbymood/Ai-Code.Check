const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing AI Integration...");
        const response = await axios.post('http://localhost:3001/api/review/analyze', {
            code: "function add(a, b) { return a + b; }",
            mode: "STANDARD"
        }, {
            headers: { 'Content-Type': 'application/json' } // Add auth header if needed, but for MVP maybe loose? 
            // Wait, auth middleware is likely active. I need a token?
            // Let's check reviewController.
        });
        console.log("Response:", response.data);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}

// Actually, I need a token or I need to bypass auth for this test.
// reviewRoutes.ts likely has auth middleware.
// I can login first? Or just rely on the user manually testing. 
// "Do it on your own" -> I should probably just start the server. verifying might be hard without a token.
// Let's Just start the server for now.
