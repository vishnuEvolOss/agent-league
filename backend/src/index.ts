/**
 * Main Backend Service
 * Orchestrates performance calculation, leaderboard updates, and oracle communication
 */

import * as dotenv from "dotenv";
import {
  calculatePerformanceMetrics,
  formatMetrics,
  TradeRecord,
  PerformanceMetrics,
} from "./performanceCalculator";
import {
  calculateCompositeScore,
  sortAgentsByMetric,
  getTopAgents,
  AgentLeaderboardEntry,
} from "./leaderboardService";
import { OracleService, ContractConfig } from "./oracleService";

dotenv.config();

export interface AgentData {
  address: string;
  name: string;
  equityCurve: number[];
  trades: TradeRecord[];
  totalCapitalManaged: number;
}

export class AgentLeagueBackend {
  private oracleService: OracleService | null = null;
  private agents: Map<string, AgentData> = new Map();
  private leaderboard: AgentLeaderboardEntry[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeOracleService();
  }

  /**
   * Initialize connection to smart contracts
   */
  private initializeOracleService() {
    try {
      const config = this.getContractConfig();
      if (config) {
        this.oracleService = new OracleService(config);
        console.log("✅ Oracle service initialized");
      } else {
        console.warn("⚠️  Oracle service not configured");
      }
    } catch (error) {
      console.warn("⚠️  Failed to initialize oracle service:", error);
    }
  }

  /**
   * Get contract configuration from environment
   */
  private getContractConfig(): ContractConfig | null {
    const rpcUrl = process.env.MANTLE_RPC_URL;
    const registryAddress = process.env.AGENT_REGISTRY_ADDRESS;
    const delegationAddress = process.env.AGENT_DELEGATION_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !registryAddress || !delegationAddress || !privateKey) {
      return null;
    }

    // In a real implementation, would initialize ethers here
    return {
      agentRegistryAddress: registryAddress,
      agentDelegationAddress: delegationAddress,
      provider: null as any, // Would be: new ethers.JsonRpcProvider(rpcUrl)
      signer: null as any, // Would be: new ethers.Wallet(privateKey, provider)
    };
  }

  /**
   * Register a new agent
   */
  registerAgent(agentData: AgentData) {
    this.agents.set(agentData.address, agentData);
    console.log(`✅ Registered agent: ${agentData.name}`);
  }

  /**
   * Update agent's equity curve and trades
   */
  updateAgentPerformance(
    agentAddress: string,
    equityCurve: number[],
    trades: TradeRecord[]
  ) {
    const agent = this.agents.get(agentAddress);
    if (!agent) {
      console.warn(`Agent ${agentAddress} not found`);
      return;
    }

    agent.equityCurve = equityCurve;
    agent.trades = trades;
    console.log(`Updated performance for ${agent.name}`);
  }

  /**
   * Calculate all metrics for an agent
   */
  private calculateAgentMetrics(agentAddress: string): PerformanceMetrics | null {
    const agent = this.agents.get(agentAddress);
    if (!agent || agent.equityCurve.length === 0) {
      return null;
    }

    return calculatePerformanceMetrics(agent.equityCurve, agent.trades || []);
  }

  /**
   * Update leaderboard
   */
  updateLeaderboard() {
    const leaderboardEntries: AgentLeaderboardEntry[] = [];

    for (const [address, agent] of this.agents) {
      const metrics = this.calculateAgentMetrics(address);
      if (metrics) {
        const score = calculateCompositeScore(metrics);
        leaderboardEntries.push({
          agentAddress: address,
          name: agent.name,
          rank: 0, // Will be set by sortAgentsByMetric
          totalROI: metrics.totalROI,
          sharpeRatio: metrics.sharpeRatio,
          maxDrawdown: metrics.maxDrawdown,
          totalCapitalManaged: agent.totalCapitalManaged,
          totalTrades: metrics.totalTrades,
          winRate: metrics.winRate,
          score,
          lastUpdated: Date.now(),
        });
      }
    }

    this.leaderboard = sortAgentsByMetric(leaderboardEntries, "score");
    console.log(`✅ Updated leaderboard with ${this.leaderboard.length} agents`);
  }

  /**
   * Get current leaderboard
   */
  getLeaderboard(topN?: number): AgentLeaderboardEntry[] {
    if (topN) {
      return getTopAgents(this.leaderboard, topN);
    }
    return this.leaderboard;
  }

  /**
   * Get agent details
   */
  getAgentDetails(agentAddress: string) {
    const agent = this.agents.get(agentAddress);
    if (!agent) return null;

    const metrics = this.calculateAgentMetrics(agentAddress);
    const leaderboardEntry = this.leaderboard.find((a) => a.agentAddress === agentAddress);

    return {
      agent,
      metrics: metrics ? formatMetrics(metrics) : null,
      leaderboardEntry,
      formattedMetrics: metrics,
    };
  }

  /**
   * Sync with smart contracts
   */
  async syncWithChain() {
    if (!this.oracleService) {
      console.warn("⚠️  Oracle service not available");
      return;
    }

    this.updateLeaderboard();

    const agentsToSync = [];
    for (const [address, agent] of this.agents) {
      const metrics = this.calculateAgentMetrics(address);
      if (metrics) {
        agentsToSync.push({ address, metrics });
      }
    }

    try {
      const txHashes = await this.oracleService.updateMultipleAgents(agentsToSync);
      console.log(`✅ Synced ${txHashes.length} agents to chain`);
    } catch (error) {
      console.error("❌ Failed to sync with chain:", error);
    }
  }

  /**
   * Start automatic updates
   */
  startAutoUpdate(intervalMs: number = 60000) {
    this.updateInterval = setInterval(() => {
      this.syncWithChain();
    }, intervalMs);
    console.log(`✅ Started auto-update every ${intervalMs}ms`);
  }

  /**
   * Stop automatic updates
   */
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log("⏹️  Stopped auto-update");
    }
  }

  /**
   * Export leaderboard as JSON
   */
  exportLeaderboard(): string {
    return JSON.stringify(
      this.leaderboard.map((entry) => ({
        ...entry,
        totalROI: `${(entry.totalROI / 100).toFixed(2)}%`,
        sharpeRatio: (entry.sharpeRatio / 1e18).toFixed(2),
        maxDrawdown: `${(entry.maxDrawdown / 100).toFixed(2)}%`,
      })),
      null,
      2
    );
  }
}

// Demo usage
if (require.main === module) {
  const backend = new AgentLeagueBackend();

  // Register sample agents
  const agentAlice: AgentData = {
    address: "0x" + "1".repeat(40),
    name: "Alice - Conservative Yield",
    equityCurve: [100000, 101000, 102050, 101500, 103100, 104500],
    trades: [
      { timestamp: 1, entryPrice: 100, exitPrice: 101, quantity: 100, pnl: 100 },
      { timestamp: 2, entryPrice: 101, exitPrice: 102, quantity: 100, pnl: 100 },
      { timestamp: 3, entryPrice: 102, exitPrice: 101.5, quantity: 100, pnl: -50 },
      { timestamp: 4, entryPrice: 101.5, exitPrice: 103, quantity: 100, pnl: 150 },
      { timestamp: 5, entryPrice: 103, exitPrice: 104.5, quantity: 100, pnl: 150 },
    ],
    totalCapitalManaged: 500000,
  };

  const agentBob: AgentData = {
    address: "0x" + "2".repeat(40),
    name: "Bob - Aggressive Growth",
    equityCurve: [100000, 105000, 108000, 103000, 112000, 115000],
    trades: [
      { timestamp: 1, entryPrice: 100, exitPrice: 105, quantity: 100, pnl: 500 },
      { timestamp: 2, entryPrice: 105, exitPrice: 108, quantity: 100, pnl: 300 },
      { timestamp: 3, entryPrice: 108, exitPrice: 103, quantity: 100, pnl: -500 },
      { timestamp: 4, entryPrice: 103, exitPrice: 112, quantity: 100, pnl: 900 },
      { timestamp: 5, entryPrice: 112, exitPrice: 115, quantity: 100, pnl: 300 },
    ],
    totalCapitalManaged: 750000,
  };

  backend.registerAgent(agentAlice);
  backend.registerAgent(agentBob);

  backend.updateLeaderboard();
  console.log("\n📊 Leaderboard:");
  console.log(backend.exportLeaderboard());

  console.log("\n👤 Agent Alice Details:");
  console.log(JSON.stringify(backend.getAgentDetails(agentAlice.address), null, 2));
}

export default AgentLeagueBackend;
