
import { ASTAgent } from './agents/astAgent';

async function runVerification() {
    const agent = new ASTAgent();

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
    const result = await agent.analyze(sampleCode);

    console.log("Score:", result.score);
    console.log("Summary:", result.summary);
    console.log("Issues found:", result.issues.length);

    result.issues.forEach((issue, i) => {
        console.log(`\nIssue ${i + 1}: [${issue.type}] ${issue.description}`);
        console.log(`Suggestion: ${issue.suggestion}`);
    });
}

runVerification();
