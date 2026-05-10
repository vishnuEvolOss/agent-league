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
async function performSecurityAudit() {
    console.log("🔒 Performing Security Audit");
    console.log("===========================");
    const network = await hardhat_1.ethers.provider.getNetwork();
    const [deployer] = await hardhat_1.ethers.getSigners();
    const audit = {
        timestamp: new Date().toISOString(),
        network: network.name,
        deployer: deployer.address,
        checks: {},
        overall: 'WARNING',
    };
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`👤 Auditor: ${deployer.address}`);
    // Load deployment info - find the latest deployment file
    const files = fs.readdirSync(process.cwd()).filter(f => f.startsWith('deployment-hardhat-') && f.endsWith('.json'));
    if (files.length === 0) {
        throw new Error('No deployment file found. Run deploy:local first.');
    }
    const latestFile = files.sort().pop();
    const deploymentFile = path.resolve(process.cwd(), latestFile);
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    // Security Check 1: Private Key Exposure
    console.log("\n🔍 Check 1: Private Key Security");
    const envFiles = ['.env', '.env.local', '.env.testnet', '.env.production'];
    let privateKeyExposed = false;
    for (const envFile of envFiles) {
        const envPath = path.resolve(process.cwd(), envFile);
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            if (content.includes('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')) {
                privateKeyExposed = true;
                console.log(`⚠️  Test private key found in ${envFile}`);
            }
        }
    }
    audit.checks.privateKeySecurity = {
        status: privateKeyExposed ? 'WARNING' : 'PASS',
        description: privateKeyExposed ? 'Test private key detected in environment files' : 'No test private keys exposed',
        recommendation: privateKeyExposed ? 'Replace test private key with real wallet for production' : undefined,
    };
    // Security Check 2: Contract Ownership
    console.log("\n🔍 Check 2: Contract Ownership");
    let ownershipIssues = 0;
    for (const [name, address] of Object.entries(deployment.contracts)) {
        try {
            // Simple ownership check - try to get owner if contract has it
            const contract = await hardhat_1.ethers.getContractAt("AgentRegistry", address);
            // This will fail if contract doesn't have owner(), but that's okay
            try {
                const owner = await contract.owner();
                console.log(`  ${name}: Owner is ${owner}`);
            }
            catch {
                console.log(`  ${name}: No standard ownership function`);
            }
        }
        catch (error) {
            console.log(`  ${name}: ❌ Cannot verify ownership`);
            ownershipIssues++;
        }
    }
    audit.checks.contractOwnership = {
        status: ownershipIssues === 0 ? 'PASS' : 'WARNING',
        description: `Checked ownership of ${Object.keys(deployment.contracts).length} contracts`,
    };
    // Security Check 3: Environment Variable Security
    console.log("\n🔍 Check 3: Environment Security");
    const sensitiveVars = ['PRIVATE_KEY', 'MANTLE_MAINNET_RPC', 'ETHERSCAN_API_KEY'];
    let envSecurityIssues = 0;
    for (const envFile of ['.env.production']) {
        const envPath = path.resolve(process.cwd(), envFile);
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            for (const varName of sensitiveVars) {
                if (content.includes(`${varName}=0x`) || content.includes(`${varName}=`)) {
                    console.log(`  ⚠️  Sensitive variable ${varName} found in ${envFile}`);
                    envSecurityIssues++;
                }
            }
        }
    }
    audit.checks.environmentSecurity = {
        status: envSecurityIssues === 0 ? 'PASS' : 'WARNING',
        description: `Checked ${sensitiveVars.length} sensitive variables`,
        recommendation: envSecurityIssues > 0 ? 'Ensure .env files are in .gitignore and never committed' : undefined,
    };
    // Security Check 4: Git Security
    console.log("\n🔍 Check 4: Git Repository Security");
    const gitignorePath = path.resolve(process.cwd(), '.gitignore');
    let gitSecurityScore = 0;
    if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath, 'utf8');
        const securePatterns = ['.env', '*.key', 'private-keys.txt'];
        for (const pattern of securePatterns) {
            if (gitignore.includes(pattern)) {
                gitSecurityScore++;
                console.log(`  ✅ ${pattern} is in .gitignore`);
            }
            else {
                console.log(`  ❌ ${pattern} missing from .gitignore`);
            }
        }
        audit.checks.gitSecurity = {
            status: gitSecurityScore >= 3 ? 'PASS' : 'FAIL',
            description: `Git security score: ${gitSecurityScore}/${securePatterns.length}`,
            recommendation: gitSecurityScore < 3 ? 'Add missing patterns to .gitignore' : undefined,
        };
    }
    else {
        audit.checks.gitSecurity = {
            status: 'FAIL',
            description: '.gitignore file not found',
            recommendation: 'Create .gitignore file with security patterns',
        };
    }
    // Security Check 5: Contract Balance Security
    console.log("\n🔍 Check 5: Contract Balance Security");
    let highBalanceContracts = 0;
    for (const [name, address] of Object.entries(deployment.contracts)) {
        try {
            const balance = await hardhat_1.ethers.provider.getBalance(address);
            const balanceEth = parseFloat(hardhat_1.ethers.formatEther(balance));
            if (balanceEth > 1.0) {
                console.log(`  ⚠️  ${name}: High balance ${balanceEth.toFixed(4)} ETH`);
                highBalanceContracts++;
            }
            else {
                console.log(`  ✅ ${name}: Safe balance ${balanceEth.toFixed(4)} ETH`);
            }
        }
        catch (error) {
            console.log(`  ❌ ${name}: Cannot check balance`);
        }
    }
    audit.checks.balanceSecurity = {
        status: highBalanceContracts === 0 ? 'PASS' : 'WARNING',
        description: `${highBalanceContracts} contracts with high balances`,
        recommendation: highBalanceContracts > 0 ? 'Consider withdrawing excess funds from contracts' : undefined,
    };
    // Calculate overall security score
    const checks = Object.values(audit.checks);
    const passCount = checks.filter(c => c.status === 'PASS').length;
    const failCount = checks.filter(c => c.status === 'FAIL').length;
    const warningCount = checks.filter(c => c.status === 'WARNING').length;
    if (failCount > 0) {
        audit.overall = 'VULNERABLE';
    }
    else if (warningCount > 0) {
        audit.overall = 'WARNING';
    }
    else {
        audit.overall = 'SECURE';
    }
    // Save audit results
    const auditFile = path.resolve(process.cwd(), `security-audit-${Date.now()}.json`);
    fs.writeFileSync(auditFile, JSON.stringify(audit, null, 2));
    console.log(`\n📊 Security Audit Results:`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`⚠️  Warnings: ${warningCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`🎯 Overall Status: ${audit.overall}`);
    console.log(`📄 Report saved to: ${auditFile}`);
    return audit;
}
// Generate security recommendations
function generateSecurityChecklist(audit) {
    console.log("\n📋 Security Recommendations:");
    console.log("==========================");
    for (const [check, result] of Object.entries(audit.checks)) {
        if (result.status !== 'PASS') {
            console.log(`\n🔍 ${check}:`);
            console.log(`  Status: ${result.status}`);
            console.log(`  Issue: ${result.description}`);
            if (result.recommendation) {
                console.log(`  Recommendation: ${result.recommendation}`);
            }
        }
    }
    console.log("\n🚀 Pre-Deployment Checklist:");
    console.log("✅ Replace test private keys");
    console.log("✅ Use hardware wallet for mainnet");
    console.log("✅ Verify all .env files are secure");
    console.log("✅ Test with small amounts first");
    console.log("✅ Set up monitoring and alerts");
    console.log("✅ Prepare emergency procedures");
}
// Main execution
async function main() {
    const audit = await performSecurityAudit();
    generateSecurityChecklist(audit);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error("Security audit failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
