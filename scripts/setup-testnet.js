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
        const network = await hardhat_1.ethers.provider.getNetwork();
        console.log(`✅ Connected to: ${network.name} (Chain ID: ${network.chainId})`);
        const [deployer] = await hardhat_1.ethers.getSigners();
        console.log(`👤 Deployer: ${deployer.address}`);
        const balance = await hardhat_1.ethers.provider.getBalance(deployer.address);
        console.log(`💰 Balance: ${hardhat_1.ethers.formatEther(balance)} MNT`);
        if (balance === 0n) {
            console.log("❌ No balance found!");
            console.log("Get test tokens from: https://faucet.testnet.mantle.xyz/");
        }
        else {
            console.log("✅ Ready to deploy!");
        }
    }
    catch (error) {
        console.error("❌ Connection failed:", error);
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
