/**
 * Leaderboard Service
 * Manages agent ranking and sorting logic
 */

import { PerformanceMetrics } from "./performanceCalculator";

export interface AgentLeaderboardEntry {
  agentAddress: string;
  name: string;
  rank: number;
  totalROI: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalCapitalManaged: number;
  totalTrades: number;
  winRate: number;
  score: number; // Composite score
  lastUpdated: number;
}

/**
 * Calculate composite score for ranking
 * Weights: ROI (40%), Sharpe (30%), Drawdown (20%), Win Rate (10%)
 */
export function calculateCompositeScore(metrics: PerformanceMetrics): number {
  // Normalize values to 0-100 scale
  const roiScore = Math.min(Math.max(metrics.totalROI / 100, 0), 100); // -100% to +100%
  const sharpeScore = Math.min(Math.max((metrics.sharpeRatio / 1e18) * 10, 0), 100); // 0 to 10
  const drawdownPenalty = Math.min(metrics.maxDrawdown / 100, 100); // 0% to 100%
  const winRateScore = metrics.winRate; // 0-100

  const score =
    roiScore * 0.4 + sharpeScore * 0.3 + (100 - drawdownPenalty) * 0.2 + winRateScore * 0.1;

  return Math.round(score * 100) / 100;
}

/**
 * Sort agents by multiple criteria
 */
export function sortAgentsByMetric(
  agents: AgentLeaderboardEntry[],
  sortBy: "roi" | "sharpe" | "score" | "capital" = "score",
  ascending: boolean = false
): AgentLeaderboardEntry[] {
  const sorted = [...agents];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "roi":
        comparison = a.totalROI - b.totalROI;
        break;
      case "sharpe":
        comparison = a.sharpeRatio - b.sharpeRatio;
        break;
      case "score":
        comparison = a.score - b.score;
        break;
      case "capital":
        comparison = a.totalCapitalManaged - b.totalCapitalManaged;
        break;
    }

    return ascending ? comparison : -comparison;
  });

  // Assign ranks
  return sorted.map((agent, index) => ({
    ...agent,
    rank: index + 1,
  }));
}

/**
 * Get agents in top N positions
 */
export function getTopAgents(
  agents: AgentLeaderboardEntry[],
  topN: number = 10
): AgentLeaderboardEntry[] {
  const sorted = sortAgentsByMetric(agents, "score");
  return sorted.slice(0, topN);
}

/**
 * Calculate agent tier based on performance
 */
export function getAgentTier(score: number): "Elite" | "Excellent" | "Good" | "Fair" | "New" {
  if (score >= 80) return "Elite";
  if (score >= 60) return "Excellent";
  if (score >= 40) return "Good";
  if (score >= 20) return "Fair";
  return "New";
}

/**
 * Filter agents by criteria
 */
export function filterAgents(
  agents: AgentLeaderboardEntry[],
  criteria: {
    minROI?: number;
    minSharpe?: number;
    maxDrawdown?: number;
    minCapital?: number;
  }
): AgentLeaderboardEntry[] {
  return agents.filter((agent) => {
    if (criteria.minROI !== undefined && agent.totalROI < criteria.minROI) {
      return false;
    }
    if (criteria.minSharpe !== undefined && agent.sharpeRatio < criteria.minSharpe) {
      return false;
    }
    if (criteria.maxDrawdown !== undefined && agent.maxDrawdown > criteria.maxDrawdown) {
      return false;
    }
    if (criteria.minCapital !== undefined && agent.totalCapitalManaged < criteria.minCapital) {
      return false;
    }
    return true;
  });
}
