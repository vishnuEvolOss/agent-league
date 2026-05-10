/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_REGISTRY_ADDRESS: string
  readonly VITE_AGENT_DELEGATION_ADDRESS: string
  readonly VITE_DISPUTE_RESOLVER_ADDRESS: string
  readonly VITE_AGENT_PROFILE_NFT_ADDRESS: string
  readonly VITE_MOCK_ERC20_ADDRESS: string
  readonly VITE_STABLECOIN_ADDRESS: string
  readonly VITE_LOCAL_RPC_URL: string
  readonly VITE_TESTNET_RPC_URL: string
  readonly VITE_MAINNET_RPC_URL: string
  readonly VITE_NETWORK_NAME: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
