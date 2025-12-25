import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:3001';
let TOKEN = '';

async function runTests() {
    try {
        console.log("1. Checking Health...");
        const health = await axios.get(`${BASE_URL}/health`);
        console.log("✅ Health:", health.data);

        console.log("\n2. Registering/Logging In...");
        try {
            const reg = await axios.post(`${BASE_URL}/api/auth/register`, { email: 'test@admin.com', password: 'password123' });
            TOKEN = reg.data.token;
            console.log("✅ Registered new user");
        } catch (e) {
            // Login if exists
            const login = await axios.post(`${BASE_URL}/api/auth/login`, { email: 'test@admin.com', password: 'password123' });
            TOKEN = login.data.token;
            console.log("✅ Logged in existing user");
        }

        console.log("\n3. Testing GitHub Webhook...");
        const start = Date.now();
        const webhook = await axios.post(`${BASE_URL}/webhooks/github`, {
            repository: { html_url: 'https://github.com/mock/repo' },
            after: 'commit_sha_123',
            pusher: { name: 'TestUser' }
        }, { headers: { 'x-github-event': 'push' } });
        console.log("✅ Webhook Response:", webhook.data);

        console.log("\n4. Testing Mock Upload...");
        // Create a dummy zip
        const AdmZip = require('adm-zip');
        const zip = new AdmZip();
        zip.addFile("test.js", Buffer.from("function evalMe() { eval('bad'); }"));
        zip.addFile("safe.js", Buffer.from("console.log('hello');"));
        const zipBuffer = zip.toBuffer();

        const form = new FormData();
        form.append('file', zipBuffer, 'repo.zip');

        const upload = await axios.post(`${BASE_URL}/api/repo/upload`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        console.log("✅ Upload Queued:", upload.data);

        // Poll for status
        console.log("Waiting for processing...");
        await new Promise(r => setTimeout(r, 2000));

        const status = await axios.get(`${BASE_URL}/api/review/${upload.data.reviewId}`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        console.log("✅ Review Status:", status.data.status, `(Score: ${status.data.qualityScore})`);

        if (status.data.status === 'COMPLETED') {
            console.log("SUCCESS: End-to-end flow works!");
        } else {
            console.log("PENDING: Review still processing (expected for async)");
        }

    } catch (error: any) {
        console.error("❌ Test Failed:", error.response?.data || error.message);
        process.exit(1);
    }
}

runTests();
