import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔧 Testnet Setup Script");
  console.log("=====================");

  // Check if .env.testnet exists
  const envPath = path.resolve(process.cwd(), '.env.testnet');
  
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env.testnet file not found!");
    console.log("Please create .env.testnet with your testnet private key.");
    return;
  }

  // Read current env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if private key is set
  if (envContent.includes('YOUR_TESTNET_PRIVATE_KEY_HERE')) {
    console.log("⚠️  Please update your private key in .env.testnet");
    console.log("Get test tokens from: https://faucet.testnet.mantle.xyz/");
    console.log("Add Mantle Testnet to MetaMask:");
    console.log("  Network Name: Mantle Testnet");
    console.log("  RPC URL: https://rpc.testnet.mantle.xyz");
    console.log("  Chain ID: 5003");
    console.log("  Currency Symbol: MNT");
    return;
  }

  // Test connection to testnet
  try {
    const network = await ethers.provider.getNetwork();
    console.log(`✅ Connected to: ${network.name} (Chain ID: ${network.chainId})`);
    
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 Balance: ${ethers.formatEther(balance)} MNT`);
    
    if (balance === 0n) {
      console.log("❌ No balance found!");
      console.log("Get test tokens from: https://faucet.testnet.mantle.xyz/");
    } else {
      console.log("✅ Ready to deploy!");
    }
    
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
