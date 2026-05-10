import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, subValue, trend, icon }: MetricCardProps) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }[trend || 'neutral'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}

interface MetricsGridProps {
  metrics: MetricCardProps[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
}

interface AgentProfileCardProps {
  name: string;
  tier: string;
  address: string;
  roi: string;
  score: number;
  onDelegate?: () => void;
}

export function AgentProfileCard({
  name,
  tier,
  address,
  roi,
  score,
  onDelegate,
}: AgentProfileCardProps) {
  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'Elite':
        return 'from-yellow-400 to-yellow-600';
      case 'Excellent':
        return 'from-blue-400 to-blue-600';
      case 'Good':
        return 'from-green-400 to-green-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getTierGradient(tier)} rounded-lg p-6 text-white shadow-lg`}>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm font-mono opacity-90">{address.slice(0, 6)}...{address.slice(-4)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm opacity-80">ROI</p>
          <p className="text-2xl font-bold">{roi}</p>
        </div>
        <div>
          <p className="text-sm opacity-80">Score</p>
          <p className="text-2xl font-bold">{score.toFixed(1)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
        <span className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm font-semibold">
          {tier}
        </span>
        {onDelegate && (
          <button
            onClick={onDelegate}
            className="px-4 py-2 bg-white text-gray-900 rounded font-semibold hover:bg-gray-50 transition"
          >
            Delegate
          </button>
        )}
      </div>
    </div>
  );
}
