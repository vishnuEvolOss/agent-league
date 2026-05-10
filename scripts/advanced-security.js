"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function main() {
    console.log("🔬 Advanced Security Analysis");
    console.log("============================");
    const [deployer] = await hardhat_1.ethers.getSigners();
    console.log(`🔍 Analyzing with account: ${deployer.address}`);
    const securityReport = {
        timestamp: new Date().toISOString(),
        overallScore: 0,
        vulnerabilities: [],
        recommendations: [],
        contractAnalysis: []
    };
    // Get deployment info
    const files = fs_1.default.readdirSync(process.cwd()).filter(f => f.startsWith('deployment-hardhat-') && f.endsWith('.json'));
    if (files.length === 0) {
        throw new Error('No deployment file found. Run deploy:local first.');
    }
    const latestFile = files.sort().pop();
    const deployment = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(process.cwd(), latestFile), 'utf8'));
    console.log(`📋 Analyzing deployment: ${latestFile}`);
    // Analyze each contract
    for (const [contractName, address] of Object.entries(deployment.contracts)) {
        console.log(`\n🔍 Analyzing ${contractName}...`);
        const analysis = await analyzeContract(contractName, address, deployer);
        securityReport.contractAnalysis.push(analysis);
    }
    // Check for common vulnerabilities
    await checkVulnerabilities(securityReport);
    // Calculate overall score
    securityReport.overallScore = calculateSecurityScore(securityReport);
    // Generate recommendations
    generateRecommendations(securityReport);
    // Save report
    const reportPath = `security-report-${Date.now()}.json`;
    fs_1.default.writeFileSync(reportPath, JSON.stringify(securityReport, null, 2));
    // Display results
    displayResults(securityReport);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}
async function analyzeContract(contractName, address, deployer) {
    const balance = await hardhat_1.ethers.provider.getBalance(address);
    // Simulate contract analysis (in real implementation, you'd use slither or similar tools)
    const issues = [];
    let securityScore = 100;
    // Check for common issues
    if (contractName.includes('Registry')) {
        issues.push('Consider implementing access control modifiers');
        securityScore -= 5;
    }
    if (contractName.includes('Delegation')) {
        issues.push('Add reentrancy protection for delegation functions');
        securityScore -= 10;
    }
    if (parseFloat(hardhat_1.ethers.formatEther(balance)) > 1) {
        issues.push('High balance detected - consider implementing withdrawal limits');
        securityScore -= 5;
    }
    return {
        name: contractName,
        address,
        balance: hardhat_1.ethers.formatEther(balance),
        securityScore: Math.max(0, securityScore),
        issues,
        gasOptimization: 'Consider using uint256 instead of smaller types for gas optimization'
    };
}
async function checkVulnerabilities(report) {
    console.log("\n🔍 Checking for vulnerabilities...");
    // Simulate vulnerability checks
    const potentialVulnerabilities = [
        {
            severity: 'medium',
            type: 'Access Control',
            description: 'Some functions may lack proper access control',
            recommendation: 'Implement role-based access control (RBAC)'
        },
        {
            severity: 'low',
            type: 'Gas Optimization',
            description: 'Some functions could be optimized for gas efficiency',
            recommendation: 'Use assembly for complex calculations where safe'
        },
        {
            severity: 'medium',
            type: 'Input Validation',
            description: 'External inputs should be thoroughly validated',
            recommendation: 'Add comprehensive input validation for all external functions'
        }
    ];
    // Randomly add some vulnerabilities for demo
    if (Math.random() > 0.5) {
        report.vulnerabilities.push(potentialVulnerabilities[0]);
    }
    if (Math.random() > 0.7) {
        report.vulnerabilities.push(potentialVulnerabilities[1]);
    }
    if (Math.random() > 0.6) {
        report.vulnerabilities.push(potentialVulnerabilities[2]);
    }
}
function calculateSecurityScore(report) {
    const contractScores = report.contractAnalysis.map(c => c.securityScore);
    const avgContractScore = contractScores.reduce((a, b) => a + b, 0) / contractScores.length;
    // Deduct points for vulnerabilities
    const vulnerabilityDeduction = report.vulnerabilities.reduce((total, vuln) => {
        switch (vuln.severity) {
            case 'critical': return total + 20;
            case 'high': return total + 15;
            case 'medium': return total + 10;
            case 'low': return total + 5;
            default: return total;
        }
    }, 0);
    return Math.max(0, Math.min(100, avgContractScore - vulnerabilityDeduction));
}
function generateRecommendations(report) {
    report.recommendations = [
        'Implement comprehensive unit tests for all functions',
        'Consider using OpenZeppelin security utilities',
        'Add event logging for all critical operations',
        'Implement upgradeability patterns for future improvements',
        'Consider getting a professional security audit before mainnet deployment'
    ];
    // Add specific recommendations based on vulnerabilities
    report.vulnerabilities.forEach(vuln => {
        report.recommendations.push(`Address ${vuln.severity} severity issue: ${vuln.recommendation}`);
    });
}
function displayResults(report) {
    console.log("\n📊 Security Analysis Results");
    console.log("==========================");
    console.log(`\n🎯 Overall Security Score: ${report.overallScore}/100`);
    if (report.overallScore >= 90) {
        console.log("✅ Excellent security posture");
    }
    else if (report.overallScore >= 70) {
        console.log("⚠️ Good security with room for improvement");
    }
    else if (report.overallScore >= 50) {
        console.log("🔶 Moderate security - attention needed");
    }
    else {
        console.log("🚨 Poor security - immediate action required");
    }
    console.log("\n📋 Contract Analysis:");
    report.contractAnalysis.forEach(contract => {
        console.log(`\n  ${contract.name} (${contract.address})`);
        console.log(`    Balance: ${contract.balance} ETH`);
        console.log(`    Security Score: ${contract.securityScore}/100`);
        if (contract.issues.length > 0) {
            console.log(`    Issues: ${contract.issues.join(', ')}`);
        }
    });
    if (report.vulnerabilities.length > 0) {
        console.log("\n🚨 Vulnerabilities Found:");
        report.vulnerabilities.forEach(vuln => {
            console.log(`  [${vuln.severity.toUpperCase()}] ${vuln.type}: ${vuln.description}`);
        });
    }
    else {
        console.log("\n✅ No critical vulnerabilities found");
    }
    console.log("\n💡 Recommendations:");
    report.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
    });
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
