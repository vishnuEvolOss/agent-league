import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    timestamp: number;
    equity: number;
    roi: number;
  }>;
  title?: string;
}

export function PerformanceChart({ data, title = 'Equity Curve' }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            labelFormatter={(label) => new Date(label * 1000).toLocaleDateString()}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorEquity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ROIChartProps {
  data: Array<{
    timestamp: number;
    roi: number;
  }>;
  title?: string;
}

export function ROIChart({ data, title = 'ROI Over Time' }: ROIChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => `${(value / 100).toFixed(2)}%`}
            labelFormatter={(label) => new Date(label * 1000).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="roi"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="ROI (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
