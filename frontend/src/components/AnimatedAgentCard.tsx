import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap, Shield } from 'lucide-react';

interface Agent {
  agentAddress: string;
  name: string;
  rank: number;
  totalROI: string;
  sharpeRatio: string;
  maxDrawdown: string;
  totalCapitalManaged: number;
  totalTrades: number;
  winRate: number;
  score: number;
}

interface AnimatedAgentCardProps {
  agent: Agent;
  index: number;
}

export default function AnimatedAgentCard({ agent, index }: AnimatedAgentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-600 to-orange-800';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const roiValue = parseFloat(agent.totalROI);
  const isPositive = roiValue > 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
      className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Rank Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
        className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${getRankGradient(agent.rank)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {getRankEmoji(agent.rank)}
      </motion.div>

      {/* Agent Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{agent.name}</h3>
          <p className="text-sm text-gray-500 font-mono">
            {agent.agentAddress.slice(0, 6)}...{agent.agentAddress.slice(-4)}
          </p>
        </div>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, delay: index * 0.1, repeat: Infinity, repeatDelay: 3 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPositive ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </motion.div>
      </div>

      {/* ROI Display */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
        className={`mb-4 p-3 rounded-xl ${
          isPositive ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-orange-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total ROI</span>
          <span className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {agent.totalROI}
          </span>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(Math.abs(roiValue) / 20, 1) }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
          className={`h-2 rounded-full mt-2 origin-left ${
            isPositive ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg"
        >
          <Target className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-600">Sharpe Ratio</p>
            <p className="text-sm font-bold text-gray-800">{agent.sharpeRatio}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg"
        >
          <Shield className="w-4 h-4 text-purple-600" />
          <div>
            <p className="text-xs text-gray-600">Max Drawdown</p>
            <p className="text-sm font-bold text-gray-800">{agent.maxDrawdown}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg"
        >
          <Zap className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-600">Win Rate</p>
            <p className="text-sm font-bold text-gray-800">{agent.winRate}%</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.6 }}
          className="flex items-center space-x-2 p-2 bg-amber-50 rounded-lg"
        >
          <DollarSign className="w-4 h-4 text-amber-600" />
          <div>
            <p className="text-xs text-gray-600">Capital</p>
            <p className="text-sm font-bold text-gray-800">
              ${(agent.totalCapitalManaged / 1000).toFixed(0)}K
            </p>
          </div>
        </motion.div>
      </div>

      {/* Score Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.7 }}
        className="mt-4"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">Performance Score</span>
          <span className="text-xs font-bold text-gray-800">{agent.score.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(agent.score / 100) * 100}%` }}
            transition={{ delay: index * 0.1 + 0.8, duration: 0.8 }}
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
          />
        </div>
      </motion.div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}
