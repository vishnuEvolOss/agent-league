# 🔐 Security Guide for Agent League

## 🚨 CRITICAL SECURITY ISSUES

### Current Vulnerabilities:
1. **Hardcoded test private key** - This is a well-known Hardhat test key
2. **Mock contract addresses** exposed in frontend
3. **No environment separation** between dev/prod
4. **Sensitive data in version control**

---

## 🛡️ IMMEDIATE SECURITY ACTIONS

### 1. Update .gitignore
```gitignore
# Environment Variables
.env
.env.local
.env.development
.env.production
.env.test

# Private keys and sensitive data
*.pem
*.key
private-keys.txt

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*
```

### 2. Environment Separation

#### `.env.development` (Dev Team)
```bash
# Development Network
NODE_ENV=development
PRIVATE_KEY=0xYOUR_DEV_PRIVATE_KEY
MANTLE_TESTNET_RPC=https://rpc.testnet.mantle.xyz

# Dev Contract Addresses (after deployment)
AGENT_REGISTRY_ADDRESS=0x...
AGENT_DELEGATION_ADDRESS=0x...

# Backend Dev
PORT=3001
BACKEND_URL=http://localhost:3001
```

#### `.env.production` (Production Only)
```bash
# Production Network
NODE_ENV=production
PRIVATE_KEY=0xYOUR_MAINNET_PRIVATE_KEY
MANTLE_MAINNET_RPC=https://rpc.mantle.xyz

# Production Contract Addresses
AGENT_REGISTRY_ADDRESS=0x...
AGENT_DELEGATION_ADDRESS=0x...

# Production Backend
PORT=3001
BACKEND_URL=https://your-api-domain.com
```

### 3. Frontend Security

#### Create `src/config/contracts.ts`
```typescript
export const CONTRACTS = {
  // Development
  development: {
    AGENT_REGISTRY: import.meta.env.VITE_AGENT_REGISTRY_ADDRESS,
    AGENT_DELEGATION: import.meta.env.VITE_AGENT_DELEGATION_ADDRESS,
    RPC_URL: import.meta.env.VITE_LOCAL_RPC_URL,
  },
  
  // Production
  production: {
    AGENT_REGISTRY: import.meta.env.VITE_AGENT_REGISTRY_ADDRESS,
    AGENT_DELEGATION: import.meta.env.VITE_AGENT_DELEGATION_ADDRESS,
    RPC_URL: import.meta.env.VITE_MAINNET_RPC_URL,
  }
};

export const getContracts = () => {
  const env = import.meta.env.MODE;
  return CONTRACTS[env as keyof typeof CONTRACTS] || CONTRACTS.development;
};
```

---

## 🔧 PRODUCTION SECURITY MEASURES

### 1. Private Key Management
```bash
# NEVER hardcode private keys
# Use hardware wallets for production
# Consider using AWS KMS or similar services

# For deployment scripts, use:
PRIVATE_KEY=$(aws secretsmanager get-secret-value --secret-id prod-private-key --query SecretString --output text)
```

### 2. Environment Variables in Production

#### Backend (.env.production)
```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Blockchain
PRIVATE_KEY=0xYOUR_MAINNET_PRIVATE_KEY
MANTLE_MAINNET_RPC=https://rpc.mantle.xyz
ETHERSCAN_API_KEY=your_production_api_key

# Security
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=error
```

#### Frontend (.env.production)
```bash
# Only expose necessary variables
VITE_AGENT_REGISTRY_ADDRESS=0xYOUR_PROD_CONTRACT_ADDRESS
VITE_AGENT_DELEGATION_ADDRESS=0xYOUR_PROD_CONTRACT_ADDRESS
VITE_MAINNET_RPC_URL=https://rpc.mantle.xyz
VITE_NETWORK_NAME=mainnet
```

### 3. Smart Contract Security

#### Contract Verification
```bash
# Always verify contracts on Etherscan
npx hardhat verify --network mantle_mainnet CONTRACT_ADDRESS "Constructor Arg 1" "Constructor Arg 2"
```

#### Access Control
```solidity
// Only owner can deploy
constructor() Ownable() {
    // Your constructor logic
}

// Role-based access
modifier onlyAgentOwner(address agentAddress) {
    require(agentRegistry.isAgentOwner(msg.sender, agentAddress), "Not agent owner");
    _;
}
```

---

## 🌐 Production Behavior vs Development

### Development Environment
- ✅ Uses Hardhat local network
- ✅ Mock contract addresses
- ✅ Test private key (well-known)
- ✅ Local backend (localhost:3001)
- ✅ Hot reload enabled
- ⚠️ Not secure for real funds

### Production Environment
- 🔒 Uses Mantle mainnet
- 🔒 Real deployed contracts
- 🔒 Secure private keys
- 🔒 Production backend
- 🔒 Optimized builds
- ✅ Real funds at stake

---

## 🚀 Deployment Security Checklist

### Pre-Deployment Checklist:
- [ ] Remove all test private keys
- [ ] Update contract addresses
- [ ] Set NODE_ENV=production
- [ ] Verify all contracts on Etherscan
- [ ] Test with small amounts first
- [ ] Enable monitoring and alerts
- [ ] Set up rate limiting
- [ ] Configure CORS properly

### Post-Deployment Checklist:
- [ ] Monitor contract interactions
- [ ] Set up error tracking (Sentry)
- [ ] Implement logging
- [ ] Create backup procedures
- [ ] Document emergency procedures

---

## 🔍 Security Best Practices

### 1. Never expose sensitive data in frontend
```typescript
// ❌ BAD
const privateKey = "0x123..."; // Exposed in browser

// ✅ GOOD
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Safe
```

### 2. Use environment-specific configurations
```typescript
// ✅ GOOD
const config = {
  development: { apiUrl: 'http://localhost:3001' },
  production: { apiUrl: 'https://api.yourapp.com' }
};
```

### 3. Implement proper error handling
```typescript
// ✅ GOOD
try {
  await contract.connect(signer).delegate(agent, amount);
} catch (error) {
  console.error('Transaction failed:', error);
  // Show user-friendly message
}
```

### 4. Use hardware wallets for production
- Ledger or Trezor for mainnet operations
- Multi-signature wallets for team operations
- Never store private keys on servers

---

## 📞 Emergency Procedures

### If Private Key is Compromised:
1. Immediately move all funds to a new wallet
2. Revoke all approvals
3. Update environment variables
4. Rotate all API keys
5. Monitor for suspicious activity

### If Contract is Vulnerable:
1. Pause contract operations
2. Notify users immediately
3. Deploy patched version
4. Migrate users to new contract
5. Conduct security audit

---

## 🛠️ Tools for Security

### Recommended Tools:
- **Hardhat Security Plugin**: `npm install --save-dev hardhat-security`
- **Slither**: Static analysis for smart contracts
- **MythX**: Smart contract security analysis
- **Sentry**: Error tracking and monitoring
- **Forta**: Real-time threat detection

### Security Commands:
```bash
# Run security analysis
npx hardhat security

# Check for vulnerabilities
npm audit

# Analyze smart contracts
slither contracts/
```

---

## 📚 Additional Resources

- [OpenZeppelin Security Guidelines](https://docs.openzeppelin.com/contracts/4.x/security)
- [ConsenSys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Ethereum Smart Contract Security](https://ethereum.org/en/developers/docs/smart-contracts/security/)
