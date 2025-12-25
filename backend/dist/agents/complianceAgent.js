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
exports.ComplianceAgent = void 0;
const baseAgent_1 = require("./baseAgent");
class ComplianceAgent extends baseAgent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.name = 'COMPLIANCE_AUDIT';
        this.systemPrompt = "You are an Enterprise Compliance Auditor...";
    }
    mockAnalyze(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Since we process file-by-file often, we look for package.json content specifically
            // In a real system, we'd pass the filename to the analyze method. 
            // For now, we use a heuristic if the code looks like package.json
            if (code.includes('"license":') || code.includes('"dependencies":')) {
                return this.analyzePackageJson(code);
            }
            return { type: 'COMPLIANCE_AUDIT', issues: [], score: 100, summary: 'Skipped Compliance (Not a manifest file)' };
        });
    }
    analyzePackageJson(jsonContent) {
        const issues = [];
        let score = 100;
        try {
            const pkg = JSON.parse(jsonContent);
            // 1. License Check
            const validLicenses = ['MIT', 'Apache-2.0', 'ISC', 'BSD-3-Clause'];
            if (!pkg.license) {
                issues.push({ severity: 'high', type: 'compliance', description: 'Missing License field', suggestion: 'Add verified license (e.g., MIT).' });
                score -= 20;
            }
            else if (!validLicenses.includes(pkg.license)) {
                issues.push({ severity: 'medium', type: 'compliance', description: `Non-standard License detected: ${pkg.license}`, suggestion: 'Verify usage rights for Enterprise.' });
                score -= 10;
            }
            // 2. Dependency Check (Mock Vulnerabilities)
            const deps = Object.assign(Object.assign({}, pkg.dependencies), pkg.devDependencies);
            const vulnerableDeps = ['lodash@4.17.15', 'axios@0.21.0', 'express@4.16.0']; // Examples
            Object.entries(deps).forEach(([name, version]) => {
                // Very basic check, normally would use SemVer comparison and CVE database
                const depStr = `${name}@${version.replace('^', '').replace('~', '')}`;
                if (vulnerableDeps.includes(depStr)) {
                    issues.push({ severity: 'critical', type: 'security', description: `Vulnerable dependency: ${depStr}`, suggestion: 'Upgrade immediately to patch CVEs.' });
                    score -= 30;
                }
            });
        }
        catch (e) {
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
exports.ComplianceAgent = ComplianceAgent;
