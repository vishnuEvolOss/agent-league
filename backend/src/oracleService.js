"use strict";
/**
 * Oracle Service
 * Communicates with smart contracts to update agent performance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleService = void 0;
const ethers_1 = require("ethers");
const AGENT_REGISTRY_ABI = [
    "function updateStats(address _agentAddress, uint256 _totalROI, int256 _sharpeRatio, uint256 _maxDrawdown, uint256 _totalTrades, uint256 _winningTrades, uint256 _averageTradeSize) external",
    "function recordPerformance(address _agentAddress, int256 _pnl, uint256 _tradeCount, uint256 _roi) external",
];
const AGENT_DELEGATION_ABI = [
    "function distributeReturns(address _agentAddress, uint256 _totalReturns) external",
];
class OracleService {
    constructor(config) {
        this.signer = config.signer;
        this.agentRegistry = new ethers_1.ethers.Contract(config.agentRegistryAddress, AGENT_REGISTRY_ABI, config.signer);
        this.agentDelegation = new ethers_1.ethers.Contract(config.agentDelegationAddress, AGENT_DELEGATION_ABI, config.signer);
    }
    /**
     * Update agent performance metrics on-chain
     */
    async updateAgentMetrics(agentAddress, metrics) {
        try {
            const tx = await this.agentRegistry.updateStats(agentAddress, metrics.totalROI, // already in basis points
            metrics.sharpeRatio, // already scaled by 1e18
            metrics.maxDrawdown, // already in basis points
            metrics.totalTrades, metrics.winningTrades, metrics.averageTradeSize);
            await tx.wait();
            console.log(`✅ Updated metrics for agent ${agentAddress}`);
            return tx.hash;
        }
        catch (error) {
            console.error(`❌ Failed to update metrics for ${agentAddress}:`, error);
            throw error;
        }
    }
    /**
     * Record a performance snapshot
     */
    async recordPerformanceSnapshot(agentAddress, tradeData) {
        try {
            const tx = await this.agentRegistry.recordPerformance(agentAddress, tradeData.pnl, // as int256
            tradeData.tradeCount, tradeData.roi // in basis points
            );
            await tx.wait();
            console.log(`✅ Recorded performance for agent ${agentAddress}`);
            return tx.hash;
        }
        catch (error) {
            console.error(`❌ Failed to record performance for ${agentAddress}:`, error);
            throw error;
        }
    }
    /**
     * Distribute returns to delegators
     */
    async distributeReturns(agentAddress, totalReturns) {
        try {
            const tx = await this.agentDelegation.distributeReturns(agentAddress, ethers_1.ethers.parseUnits(totalReturns.toString(), 6) // Assuming 6 decimals (USDC)
            );
            await tx.wait();
            console.log(`✅ Distributed returns for agent ${agentAddress}`);
            return tx.hash;
        }
        catch (error) {
            console.error(`❌ Failed to distribute returns for ${agentAddress}:`, error);
            throw error;
        }
    }
    /**
     * Batch update multiple agents
     */
    async updateMultipleAgents(agentsData) {
        const txHashes = [];
        for (const agent of agentsData) {
            try {
                const txHash = await this.updateAgentMetrics(agent.address, agent.metrics);
                txHashes.push(txHash);
            }
            catch (error) {
                console.warn(`Skipping agent ${agent.address} due to error`);
            }
        }
        return txHashes;
    }
}
exports.OracleService = OracleService;
