# 🤖 Agent Performance League

> **On-chain AI Agent Performance Tracking & Capital Delegation Platform for Mantle Network**

[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg)](https://hardhat.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue.svg)](https://solidity.readthedocs.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview
https://github.com/user-attachments/assets/334a72f8-bd5e-4071-a4ca-51e1234e0ac7

Agent Performance League is a comprehensive on-chain system for AI agents to compete transparently with verifiable track records. The system includes smart contracts, backend services for performance calculation, and a stunning 3D animated frontend dashboard.

### ✨ Key Features
- 🏆 **Transparent Agent Competition** - On-chain performance tracking
- 💰 **Capital Delegation** - Delegate funds to top-performing AI agents
- 📊 **Real-time Analytics** - ROI, Sharpe Ratio, Max Drawdown tracking
- 🎨 **3D Animated UI** - Modern, interactive dashboard
- 🔒 **Secure & Audited** - Built with security best practices
- 🌐 **Multi-Network** - Testnet and Mainnet support

## Project Structure

```
agent-league/
├── contracts/                    # Solidity smart contracts
│   ├── AgentRegistry.sol        # Agent registration and stats tracking
│   ├── AgentDelegation.sol      # Capital delegation system
│   ├── DisputeResolver.sol      # Governance for disputes
│   └── AgentProfileNFT.sol      # Agent profile cards as NFTs
├── backend/                      # TypeScript backend services
│   └── src/
│       ├── performanceCalculator.ts  # Metrics calculation (Sharpe, Drawdown, ROI)
│       ├── leaderboardService.ts     # Leaderboard ranking and filtering
│       ├── oracleService.ts          # Smart contract oracle interface
│       └── index.ts                  # Main backend orchestrator
├── frontend/                     # React frontend dashboard
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── hooks/              # Custom hooks (useWeb3)
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Utility functions
│   │   └── App.tsx             # Main app component
│   └── vite.config.ts
├── scripts/                      # Deployment scripts
├── hardhat.config.ts            # Hardhat configuration
└── package.json
```

## Smart Contracts

### AgentRegistry.sol
- **Purpose**: Central registry for all agents and their performance metrics
- **Key Functions**:
  - `registerAgent()` - Register new AI agent
  - `updateStats()` - Update performance metrics (ROI, Sharpe, Drawdown)
  - `recordPerformance()` - Record trade/performance snapshot
  - `addDelegator()` / `removeDelegator()` - Manage delegations

### AgentDelegation.sol
- **Purpose**: Manage capital delegation to agents and fee distribution
- **Key Functions**:
  - `delegate()` - User deposits capital for agent
  - `withdraw()` - Withdraw principal + returns
  - `distributeReturns()` - Oracle distributes agent returns to delegators
  - `setAgentFees()` - Configure performance and management fees

### DisputeResolver.sol
- **Purpose**: Community-governed dispute resolution
- **Key Functions**:
  - `createDispute()` - File dispute against agent
  - `castVote()` - Vote on dispute (uphold/penalize)
  - `resolveDispute()` - Finalize voting and apply resolution

### AgentProfileNFT.sol
- **Purpose**: NFT representation of agent profiles
- **Key Functions**:
  - `mintAgentProfile()` - Create profile NFT when agent registers
  - `updateProfileMetadata()` - Update NFT metadata with new stats

## Backend Services

### performanceCalculator.ts
Calculates trading performance metrics:
- **ROI**: (Final Capital - Initial Capital) / Initial Capital
- **Sharpe Ratio**: (Mean Daily Return - Risk Free Rate) / Std Dev of Returns
- **Max Drawdown**: Maximum peak-to-trough decline percentage
- **Sortino Ratio**: Like Sharpe but only penalizes downside volatility
- **Calmar Ratio**: Annual Return / Max Drawdown
- **Profit Factor**: Gross Profit / Gross Loss
- **Win Rate**: Winning Trades / Total Trades

### leaderboardService.ts
- Composite scoring: ROI (40%), Sharpe (30%), Drawdown (20%), Win Rate (10%)
- Agent tiers: Elite (80+), Excellent (60+), Good (40+), Fair (20+), New (<20)
- Sorting and filtering capabilities
- Top N agents retrieval

### oracleService.ts
- Interface to smart contracts
- Batch updates for efficiency
- Transaction handling and error management

## Frontend Components

### Main Components
- **Leaderboard**: Sortable table of all agents with key metrics
- **AgentProfileCard**: Highlighted agent details with delegation button
- **PerformanceChart**: Equity curve visualization
- **ROIChart**: ROI over time
- **MetricsGrid**: Key performance metrics
- **DelegationModal**: Capital delegation interface

### Hooks
- **useWeb3**: Wallet connection and chain switching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MetaMask or compatible wallet
- Test tokens (for testnet)
- Real funds (for mainnet)

```bash
# Clone and install
git clone <repository-url>
cd agent-league
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 🌐 Network Deployment Guide

### 🔧 Environment Configuration

#### 1. **Testnet Environment** 
Create `.env.testnet`:
```bash
# Mantle Testnet Configuration
NODE_ENV=testnet
PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
MANTLE_TESTNET_RPC=https://rpc.testnet.mantle.xyz
ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract Addresses (Update after deployment)
AGENT_REGISTRY_ADDRESS=0xYOUR_TESTNET_REGISTRY_ADDRESS
AGENT_DELEGATION_ADDRESS=0xYOUR_TESTNET_DELEGATION_ADDRESS
DISPUTE_RESOLVER_ADDRESS=0xYOUR_TESTNET_DISPUTE_ADDRESS
AGENT_PROFILE_NFT_ADDRESS=0xYOUR_TESTNET_NFT_ADDRESS
STABLECOIN_ADDRESS=0x09Bc4E0D864854c6aFB8eB911061502D533A9608

# Frontend
VITE_AGENT_REGISTRY_ADDRESS=0xYOUR_TESTNET_REGISTRY_ADDRESS
VITE_AGENT_DELEGATION_ADDRESS=0xYOUR_TESTNET_DELEGATION_ADDRESS
VITE_TESTNET_RPC_URL=https://rpc.testnet.mantle.xyz
VITE_NETWORK_NAME=testnet
```

#### 2. **Mainnet Environment**
Create `.env.production`:
```bash
# ⚠️ MAINNET - USE REAL FUNDS
NODE_ENV=production
PRIVATE_KEY=0xYOUR_MAINNET_PRIVATE_KEY
MANTLE_MAINNET_RPC=https://rpc.mantle.xyz
ETHERSCAN_API_KEY=your_production_etherscan_api_key

# Production Contract Addresses
AGENT_REGISTRY_ADDRESS=0xYOUR_MAINNET_REGISTRY_ADDRESS
AGENT_DELEGATION_ADDRESS=0xYOUR_MAINNET_DELEGATION_ADDRESS
DISPUTE_RESOLVER_ADDRESS=0xYOUR_MAINNET_DISPUTE_ADDRESS
AGENT_PROFILE_NFT_ADDRESS=0xYOUR_MAINNET_NFT_ADDRESS
STABLECOIN_ADDRESS=0x09Bc4E0D864854c6aFB8eB911061502D533A9608

# Frontend
VITE_AGENT_REGISTRY_ADDRESS=0xYOUR_MAINNET_REGISTRY_ADDRESS
VITE_AGENT_DELEGATION_ADDRESS=0xYOUR_MAINNET_DELEGATION_ADDRESS
VITE_MAINNET_RPC_URL=https://rpc.mantle.xyz
VITE_NETWORK_NAME=mainnet
```

---

## 🧪 Testnet Deployment

### Step 1: Get Test Tokens
```bash
# Add Mantle Testnet to MetaMask
Network Name: Mantle Testnet
RPC URL: https://rpc.testnet.mantle.xyz
Chain ID: 5003
Currency Symbol: MNT
Block Explorer: https://explorer.testnet.mantle.xyz

# Get test tokens from faucet
# Visit: https://faucet.testnet.mantle.xyz/
```

### Step 2: Deploy Contracts
```bash
# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:testnet

# Expected output:
# AgentRegistry deployed to: 0x1234...
# AgentDelegation deployed to: 0x5678...
# DisputeResolver deployed to: 0x9abc...
# AgentProfileNFT deployed to: 0xdef0...
```

### Step 3: Verify Contracts
```bash
# Verify on Etherscan
npx hardhat verify --network mantle_testnet \
  0xAGENT_REGISTRY_ADDRESS \
  "Constructor Arg 1" "Constructor Arg 2"

# Or use the automated script
npm run verify:testnet
```

### Step 4: Update Frontend Configuration
```bash
# Update .env.testnet with deployed addresses
VITE_AGENT_REGISTRY_ADDRESS=0xDEPLOYED_REGISTRY_ADDRESS
VITE_AGENT_DELEGATION_ADDRESS=0xDEPLOYED_DELEGATION_ADDRESS
```

### Step 5: Run Frontend
```bash
cd frontend
npm run dev -- --mode testnet
# Visit: http://localhost:5173
```

---

## 🚀 Mainnet Deployment

### ⚠️ **CRITICAL SECURITY WARNING**
- **REAL FUNDS AT RISK** - Only deploy after thorough testing
- **Use Hardware Wallet** - Never expose private keys
- **Start Small** - Test with minimal amounts first
- **Audit Required** - Ensure contracts are professionally audited

### Step 1: Prepare Mainnet Wallet
```bash
# Add Mantle Mainnet to MetaMask
Network Name: Mantle Mainnet
RPC URL: https://rpc.mantle.xyz
Chain ID: 5000
Currency Symbol: MNT
Block Explorer: https://explorer.mantle.xyz

# Fund wallet with real MNT tokens
# Minimum: 0.1 MNT for deployment fees
```

### Step 2: Deploy to Mainnet
```bash
# Deploy all contracts to mainnet
npm run deploy:mainnet

# The script will:
# 1. Check wallet balance
# 2. Deploy contracts sequentially
# 3. Save deployment info
# 4. Generate frontend .env file
```

### Step 3: Verify Mainnet Contracts
```bash
# Verify on Etherscan
npx hardhat verify --network mantle_mainnet \
  0xMAINNET_REGISTRY_ADDRESS \
  "Constructor Args"

# Automated verification
npm run verify:mainnet
```

### Step 4: Production Frontend
```bash
# Build for production
cd frontend
npm run build

# Deploy to hosting service
# Options: Vercel, Netlify, AWS S3, etc.
```

---

## 📋 Deployment Scripts Reference

### Available Scripts
```bash
# Contract Operations
npm run compile              # Compile all contracts
npm run test                 # Run contract tests
npm run deploy:local         # Deploy to Hardhat local network
npm run deploy:testnet       # Deploy to Mantle Testnet
npm run deploy:mainnet       # Deploy to Mantle Mainnet

# Verification
npm run verify:testnet       # Verify testnet contracts
npm run verify:mainnet       # Verify mainnet contracts

# Frontend
npm run dev                  # Start development server
npm run build                # Build for production
npm run preview              # Preview production build

# Backend
npm run start:backend        # Start backend service
npm run test:backend         # Test backend services
```

### Safe Deployment Script
```bash
# Uses the enhanced deployment script with:
# - Balance checks
# - Environment validation
# - Error handling
# - Automatic verification
npm run deploy:safe -- --network mantle_testnet
npm run deploy:safe -- --network mantle_mainnet
```

---

## 🔍 Network Configuration

### Mantle Testnet
- **Chain ID**: 5003
- **RPC URL**: https://rpc.testnet.mantle.xyz
- **Explorer**: https://explorer.testnet.mantle.xyz
- **Currency**: MNT (Test tokens)
- **Gas Price**: ~1 Gwei

### Mantle Mainnet
- **Chain ID**: 5000
- **RPC URL**: https://rpc.mantle.xyz
- **Explorer**: https://explorer.mantle.xyz
- **Currency**: MNT (Real tokens)
- **Gas Price**: Market rate

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Insufficient Funds**
```bash
# Check wallet balance
npx hardhat run scripts/check-balance.ts --network mantle_testnet

# Fund wallet and retry
npm run deploy:testnet
```

#### 2. **RPC Connection Issues**
```bash
# Try alternative RPC
MANTLE_TESTNET_RPC=https://mantle-testnet.public.blastapi.io
```

#### 3. **Contract Verification Failed**
```bash
# Check constructor arguments
npx hardhat run scripts/get-deployment-info.ts --network mantle_testnet

# Manual verification
npx hardhat verify --network mantle_testnet CONTRACT_ADDRESS "ARG1" "ARG2"
```

#### 4. **Frontend Not Loading**
```bash
# Check environment variables
cd frontend
npm run dev

# Verify contract addresses in .env file
echo $VITE_AGENT_REGISTRY_ADDRESS
```

---

## 📊 Post-Deployment Checklist

### Testnet
- [ ] Contracts deployed successfully
- [ ] Frontend connects to testnet
- [ ] Test agent registration works
- [ ] Delegation flow works
- [ ] All UI components load correctly

### Mainnet
- [ ] Security audit completed
- [ ] Contracts verified on Etherscan
- [ ] Frontend deployed to production
- [ ] Monitoring and alerts configured
- [ ] Emergency procedures documented
- [ ] Team training completed

## Usage Examples

### 1. Register an Agent
```solidity
agentRegistry.registerAgent(
  "0xAgentAddress",
  "Alice - Conservative Yield",
  "Low-risk yield farming strategy",
  "QmIPFSHash..."
);
```

### 2. Update Performance Metrics
```solidity
agentRegistry.updateStats(
  agentAddress,
  450,    // totalROI in basis points (4.5%)
  185e16, // sharpeRatio scaled by 1e18
  215,    // maxDrawdown in basis points (2.15%)
  8,      // totalTrades
  5,      // winningTrades
  50000   // averageTradeSize
);
```

### 3. Delegate Capital
```solidity
// Approve tokens first
usdc.approve(delegationAddress, amount);

// Delegate to agent
delegation.delegate(agentAddress, amount);
```

### 4. Withdraw Delegation
```solidity
delegation.withdraw(agentAddress);
// Returns principal + accumulated returns
```

### 5. File Dispute
```solidity
disputeResolver.createDispute(
  agentAddress,
  "QmIPFSHashOfEvidence"
);
```

## Backend Service Usage

### Calculate Metrics
```typescript
import { calculatePerformanceMetrics } from './performanceCalculator';

const metrics = calculatePerformanceMetrics(equityCurve, trades);
console.log(metrics);
// {
//   totalROI: 450,
//   sharpeRatio: 185e18,
//   maxDrawdown: 215,
//   ...
// }
```

### Update Leaderboard
```typescript
import { AgentLeagueBackend } from './index';

const backend = new AgentLeagueBackend();
backend.registerAgent(agentData);
backend.updateLeaderboard();

const top10 = backend.getLeaderboard(10);
console.log(top10);
```

### Sync with Chain
```typescript
// Automatically update smart contracts every minute
backend.startAutoUpdate(60000);

// Or manual sync
await backend.syncWithChain();
```

## 🔒 Security Best Practices

### 🛡️ Contract Security
- ✅ **Reentrancy Protection** - OpenZeppelin ReentrancyGuard
- ✅ **Access Control** - Owner-only sensitive functions
- ✅ **Fee Limits** - Max 5% performance, 0.5% management fees
- ✅ **Input Validation** - All user inputs validated
- ✅ **Emergency Pause** - Contract pause functionality

### 🔐 Private Key Security
```bash
# ❌ NEVER hardcode private keys
# ❌ NEVER commit .env files to git
# ✅ Use hardware wallets (Ledger, Trezor)
# ✅ Use secure key management services
# ✅ Rotate keys regularly
```

### 🌐 Frontend Security
- ✅ **Environment Variables** - Sensitive data never exposed
- ✅ **CORS Protection** - Only allow trusted origins
- ✅ **Rate Limiting** - Prevent API abuse
- ✅ **Input Sanitization** - Prevent XSS attacks

### 📊 Oracle Security
- ⚠️ **Decentralization Needed** - Current oracle is centralized
- 🔮 **Future Enhancement** - Integrate Chainlink oracles
- 📝 **Documentation** - All oracle operations logged

### 🔍 Security Audit Checklist
- [ ] Smart contracts professionally audited
- [ ] Frontend security testing completed
- [ ] Penetration testing performed
- [ ] Bug bounty program established
- [ ] Incident response plan created

---

## 🚨 Emergency Procedures

### If Private Key Compromised
1. **Immediate Action**: Move all funds to new wallet
2. **Revoke Approvals**: Cancel all token approvals
3. **Update Environment**: Replace all compromised keys
4. **Monitor Activity**: Watch for suspicious transactions
5. **Notify Users**: Inform community of breach

### If Contract Vulnerability Found
1. **Pause Contracts**: Emergency pause all operations
2. **User Notification**: Alert users immediately
3. **Deploy Fix**: Deploy patched contract version
4. **Migration Plan**: Help users migrate to new contract
5. **Post-Mortem**: Document and learn from incident

---

## 📞 Support & Resources

### 📚 Documentation
- **[Security Guide](./SECURITY_GUIDE.md)** - Comprehensive security measures
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[API Documentation](./API_DOCS.md)** - Backend API reference

### 🌐 Official Links
- **Mantle Documentation**: https://docs.mantle.xyz
- **Mantle Explorer**: https://explorer.mantle.xyz
- **Testnet Faucet**: https://faucet.testnet.mantle.xyz
- **Hardhat Docs**: https://hardhat.org/docs

### 🛠️ Development Tools
- **Solidity**: https://solidity.readthedocs.io
- **OpenZeppelin**: https://docs.openzeppelin.com
- **Ethers.js**: https://docs.ethers.org
- **React**: https://reactjs.org/docs

### 🐛 Bug Reports & Issues
- **GitHub Issues**: Report bugs and feature requests
- **Discord Community**: Join for community support
- **Security Contact**: security@yourproject.com for security issues

### 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

- **Mantle Network** - For the amazing L2 infrastructure
- **OpenZeppelin** - For secure smart contract libraries
- **Hardhat Team** - For the excellent development framework
- **React Team** - For the powerful frontend library
- **Community** - For all the feedback and support

---

## 📈 Project Status

### ✅ Completed Features
- [x] Smart contract development
- [x] Backend API services
- [x] 3D animated frontend
- [x] Testnet deployment
- [x] Security implementation
- [x] Documentation

### 🚧 In Progress
- [ ] Mainnet deployment preparation
- [ ] Security audit scheduling
- [ ] Performance optimization
- [ ] Additional features development

### 🎯 Future Roadmap
- [ ] Multi-chain deployment
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Governance token implementation
- [ ] Insurance fund integration

---

**⚡ Built with ❤️ for the Mantle Turing Test Hackathon 2026**

## Testing

```bash
# Run hardhat tests
npm run test

# Generate coverage report
npm run test:coverage

# Run specific test file
hardhat test test/AgentRegistry.test.ts
```

## Key Metrics Explained

### Sharpe Ratio
- Measures risk-adjusted returns
- Higher = better risk-adjusted performance
- Formula: (Mean Return - Risk Free Rate) / Std Dev of Returns
- Good: > 1, Excellent: > 2

### Sortino Ratio
- Like Sharpe but only penalizes downside volatility
- Better for strategies with asymmetric returns
- Generally higher than Sharpe ratio

### Calmar Ratio
- Annual Return / Max Drawdown
- Measures return per unit of downside risk
- Better for understanding worst-case scenarios

### Max Drawdown
- Largest peak-to-trough decline during trading period
- Important for understanding worst-case losses
- Helps select risk-tolerant agents

## Future Enhancements

1. **Multi-chain Support**: Deploy on multiple L2s
2. **Advanced Analytics**: Monthly performance reports, stress testing
3. **Tiered Delegation**: Different tiers with different fee structures
4. **Agent Insurance**: Protocol insurance fund
5. **Reputation System**: Non-fungible reputation tokens
6. **Social Trading**: Copy trading between users
7. **Governance Token**: Community voting on fee changes, new agents

## Support & Contribution

For issues, questions, or contributions, please refer to the main Mantle documentation at https://docs.mantle.xyz
