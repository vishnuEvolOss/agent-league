// Secure contract configuration
export const NETWORK_CONFIG = {
  development: {
    chainId: 31337,
    name: 'localhost',
    rpcUrl: import.meta.env.VITE_LOCAL_RPC_URL ?? 'http://127.0.0.1:8545',
    contracts: {
      agentRegistry: import.meta.env.VITE_AGENT_REGISTRY_ADDRESS ?? '',
      agentDelegation: import.meta.env.VITE_AGENT_DELEGATION_ADDRESS ?? '',
      disputeResolver: import.meta.env.VITE_DISPUTE_RESOLVER_ADDRESS ?? '',
      agentProfileNFT: import.meta.env.VITE_AGENT_PROFILE_NFT_ADDRESS ?? '',
      mockERC20: import.meta.env.VITE_MOCK_ERC20_ADDRESS ?? '',
    },
    explorerUrl: 'http://localhost:8545',
  },
  
  testnet: {
    chainId: 5003,
    name: 'mantle_testnet',
    rpcUrl: import.meta.env.VITE_TESTNET_RPC_URL ?? 'https://rpc.testnet.mantle.xyz',
    contracts: {
      agentRegistry: import.meta.env.VITE_AGENT_REGISTRY_ADDRESS ?? '',
      agentDelegation: import.meta.env.VITE_AGENT_DELEGATION_ADDRESS ?? '',
      disputeResolver: import.meta.env.VITE_DISPUTE_RESOLVER_ADDRESS ?? '',
      agentProfileNFT: import.meta.env.VITE_AGENT_PROFILE_NFT_ADDRESS ?? '',
      mockERC20: import.meta.env.VITE_MOCK_ERC20_ADDRESS ?? '',
    },
    explorerUrl: 'https://explorer.testnet.mantle.xyz',
  },
  
  mainnet: {
    chainId: 5000,
    name: 'mantle_mainnet',
    rpcUrl: import.meta.env.VITE_MAINNET_RPC_URL ?? 'https://rpc.mantle.xyz',
    contracts: {
      agentRegistry: import.meta.env.VITE_AGENT_REGISTRY_ADDRESS ?? '',
      agentDelegation: import.meta.env.VITE_AGENT_DELEGATION_ADDRESS ?? '',
      disputeResolver: import.meta.env.VITE_DISPUTE_RESOLVER_ADDRESS ?? '',
      agentProfileNFT: import.meta.env.VITE_AGENT_PROFILE_NFT_ADDRESS ?? '',
      stablecoin: import.meta.env.VITE_STABLECOIN_ADDRESS ?? '',
    },
    explorerUrl: 'https://explorer.mantle.xyz',
  },
};

export const getCurrentNetwork = () => {
  const mode = import.meta.env.MODE;
  
  switch (mode) {
    case 'development':
      return NETWORK_CONFIG.development;
    case 'testnet':
      return NETWORK_CONFIG.testnet;
    case 'production':
      return NETWORK_CONFIG.mainnet;
    default:
      return NETWORK_CONFIG.development;
  }
};

export const validateContracts = () => {
  const network = getCurrentNetwork();
  const missingContracts = Object.entries(network.contracts)
    .filter(([_, address]) => !address)
    .map(([name]) => name);
  
  if (missingContracts.length > 0) {
    console.warn(`Missing contract addresses: ${missingContracts.join(', ')}`);
    return false;
  }
  
  return true;
};

// Security: Validate environment variables
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_AGENT_REGISTRY_ADDRESS',
    'VITE_AGENT_DELEGATION_ADDRESS',
  ];
  
  const missing = requiredVars.filter(varName => {
    const value = import.meta.env[varName as keyof ImportMetaEnv];
    return !value || value.trim() === '';
  });
  
  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};
