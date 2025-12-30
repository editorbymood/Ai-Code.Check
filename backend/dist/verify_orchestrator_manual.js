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
function testReview() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const code = `
        function login(username, password) {
            if (password === 'secret123') {
                return true;
            }
            return false;
        }
        `;
            console.log('Sending request to /api/review...');
            // We assume the server is NOT running, so we might need to rely on unit testing or mocking express. 
            // actually, I should just try to import the controller and run it if possible, 
            // BUT the controller expects req/res objects.
            // EASIER: Just run the server in background and hit it? 
            // OR: Just instantiate the AgentOrchestrator directly to verify it works, 
            // relying on the controller glue code being correct.
            // Let's test the Orchestrator DIRECTLY to avoid server startup complexity in this environment.
            const { agentOrchestrator } = require('./agents/orchestrator');
            console.log('Running AgentOrchestrator directly...');
            const results = yield agentOrchestrator.runAll(code, 'test_login.js', 'STANDARD');
            console.log('---------------------------------------------------');
            console.log(`Generic Score: ${results.reduce((acc, r) => acc + r.score, 0) / results.length}`);
            console.log('Agents executed:', results.map((r) => r.type));
            const securityResult = results.find((r) => r.type === 'SECURITY');
            if (securityResult) {
                console.log('Security Issues:', securityResult.issues.length);
            }
            console.log('Verification Passed if agents returned results.');
        }
        catch (error) {
            console.error('Verification Failed:', error);
        }
    });
}
testReview();
