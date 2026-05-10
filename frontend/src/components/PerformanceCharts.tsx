import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PerformanceData {
  agentName: string;
  data: number[];
  labels: string[];
}

const PerformanceCharts: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'returns' | 'winrate' | 'capital'>('returns');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const performanceData: PerformanceData[] = [
    {
      agentName: 'Alice - Conservative',
      data: [12, 15, 14, 16, 18, 17, 19, 21, 20, 22],
      labels: Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`)
    },
    {
      agentName: 'Bob - Aggressive',
      data: [8, 25, 22, 28, 35, 32, 38, 42, 40, 45],
      labels: Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`)
    },
    {
      agentName: 'Charlie - Balanced',
      data: [10, 12, 13, 15, 14, 16, 18, 17, 19, 20],
      labels: Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`)
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedMetric, timeRange]);

  const metrics = [
    { value: 'returns', label: 'Returns (%)', color: 'bg-blue-500' },
    { value: 'winrate', label: 'Win Rate (%)', color: 'bg-green-500' },
    { value: 'capital', label: 'Capital Under Management (MNT)', color: 'bg-purple-500' }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const maxValue = Math.max(...performanceData.flatMap(d => d.data));
    const chartHeight = 250;

    return (
      <div className="relative h-64 bg-gray-50 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{Math.round((maxValue / 4) * (4 - i))}%</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full flex items-end justify-between space-x-2">
          {performanceData.map((agent, agentIndex) => (
            <div key={agent.agentName} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-between space-x-1">
                {agent.data.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`flex-1 ${
                      agentIndex === 0 ? 'bg-blue-400' :
                      agentIndex === 1 ? 'bg-green-400' :
                      'bg-purple-400'
                    } rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer`}
                    title={`${agent.agentName}: ${value}%`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-gray-600">
          {performanceData[0].labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Performance Analytics</h2>
        <p className="text-gray-600">Track agent performance across different metrics and time ranges</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex space-x-2">
          {metrics.map(metric => (
            <button
              key={metric.value}
              onClick={() => setSelectedMetric(metric.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                selectedMetric === metric.value
                  ? `${metric.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                timeRange === range.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {performanceData.map((agent, index) => (
          <div key={agent.agentName} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded ${
              index === 0 ? 'bg-blue-400' :
              index === 1 ? 'bg-green-400' :
              'bg-purple-400'
            }`} />
            <span className="text-sm text-gray-700">{agent.agentName}</span>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceData.map((agent, index) => {
          const latestValue = agent.data[agent.data.length - 1];
          const previousValue = agent.data[agent.data.length - 2];
          const change = ((latestValue - previousValue) / previousValue * 100).toFixed(1);
          
          return (
            <motion.div
              key={agent.agentName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-semibold text-gray-800 mb-1">{agent.agentName}</h3>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900">{latestValue}%</span>
                <span className={`text-sm font-medium ${
                  parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {parseFloat(change) >= 0 ? '+' : ''}{change}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PerformanceCharts;
