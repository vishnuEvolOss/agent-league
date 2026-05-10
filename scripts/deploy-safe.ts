import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as path from "path";

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
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH/MATIC`);

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
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    const agentRegistry = await AgentRegistry.deploy();
    await agentRegistry.waitForDeployment();
    const agentRegistryAddress = await agentRegistry.getAddress();
    console.log("✅ AgentRegistry deployed to:", agentRegistryAddress);

    // Deploy AgentProfileNFT
    console.log("\n🎨 Deploying AgentProfileNFT...");
    const AgentProfileNFT = await ethers.getContractFactory("AgentProfileNFT");
    const agentProfileNFT = await AgentProfileNFT.deploy(agentRegistryAddress);
    await agentProfileNFT.waitForDeployment();
    const agentProfileNFTAddress = await agentProfileNFT.getAddress();
    console.log("✅ AgentProfileNFT deployed to:", agentProfileNFTAddress);

    // Deploy DisputeResolver
    console.log("\n⚖️ Deploying DisputeResolver...");
    const DisputeResolver = await ethers.getContractFactory("DisputeResolver");
    const disputeResolver = await DisputeResolver.deploy(agentRegistryAddress);
    await disputeResolver.waitForDeployment();
    const disputeResolverAddress = await disputeResolver.getAddress();
    console.log("✅ DisputeResolver deployed to:", disputeResolverAddress);

    // Deploy AgentDelegation with stablecoin
    console.log("\n💰 Deploying AgentDelegation...");
    let stablecoinAddress = process.env.STABLECOIN_ADDRESS;
    
    if (!stablecoinAddress || network.name === "hardhat") {
      console.log("⚠️  Deploying mock USDC for testing...");
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const mockUsdc = await MockERC20.deploy("USDC", "USDC", 6);
      await mockUsdc.waitForDeployment();
      stablecoinAddress = await mockUsdc.getAddress();
      console.log("✅ Mock USDC deployed to:", stablecoinAddress);
    }

    const AgentDelegation = await ethers.getContractFactory("AgentDelegation");
    const agentDelegation = await AgentDelegation.deploy(
      stablecoinAddress,
      agentRegistryAddress
    );
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
    console.log(JSON.stringify(deploymentInfo, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value, 2));

    // Save to file
    const fs = await import("fs");
    const filename = `deployment-${network.name}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value, 2));
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

  } catch (error) {
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
