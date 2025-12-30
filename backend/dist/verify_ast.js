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
const astAgent_1 = require("./agents/astAgent");
function runVerification() {
    return __awaiter(this, void 0, void 0, function* () {
        const agent = new astAgent_1.ASTAgent();
        const sampleCode = `
    function dangerous() {
        eval("console.log('evil')");
        document.getElementById('app').innerHTML = '<img src=x onerror=alert(1)>';
        setInterval(() => { console.log('leak'); }, 1000);
    }

    function complex() {
        for(let i=0; i<10; i++) {
            for(let j=0; j<10; j++) {
                if(i==j) {
                    console.log(i);
                }
            }
        }
    }
    
    function empty() {}
    
    function unreachable() {
        return;
        console.log('hidden');
    }
    `;
        console.log("Running AST Analysis on sample code...");
        const result = yield agent.analyze(sampleCode);
        console.log("Score:", result.score);
        console.log("Summary:", result.summary);
        console.log("Issues found:", result.issues.length);
        result.issues.forEach((issue, i) => {
            console.log(`\nIssue ${i + 1}: [${issue.type}] ${issue.description}`);
            console.log(`Suggestion: ${issue.suggestion}`);
        });
    });
}
runVerification();
