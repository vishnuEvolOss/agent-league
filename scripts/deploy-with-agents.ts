import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Agent League contracts to Mantle Testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT");

  // Deploy AgentRegistry
  console.log("\n📋 Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  console.log("✅ AgentRegistry deployed to:", await agentRegistry.getAddress());

  // Deploy AgentProfileNFT
  console.log("\n🎨 Deploying AgentProfileNFT...");
  const AgentProfileNFT = await ethers.getContractFactory("AgentProfileNFT");
  const agentProfileNFT = await AgentProfileNFT.deploy(await agentRegistry.getAddress());
  await agentProfileNFT.waitForDeployment();
  console.log("✅ AgentProfileNFT deployed to:", await agentProfileNFT.getAddress());

  // Deploy DisputeResolver
  console.log("\n⚖️ Deploying DisputeResolver...");
  const DisputeResolver = await ethers.getContractFactory("DisputeResolver");
  const disputeResolver = await DisputeResolver.deploy(await agentRegistry.getAddress());
  await disputeResolver.waitForDeployment();
  console.log("✅ DisputeResolver deployed to:", await disputeResolver.getAddress());

  // Deploy Mock USDC for testing
  console.log("\n💰 Deploying Mock USDC...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUsdc = await MockERC20.deploy("USDC", "USDC", 6);
  await mockUsdc.waitForDeployment();
  console.log("✅ Mock USDC deployed to:", await mockUsdc.getAddress());

  // Deploy AgentDelegation
  console.log("\n🤝 Deploying AgentDelegation...");
  const AgentDelegation = await ethers.getContractFactory("AgentDelegation");
  const agentDelegation = await AgentDelegation.deploy(
    await mockUsdc.getAddress(),
    await agentRegistry.getAddress()
  );
  await agentDelegation.waitForDeployment();
  console.log("✅ AgentDelegation deployed to:", await agentDelegation.getAddress());

  // Register example agents
  console.log("\n🤖 Registering example agents...");

  const agents = [
    {
      address: "0x1111111111111111111111111111111111111111",
      name: "Alice - Conservative Yield",
      description: "Low-risk yield farming strategy focused on stable returns",
      ipfsURI: "QmAliceProfile123"
    },
    {
      address: "0x2222222222222222222222222222222222222222",
      name: "Bob - Aggressive Growth",
      description: "High-risk, high-reward perpetual trading strategy",
      ipfsURI: "QmBobProfile456"
    },
    {
      address: "0x3333333333333333333333333333333333333333",
      name: "Charlie - Balanced",
      description: "Balanced approach combining yield farming and trading",
      ipfsURI: "QmCharlieProfile789"
    }
  ];

  for (const agent of agents) {
    await agentRegistry.registerAgent(
      agent.address,
      agent.name,
      agent.description,
      agent.ipfsURI
    );
    console.log(`✅ Registered agent: ${agent.name}`);

    // Mint NFT profile
    await agentProfileNFT.mintAgentProfile(
      agent.address,
      agent.ipfsURI
    );
    console.log(`✅ Minted NFT profile for: ${agent.name}`);
  }

  // Update agent performance metrics
  console.log("\n📊 Updating agent performance metrics...");

  // Alice - Conservative (ROI: 4.5%, Sharpe: 1.85, DD: 2.15%)
  await agentRegistry.updateStats(
    agents[0].address,
    450,    // totalROI in basis points (4.5%)
    ethers.parseEther("1.85"), // sharpeRatio scaled by 1e18
    215,    // maxDrawdown in basis points (2.15%)
    8,      // totalTrades
    5,      // winningTrades
    50000   // averageTradeSize
  );

  // Bob - Aggressive (ROI: 15%, Sharpe: 2.12, DD: 8.5%)
  await agentRegistry.updateStats(
    agents[1].address,
    1500,   // totalROI in basis points (15%)
    ethers.parseEther("2.12"), // sharpeRatio
    850,    // maxDrawdown in basis points (8.5%)
    12,     // totalTrades
    8,      // winningTrades
    75000   // averageTradeSize
  );

  // Charlie - Balanced (ROI: 8.25%, Sharpe: 1.45, DD: 5%)
  await agentRegistry.updateStats(
    agents[2].address,
    825,    // totalROI in basis points (8.25%)
    ethers.parseEther("1.45"), // sharpeRatio
    500,    // maxDrawdown in basis points (5%)
    15,     // totalTrades
    8,      // winningTrades
    30000   // averageTradeSize
  );

  console.log("✅ Updated performance metrics for all agents");

  // Mint some USDC for testing
  console.log("\n💵 Minting test USDC...");
  await mockUsdc.mint(deployer.address, ethers.parseUnits("10000", 6));
  console.log("✅ Minted 10,000 USDC to deployer");

  // Save deployment addresses
  const deploymentAddresses = {
    agentRegistry: await agentRegistry.getAddress(),
    agentProfileNFT: await agentProfileNFT.getAddress(),
    disputeResolver: await disputeResolver.getAddress(),
    agentDelegation: await agentDelegation.getAddress(),
    mockUsdc: await mockUsdc.getAddress(),
    network: (await ethers.provider.getNetwork()).name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    exampleAgents: agents.map(a => ({ name: a.name, address: a.address }))
  };

  console.log("\n✅ Deployment complete!");
  console.log("\nDeployment addresses:");
  console.log(JSON.stringify(deploymentAddresses, null, 2));

  // Write to file
  const fs = await import("fs");
  const filename = `deployments-${process.env.HARDHAT_NETWORK || "mantle_testnet"}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentAddresses, null, 2));
  console.log(`\n📄 Deployment info saved to: ${filename}`);

  console.log("\n🎉 Ready to use!");
  console.log("1. Start backend: npm run backend:start");
  console.log("2. Start frontend: npm run frontend");
  console.log("3. Visit http://localhost:5173");

  return deploymentAddresses;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});