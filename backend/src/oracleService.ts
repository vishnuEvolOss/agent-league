/**
 * Oracle Service
 * Communicates with smart contracts to update agent performance
 */

import { ethers, Contract } from "ethers";
import { PerformanceMetrics } from "./performanceCalculator";

export interface ContractConfig {
  agentRegistryAddress: string;
  agentDelegationAddress: string;
  provider: ethers.Provider;
  signer: ethers.Signer;
}

export interface TradeData {
  agentAddress: string;
  pnl: number;
  roi: number;
  tradeCount: number;
}

const AGENT_REGISTRY_ABI = [
  "function updateStats(address _agentAddress, uint256 _totalROI, int256 _sharpeRatio, uint256 _maxDrawdown, uint256 _totalTrades, uint256 _winningTrades, uint256 _averageTradeSize) external",
  "function recordPerformance(address _agentAddress, int256 _pnl, uint256 _tradeCount, uint256 _roi) external",
];

const AGENT_DELEGATION_ABI = [
  "function distributeReturns(address _agentAddress, uint256 _totalReturns) external",
];

export class OracleService {
  private agentRegistry: Contract;
  private agentDelegation: Contract;
  private signer: ethers.Signer;

  constructor(config: ContractConfig) {
    this.signer = config.signer;
    this.agentRegistry = new ethers.Contract(
      config.agentRegistryAddress,
      AGENT_REGISTRY_ABI,
      config.signer
    );
    this.agentDelegation = new ethers.Contract(
      config.agentDelegationAddress,
      AGENT_DELEGATION_ABI,
      config.signer
    );
  }

  /**
   * Update agent performance metrics on-chain
   */
  async updateAgentMetrics(
    agentAddress: string,
    metrics: PerformanceMetrics
  ): Promise<string> {
    try {
      const tx = await this.agentRegistry.updateStats(
        agentAddress,
        metrics.totalROI, // already in basis points
        metrics.sharpeRatio, // already scaled by 1e18
        metrics.maxDrawdown, // already in basis points
        metrics.totalTrades,
        metrics.winningTrades,
        metrics.averageTradeSize
      );

      await tx.wait();
      console.log(`✅ Updated metrics for agent ${agentAddress}`);
      return tx.hash;
    } catch (error) {
      console.error(`❌ Failed to update metrics for ${agentAddress}:`, error);
      throw error;
    }
  }

  /**
   * Record a performance snapshot
   */
  async recordPerformanceSnapshot(
    agentAddress: string,
    tradeData: TradeData
  ): Promise<string> {
    try {
      const tx = await this.agentRegistry.recordPerformance(
        agentAddress,
        tradeData.pnl, // as int256
        tradeData.tradeCount,
        tradeData.roi // in basis points
      );

      await tx.wait();
      console.log(`✅ Recorded performance for agent ${agentAddress}`);
      return tx.hash;
    } catch (error) {
      console.error(`❌ Failed to record performance for ${agentAddress}:`, error);
      throw error;
    }
  }

  /**
   * Distribute returns to delegators
   */
  async distributeReturns(
    agentAddress: string,
    totalReturns: number
  ): Promise<string> {
    try {
      const tx = await this.agentDelegation.distributeReturns(
        agentAddress,
        ethers.parseUnits(totalReturns.toString(), 6) // Assuming 6 decimals (USDC)
      );

      await tx.wait();
      console.log(`✅ Distributed returns for agent ${agentAddress}`);
      return tx.hash;
    } catch (error) {
      console.error(`❌ Failed to distribute returns for ${agentAddress}:`, error);
      throw error;
    }
  }

  /**
   * Batch update multiple agents
   */
  async updateMultipleAgents(
    agentsData: Array<{ address: string; metrics: PerformanceMetrics }>
  ): Promise<string[]> {
    const txHashes: string[] = [];

    for (const agent of agentsData) {
      try {
        const txHash = await this.updateAgentMetrics(agent.address, agent.metrics);
        txHashes.push(txHash);
      } catch (error) {
        console.warn(`Skipping agent ${agent.address} due to error`);
      }
    }

    return txHashes;
  }
}
