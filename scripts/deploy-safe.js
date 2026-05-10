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
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Load environment-specific .env file
const network = process.env.HARDHAT_NETWORK || 'localhost';
const envFile = network === 'mantle_testnet' ? '.env.testnet' :
    network === 'mantle_mainnet' ? '.env.production' :
        '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`📁 Loading environment from: ${envFile}`);
async function main() {
    console.log("🚀 Agent League Deployment Script");
    console.log("================================");
    // Validate environment
    const network = await hardhat_1.ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    const [deployer] = await hardhat_1.ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);
    // Check balance
    const balance = await hardhat_1.ethers.provider.getBalance(deployer.address);
    console.log(`💰 Balance: ${hardhat_1.ethers.formatEther(balance)} ETH/MATIC`);
    if (balance === 0n) {
        console.error("❌ ERROR: Deployer has no balance!");
        process.exit(1);
    }
    // Validate required environment variables
    const requiredVars = ['PRIVATE_KEY'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error("❌ Missing environment variables:", missingVars);
        process.exit(1);
    }
    console.log("\n🔧 Starting deployment...");
    try {
        // Deploy AgentRegistry
        console.log("\n📋 Deploying AgentRegistry...");
        const AgentRegistry = await hardhat_1.ethers.getContractFactory("AgentRegistry");
        const agentRegistry = await AgentRegistry.deploy();
        await agentRegistry.waitForDeployment();
        const agentRegistryAddress = await agentRegistry.getAddress();
        console.log("✅ AgentRegistry deployed to:", agentRegistryAddress);
        // Deploy AgentProfileNFT
        console.log("\n🎨 Deploying AgentProfileNFT...");
        const AgentProfileNFT = await hardhat_1.ethers.getContractFactory("AgentProfileNFT");
        const agentProfileNFT = await AgentProfileNFT.deploy(agentRegistryAddress);
        await agentProfileNFT.waitForDeployment();
        const agentProfileNFTAddress = await agentProfileNFT.getAddress();
        console.log("✅ AgentProfileNFT deployed to:", agentProfileNFTAddress);
        // Deploy DisputeResolver
        console.log("\n⚖️ Deploying DisputeResolver...");
        const DisputeResolver = await hardhat_1.ethers.getContractFactory("DisputeResolver");
        const disputeResolver = await DisputeResolver.deploy(agentRegistryAddress);
        await disputeResolver.waitForDeployment();
        const disputeResolverAddress = await disputeResolver.getAddress();
        console.log("✅ DisputeResolver deployed to:", disputeResolverAddress);
        // Deploy AgentDelegation with stablecoin
        console.log("\n💰 Deploying AgentDelegation...");
        let stablecoinAddress = process.env.STABLECOIN_ADDRESS;
        if (!stablecoinAddress || network.name === "hardhat") {
            console.log("⚠️  Deploying mock USDC for testing...");
            const MockERC20 = await hardhat_1.ethers.getContractFactory("MockERC20");
            const mockUsdc = await MockERC20.deploy("USDC", "USDC", 6);
            await mockUsdc.waitForDeployment();
            stablecoinAddress = await mockUsdc.getAddress();
            console.log("✅ Mock USDC deployed to:", stablecoinAddress);
        }
        const AgentDelegation = await hardhat_1.ethers.getContractFactory("AgentDelegation");
        const agentDelegation = await AgentDelegation.deploy(stablecoinAddress, agentRegistryAddress);
        await agentDelegation.waitForDeployment();
        const agentDelegationAddress = await agentDelegation.getAddress();
        console.log("✅ AgentDelegation deployed to:", agentDelegationAddress);
        // Save deployment info
        const deploymentInfo = {
            network: network.name,
            chainId: network.chainId,
            deployer: deployer.address,
            contracts: {
                agentRegistry: agentRegistryAddress,
                agentProfileNFT: agentProfileNFTAddress,
                disputeResolver: disputeResolverAddress,
                agentDelegation: agentDelegationAddress,
                stablecoin: stablecoinAddress,
            },
            timestamp: new Date().toISOString(),
        };
        console.log("\n✅ Deployment Complete!");
        console.log("\n📋 Deployment Summary:");
        console.log(JSON.stringify(deploymentInfo, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
        // Save to file
        const fs = await Promise.resolve().then(() => __importStar(require("fs")));
        const filename = `deployment-${network.name}-${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
        console.log(`\n💾 Deployment saved to: ${filename}`);
        // Generate environment variables for frontend
        const envVars = `
# Frontend Environment Variables for ${network.name.toUpperCase()}
VITE_AGENT_REGISTRY_ADDRESS=${agentRegistryAddress}
VITE_AGENT_PROFILE_NFT_ADDRESS=${agentProfileNFTAddress}
VITE_AGENT_DELEGATION_ADDRESS=${agentDelegationAddress}
VITE_DISPUTE_RESOLVER_ADDRESS=${disputeResolverAddress}
VITE_STABLECOIN_ADDRESS=${stablecoinAddress}
VITE_RPC_URL=${process.env[`${network.name.toUpperCase()}_RPC_URL`]}
`;
        const envFilename = `.env.${network.name}`;
        fs.writeFileSync(envFilename, envVars.trim());
        console.log(`\n📝 Environment file created: ${envFilename}`);
        return deploymentInfo;
    }
    catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
