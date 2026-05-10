import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { BrowserProvider, Contract, Signer } from 'ethers';

export interface ConnectedAccount {
  address: string;
  chainId: number;
  balance: string;
}

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: Signer | null;
  account: ConnectedAccount | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const MANTLE_TESTNET = {
  chainId: 5003,
  name: 'Mantle Testnet',
  rpcUrl: 'https://rpc.testnet.mantle.xyz',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  blockExplorerUrl: 'https://explorer.testnet.mantle.xyz',
};

const MANTLE_MAINNET = {
  chainId: 5000,
  name: 'Mantle',
  rpcUrl: 'https://rpc.mantle.xyz',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  blockExplorerUrl: 'https://explorer.mantle.xyz',
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [account, setAccount] = useState<ConnectedAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const signer = await provider.getSigner();
      const balance = await provider.getBalance(accounts[0]);
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount({
        address: accounts[0],
        chainId: Number(network.chainId),
        balance: balance.toString(),
      });

      // Switch to Mantle Testnet if not already
      if (Number(network.chainId) !== MANTLE_TESTNET.chainId) {
        await switchNetwork(MANTLE_TESTNET.chainId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setError(null);
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      const network = chainId === 5000 ? MANTLE_MAINNET : MANTLE_TESTNET;

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      if (account) {
        setAccount({ ...account, chainId });
      }
    } catch (err: any) {
      if (err.code === 4902) {
        // Network not added, try to add it
        const network = chainId === 5000 ? MANTLE_MAINNET : MANTLE_TESTNET;
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: [network.blockExplorerUrl],
              },
            ],
          });
        } catch (addErr) {
          setError('Failed to add network');
        }
      }
    }
  }, [account]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        isConnecting,
        error,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
