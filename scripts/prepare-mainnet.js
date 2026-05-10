"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
async function prepareMainnetDeployment() {
    console.log("🚀 Preparing for Mainnet Deployment");
    console.log("====================================");
    const prep = {
        timestamp: new Date().toISOString(),
        checks: {},
        overall: 'NOT_READY',
        recommendations: [],
    };
    // Check 1: Environment Setup
    console.log("\n🔍 Check 1: Production Environment");
    const prodEnvPath = path.resolve(process.cwd(), '.env.production');
    if (!fs.existsSync(prodEnvPath)) {
        prep.checks.environment = {
            status: 'NOT_READY',
            details: '.env.production file not found',
            action: 'Create .env.production from template',
        };
        console.log("❌ .env.production not found");
    }
    else {
        dotenv.config({ path: prodEnvPath });
        const requiredVars = ['PRIVATE_KEY', 'MANTLE_MAINNET_RPC'];
        const missingVars = requiredVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            prep.checks.environment = {
                status: 'NOT_READY',
                details: `Missing variables: ${missingVars.join(', ')}`,
                action: 'Add missing variables to .env.production',
            };
            console.log(`❌ Missing: ${missingVars.join(', ')}`);
        }
        else {
            prep.checks.environment = {
                status: 'READY',
                details: 'All required environment variables present',
                action: 'None',
            };
            console.log("✅ Environment variables configured");
        }
    }
    // Check 2: Wallet Balance
    console.log("\n🔍 Check 2: Mainnet Wallet Balance");
    try {
        const [deployer] = await hardhat_1.ethers.getSigners();
        const balance = await hardhat_1.ethers.provider.getBalance(deployer.address);
        const balanceEth = parseFloat(hardhat_1.ethers.formatEther(balance));
        if (balanceEth < 0.1) {
            prep.checks.balance = {
                status: 'NOT_READY',
                details: `Insufficient balance: ${balanceEth.toFixed(4)} MNT`,
                action: 'Fund wallet with at least 0.1 MNT for deployment',
            };
            console.log(`❌ Low balance: ${balanceEth.toFixed(4)} MNT`);
        }
        else {
            prep.checks.balance = {
                status: 'READY',
                details: `Sufficient balance: ${balanceEth.toFixed(4)} MNT`,
                action: 'None',
            };
            console.log(`✅ Sufficient balance: ${balanceEth.toFixed(4)} MNT`);
        }
    }
    catch (error) {
        prep.checks.balance = {
            status: 'NOT_READY',
            details: 'Cannot connect to mainnet',
            action: 'Check RPC connection and network settings',
        };
        console.log("❌ Cannot check balance - network issue");
    }
    // Check 3: Contract Compilation
    console.log("\n🔍 Check 3: Contract Compilation");
    try {
        // This would normally run hardhat compile, but we'll check if artifacts exist
        const artifactsPath = path.resolve(process.cwd(), 'artifacts/contracts');
        const contractDirs = fs.readdirSync(artifactsPath);
        const requiredContracts = ['AgentRegistry.sol', 'AgentDelegation.sol', 'DisputeResolver.sol', 'AgentProfileNFT.sol'];
        const missingContracts = requiredContracts.filter(contract => !contractDirs.some(dir => dir.includes(contract.replace('.sol', ''))));
        if (missingContracts.length > 0) {
            prep.checks.compilation = {
                status: 'NOT_READY',
                details: `Missing contracts: ${missingContracts.join(', ')}`,
                action: 'Run npm run compile to build all contracts',
            };
            console.log(`❌ Missing contracts: ${missingContracts.join(', ')}`);
        }
        else {
            prep.checks.compilation = {
                status: 'READY',
                details: 'All contracts compiled successfully',
                action: 'None',
            };
            console.log("✅ All contracts compiled");
        }
    }
    catch (error) {
        prep.checks.compilation = {
            status: 'NOT_READY',
            details: 'Cannot verify contract compilation',
            action: 'Run npm run compile',
        };
        console.log("❌ Cannot verify compilation");
    }
    // Check 4: Security Audit
    console.log("\n🔍 Check 4: Security Status");
    const securityFiles = fs.readdirSync(process.cwd()).filter(f => f.startsWith('security-audit-'));
    if (securityFiles.length === 0) {
        prep.checks.security = {
            status: 'NOT_READY',
            details: 'No security audit performed',
            action: 'Run npm run security:audit to perform security check',
        };
        console.log("❌ No security audit found");
    }
    else {
        const latestAudit = securityFiles.sort().pop();
        const auditPath = path.resolve(process.cwd(), latestAudit);
        const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
        if (audit.overall === 'VULNERABLE') {
            prep.checks.security = {
                status: 'NOT_READY',
                details: 'Security vulnerabilities detected',
                action: 'Fix security issues before deployment',
            };
            console.log("❌ Security vulnerabilities found");
        }
        else if (audit.overall === 'WARNING') {
            prep.checks.security = {
                status: 'WARNING',
                details: 'Security warnings present',
                action: 'Review and address security warnings',
            };
            console.log("⚠️ Security warnings present");
        }
        else {
            prep.checks.security = {
                status: 'READY',
                details: 'Security audit passed',
                action: 'None',
            };
            console.log("✅ Security audit passed");
        }
    }
    // Check 5: Testing
    console.log("\n🔍 Check 5: Test Coverage");
    try {
        const testPath = path.resolve(process.cwd(), 'test');
        const testFiles = fs.existsSync(testPath) ? fs.readdirSync(testPath).filter(f => f.endsWith('.test.ts')) : [];
        if (testFiles.length === 0) {
            prep.checks.testing = {
                status: 'WARNING',
                details: 'No test files found',
                action: 'Create and run tests before mainnet deployment',
            };
            console.log("⚠️ No tests found");
        }
        else {
            prep.checks.testing = {
                status: 'READY',
                details: `${testFiles.length} test files found`,
                action: 'Run npm run test to verify all tests pass',
            };
            console.log(`✅ Found ${testFiles.length} test files`);
        }
    }
    catch (error) {
        prep.checks.testing = {
            status: 'WARNING',
            details: 'Cannot verify test files',
            action: 'Ensure test directory exists and tests are written',
        };
        console.log("⚠️ Cannot verify tests");
    }
    // Check 6: Documentation
    console.log("\n🔍 Check 6: Documentation");
    const requiredDocs = ['README.md', 'SECURITY_GUIDE.md'];
    const missingDocs = requiredDocs.filter(doc => !fs.existsSync(path.resolve(process.cwd(), doc)));
    if (missingDocs.length > 0) {
        prep.checks.documentation = {
            status: 'WARNING',
            details: `Missing documentation: ${missingDocs.join(', ')}`,
            action: 'Create missing documentation files',
        };
        console.log(`⚠️ Missing docs: ${missingDocs.join(', ')}`);
    }
    else {
        prep.checks.documentation = {
            status: 'READY',
            details: 'All required documentation present',
            action: 'None',
        };
        console.log("✅ Documentation complete");
    }
    // Calculate overall readiness
    const checks = Object.values(prep.checks);
    const readyCount = checks.filter(c => c.status === 'READY').length;
    const notReadyCount = checks.filter(c => c.status === 'NOT_READY').length;
    if (notReadyCount > 0) {
        prep.overall = 'NOT_READY';
    }
    else {
        prep.overall = 'READY';
    }
    // Generate recommendations
    prep.recommendations = [
        'Start with a small test deployment on mainnet',
        'Use a hardware wallet for private key security',
        'Set up monitoring immediately after deployment',
        'Have emergency procedures ready',
        'Consider getting a professional security audit',
        'Test all functionality with small amounts first',
    ];
    // Save preparation report
    const prepFile = path.resolve(process.cwd(), `mainnet-prep-${Date.now()}.json`);
    fs.writeFileSync(prepFile, JSON.stringify(prep, null, 2));
    console.log(`\n📊 Mainnet Preparation Results:`);
    console.log(`✅ Ready: ${readyCount}`);
    console.log(`❌ Not Ready: ${notReadyCount}`);
    console.log(`⚠️  Warnings: ${checks.filter(c => c.status === 'WARNING').length}`);
    console.log(`🎯 Overall Status: ${prep.overall}`);
    console.log(`📄 Report saved to: ${prepFile}`);
    return prep;
}
// Generate deployment checklist
function generateDeploymentChecklist(prep) {
    console.log("\n📋 Mainnet Deployment Checklist:");
    console.log("================================");
    for (const [check, result] of Object.entries(prep.checks)) {
        const icon = result.status === 'READY' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
        console.log(`${icon} ${check}: ${result.details}`);
        if (result.action !== 'None') {
            console.log(`   Action: ${result.action}`);
        }
    }
    console.log("\n🚀 Pre-Deployment Actions:");
    console.log("========================");
    for (const rec of prep.recommendations) {
        console.log(`💡 ${rec}`);
    }
    if (prep.overall === 'READY') {
        console.log("\n🎉 READY FOR MAINNET DEPLOYMENT!");
        console.log("Run: npm run deploy:mainnet");
    }
    else {
        console.log("\n⚠️ NOT READY FOR MAINNET DEPLOYMENT");
        console.log("Complete the required actions above first");
    }
}
// Main execution
async function main() {
    const prep = await prepareMainnetDeployment();
    generateDeploymentChecklist(prep);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error("Mainnet preparation failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
