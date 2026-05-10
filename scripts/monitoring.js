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
async function setupMonitoring() {
    console.log("🔍 Setting up Contract Monitoring");
    console.log("=================================");
    const network = await hardhat_1.ethers.provider.getNetwork();
    const [deployer] = await hardhat_1.ethers.getSigners();
    // Load deployment info - find the latest deployment file
    const files = fs.readdirSync(process.cwd()).filter(f => f.startsWith('deployment-hardhat-') && f.endsWith('.json'));
    if (files.length === 0) {
        throw new Error('No deployment file found. Run deploy:local first.');
    }
    const latestFile = files.sort().pop();
    const deploymentFile = path.resolve(process.cwd(), latestFile);
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    const monitoringData = {
        timestamp: new Date().toISOString(),
        network: network.name,
        contracts: {},
        health: {
            rpcConnection: true,
            contractStatus: false,
            lastUpdate: new Date().toISOString(),
        },
    };
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`👤 Monitor: ${deployer.address}`);
    // Check each contract
    for (const [name, address] of Object.entries(deployment.contracts)) {
        try {
            console.log(`\n🔍 Checking ${name} at ${address}`);
            // Get contract balance
            const balance = await hardhat_1.ethers.provider.getBalance(address);
            // Get current gas price
            const feeData = await hardhat_1.ethers.provider.getFeeData();
            // Get current block
            const blockNumber = await hardhat_1.ethers.provider.getBlockNumber();
            monitoringData.contracts[name] = {
                address: address,
                balance: hardhat_1.ethers.formatEther(balance),
                gasPrice: feeData.gasPrice ? hardhat_1.ethers.formatUnits(feeData.gasPrice, "gwei") : "N/A",
                blockNumber: blockNumber,
            };
            console.log(`  💰 Balance: ${hardhat_1.ethers.formatEther(balance)} ETH`);
            console.log(`  ⛽ Gas Price: ${feeData.gasPrice ? hardhat_1.ethers.formatUnits(feeData.gasPrice, "gwei") : "N/A"} gwei`);
            console.log(`  📦 Block: ${blockNumber}`);
        }
        catch (error) {
            console.log(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
            monitoringData.contracts[name] = {
                address: address,
                balance: "ERROR",
            };
        }
    }
    // Update health status
    monitoringData.health.contractStatus = Object.values(monitoringData.contracts)
        .every(contract => contract.balance !== "ERROR");
    // Save monitoring data
    const monitoringFile = path.resolve(process.cwd(), `monitoring-${Date.now()}.json`);
    fs.writeFileSync(monitoringFile, JSON.stringify(monitoringData, null, 2));
    console.log(`\n✅ Monitoring data saved to: ${monitoringFile}`);
    console.log(`📊 Overall Health: ${monitoringData.health.contractStatus ? '✅ HEALTHY' : '⚠️ ISSUES DETECTED'}`);
    return monitoringData;
}
// Health check function
async function healthCheck() {
    console.log("\n🏥 Performing Health Check");
    console.log("========================");
    try {
        const data = await setupMonitoring();
        if (data.health.contractStatus) {
            console.log("✅ All systems operational");
        }
        else {
            console.log("⚠️ Some issues detected - check monitoring file");
        }
    }
    catch (error) {
        console.error("❌ Health check failed:", error instanceof Error ? error.message : String(error));
    }
}
// Continuous monitoring
async function startMonitoring(intervalMinutes = 5) {
    console.log(`🔄 Starting continuous monitoring (every ${intervalMinutes} minutes)`);
    const interval = setInterval(async () => {
        console.log(`\n⏰ ${new Date().toLocaleTimeString()} - Running health check...`);
        await healthCheck();
    }, intervalMinutes * 60 * 1000);
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        clearInterval(interval);
        console.log("\n🛑 Monitoring stopped");
        process.exit(0);
    });
}
// Command line interface
const command = process.argv[2];
switch (command) {
    case 'check':
        healthCheck();
        break;
    case 'start':
        const minutes = parseInt(process.argv[3]) || 5;
        startMonitoring(minutes);
        break;
    default:
        setupMonitoring();
        break;
}
