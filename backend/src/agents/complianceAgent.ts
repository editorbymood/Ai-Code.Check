import { BaseAgent, AgentResult } from './baseAgent';

export class ComplianceAgent extends BaseAgent {
    name = 'COMPLIANCE_AUDIT';
    systemPrompt = "You are an Enterprise Compliance Auditor...";

    async mockAnalyze(code: string): Promise<AgentResult> {
        // Since we process file-by-file often, we look for package.json content specifically
        // In a real system, we'd pass the filename to the analyze method. 
        // For now, we use a heuristic if the code looks like package.json
        if (code.includes('"license":') || code.includes('"dependencies":')) {
            return this.analyzePackageJson(code);
        }
        return { type: 'COMPLIANCE_AUDIT', issues: [], score: 100, summary: 'Skipped Compliance (Not a manifest file)' };
    }

    private analyzePackageJson(jsonContent: string): AgentResult {
        const issues: any[] = [];
        let score = 100;
        try {
            const pkg = JSON.parse(jsonContent);

            // 1. License Check
            const validLicenses = ['MIT', 'Apache-2.0', 'ISC', 'BSD-3-Clause'];
            if (!pkg.license) {
                issues.push({ severity: 'high', type: 'compliance', description: 'Missing License field', suggestion: 'Add verified license (e.g., MIT).' });
                score -= 20;
            } else if (!validLicenses.includes(pkg.license)) {
                issues.push({ severity: 'medium', type: 'compliance', description: `Non-standard License detected: ${pkg.license}`, suggestion: 'Verify usage rights for Enterprise.' });
                score -= 10;
            }

            // 2. Dependency Check (Mock Vulnerabilities)
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            const vulnerableDeps = ['lodash@4.17.15', 'axios@0.21.0', 'express@4.16.0']; // Examples

            Object.entries(deps).forEach(([name, version]: [string, any]) => {
                // Very basic check, normally would use SemVer comparison and CVE database
                const depStr = `${name}@${version.replace('^', '').replace('~', '')}`;
                if (vulnerableDeps.includes(depStr)) {
                    issues.push({ severity: 'critical', type: 'security', description: `Vulnerable dependency: ${depStr}`, suggestion: 'Upgrade immediately to patch CVEs.' });
                    score -= 30;
                }
            });

        } catch (e) {
            // Ignore parse errors
        }

        return {
            type: 'COMPLIANCE_AUDIT',
            issues,
            score: Math.max(0, score),
            summary: issues.length > 0 ? `Compliance found ${issues.length} violation(s).` : 'Compliance passed.'
        };
    }
}
