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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const BASE_URL = 'http://localhost:3001';
let TOKEN = '';
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log("1. Checking Health...");
            const health = yield axios_1.default.get(`${BASE_URL}/health`);
            console.log("✅ Health:", health.data);
            console.log("\n2. Registering/Logging In...");
            try {
                const reg = yield axios_1.default.post(`${BASE_URL}/api/auth/register`, { email: 'test@admin.com', password: 'password123' });
                TOKEN = reg.data.token;
                console.log("✅ Registered new user");
            }
            catch (e) {
                // Login if exists
                const login = yield axios_1.default.post(`${BASE_URL}/api/auth/login`, { email: 'test@admin.com', password: 'password123' });
                TOKEN = login.data.token;
                console.log("✅ Logged in existing user");
            }
            console.log("\n3. Testing GitHub Webhook...");
            const start = Date.now();
            const webhook = yield axios_1.default.post(`${BASE_URL}/webhooks/github`, {
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
            const form = new form_data_1.default();
            form.append('file', zipBuffer, 'repo.zip');
            const upload = yield axios_1.default.post(`${BASE_URL}/api/repo/upload`, form, {
                headers: Object.assign(Object.assign({}, form.getHeaders()), { 'Authorization': `Bearer ${TOKEN}` })
            });
            console.log("✅ Upload Queued:", upload.data);
            // Poll for status
            console.log("Waiting for processing...");
            yield new Promise(r => setTimeout(r, 2000));
            const status = yield axios_1.default.get(`${BASE_URL}/api/review/${upload.data.reviewId}`, {
                headers: { 'Authorization': `Bearer ${TOKEN}` }
            });
            console.log("✅ Review Status:", status.data.status, `(Score: ${status.data.qualityScore})`);
            if (status.data.status === 'COMPLETED') {
                console.log("SUCCESS: End-to-end flow works!");
            }
            else {
                console.log("PENDING: Review still processing (expected for async)");
            }
        }
        catch (error) {
            console.error("❌ Test Failed:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            process.exit(1);
        }
    });
}
runTests();
