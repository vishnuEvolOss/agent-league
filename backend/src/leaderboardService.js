"use strict";
/**
 * Leaderboard Service
 * Manages agent ranking and sorting logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCompositeScore = calculateCompositeScore;
exports.sortAgentsByMetric = sortAgentsByMetric;
exports.getTopAgents = getTopAgents;
exports.getAgentTier = getAgentTier;
exports.filterAgents = filterAgents;
/**
 * Calculate composite score for ranking
 * Weights: ROI (40%), Sharpe (30%), Drawdown (20%), Win Rate (10%)
 */
function calculateCompositeScore(metrics) {
    // Normalize values to 0-100 scale
    const roiScore = Math.min(Math.max(metrics.totalROI / 100, 0), 100); // -100% to +100%
    const sharpeScore = Math.min(Math.max((metrics.sharpeRatio / 1e18) * 10, 0), 100); // 0 to 10
    const drawdownPenalty = Math.min(metrics.maxDrawdown / 100, 100); // 0% to 100%
    const winRateScore = metrics.winRate; // 0-100
    const score = roiScore * 0.4 + sharpeScore * 0.3 + (100 - drawdownPenalty) * 0.2 + winRateScore * 0.1;
    return Math.round(score * 100) / 100;
}
/**
 * Sort agents by multiple criteria
 */
function sortAgentsByMetric(agents, sortBy = "score", ascending = false) {
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
function getTopAgents(agents, topN = 10) {
    const sorted = sortAgentsByMetric(agents, "score");
    return sorted.slice(0, topN);
}
/**
 * Calculate agent tier based on performance
 */
function getAgentTier(score) {
    if (score >= 80)
        return "Elite";
    if (score >= 60)
        return "Excellent";
    if (score >= 40)
        return "Good";
    if (score >= 20)
        return "Fair";
    return "New";
}
/**
 * Filter agents by criteria
 */
function filterAgents(agents, criteria) {
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
