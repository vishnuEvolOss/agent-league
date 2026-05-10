import React from 'react';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  agentAddress: string;
  totalROI: string;
  sharpeRatio: string;
  maxDrawdown: string;
  winRate: string;
  totalCapitalManaged: number;
  score: number;
  tier: string;
}

interface LeaderboardProps {
  agents: LeaderboardEntry[];
  loading?: boolean;
  onAgentSelect?: (address: string) => void;
  selectedAgent?: string;
}

export function Leaderboard({
  agents,
  loading = false,
  onAgentSelect,
  selectedAgent,
}: LeaderboardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Elite':
        return 'bg-yellow-100 text-yellow-900';
      case 'Excellent':
        return 'bg-blue-100 text-blue-900';
      case 'Good':
        return 'bg-green-100 text-green-900';
      case 'Fair':
        return 'bg-orange-100 text-orange-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Rank</th>
            <th className="px-4 py-3 text-left font-semibold">Agent Name</th>
            <th className="px-4 py-3 text-right font-semibold">Score</th>
            <th className="px-4 py-3 text-right font-semibold">ROI</th>
            <th className="px-4 py-3 text-right font-semibold">Sharpe</th>
            <th className="px-4 py-3 text-right font-semibold">Max DD</th>
            <th className="px-4 py-3 text-right font-semibold">Win Rate</th>
            <th className="px-4 py-3 text-right font-semibold">Capital</th>
            <th className="px-4 py-3 text-center font-semibold">Tier</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr
              key={agent.agentAddress}
              onClick={() => onAgentSelect?.(agent.agentAddress)}
              className={`border-b hover:bg-gray-50 cursor-pointer transition ${
                selectedAgent === agent.agentAddress ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-4 py-3 font-bold text-lg">#{agent.rank}</td>
              <td className="px-4 py-3">
                <div className="font-semibold">{agent.name}</div>
                <div className="text-xs text-gray-500 font-mono">
                  {agent.agentAddress.slice(0, 6)}...{agent.agentAddress.slice(-4)}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold">{agent.score.toFixed(1)}</td>
              <td className="px-4 py-3 text-right">
                <span className={agent.totalROI.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                  {agent.totalROI}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-gray-700">{agent.sharpeRatio}</td>
              <td className="px-4 py-3 text-right text-gray-700">{agent.maxDrawdown}</td>
              <td className="px-4 py-3 text-right text-gray-700">{agent.winRate}</td>
              <td className="px-4 py-3 text-right text-gray-700">
                ${(agent.totalCapitalManaged / 1e6).toFixed(1)}M
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getTierColor(agent.tier)}`}>
                  {agent.tier}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
