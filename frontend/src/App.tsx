import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AgentRegistration from './components/AgentRegistration';
import PerformanceCharts from './components/PerformanceCharts';
import WalletConnect from './components/WalletConnect';
import AnimatedBorder from './components/AnimatedBorder';

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

function App() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'register' | 'analytics'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<Agent[]>([
    {
      agentAddress: '0x1111111111111111111111111111111111111111',
      name: 'Alice - Conservative Yield',
      rank: 1,
      totalROI: '4.50%',
      sharpeRatio: '18.76',
      maxDrawdown: '0.54%',
      totalCapitalManaged: 500000,
      totalTrades: 5,
      winRate: 80,
      score: 59.69,
    },
    {
      agentAddress: '0x2222222222222222222222222222222222222222',
      name: 'Bob - Aggressive Growth',
      rank: 2,
      totalROI: '15.00%',
      sharpeRatio: '10.62',
      maxDrawdown: '4.63%',
      totalCapitalManaged: 750000,
      totalTrades: 5,
      winRate: 80,
      score: 63.07,
    },
    {
      agentAddress: '0x3333333333333333333333333333333333333333',
      name: 'Charlie - Balanced Portfolio',
      rank: 3,
      totalROI: '8.25%',
      sharpeRatio: '14.33',
      maxDrawdown: '2.15%',
      totalCapitalManaged: 600000,
      totalTrades: 7,
      winRate: 75,
      score: 58.12,
    },
    {
      agentAddress: '0x4444444444444444444444444444444444444444',
      name: 'Diana - High Frequency',
      rank: 4,
      totalROI: '12.75%',
      sharpeRatio: '9.87',
      maxDrawdown: '3.89%',
      totalCapitalManaged: 450000,
      totalTrades: 12,
      winRate: 68,
      score: 55.43,
    },
    {
      agentAddress: '0x5555555555555555555555555555555555555555',
      name: 'Eve - Risk Management',
      rank: 5,
      totalROI: '6.80%',
      sharpeRatio: '16.45',
      maxDrawdown: '1.23%',
      totalCapitalManaged: 800000,
      totalTrades: 4,
      winRate: 85,
      score: 56.78,
    },
    {
      agentAddress: '0x6666666666666666666666666666666666666666',
      name: 'Frank - Momentum Trading',
      rank: 6,
      totalROI: '18.90%',
      sharpeRatio: '8.23',
      maxDrawdown: '6.78%',
      totalCapitalManaged: 350000,
      totalTrades: 9,
      winRate: 62,
      score: 52.34,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App mounted, attempting to fetch from backend...');
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/leaderboard', {
          timeout: 3000
        });
        console.log('Backend data:', response.data);
        if (response.data && response.data.length > 0) {
          setLeaderboard(response.data);
        }
      } catch (err) {
        console.log('Backend not available, using mock data');
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-lg border-b border-white/20 shadow-2xl p-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white"
              >
                Agent Performance League
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-200"
              >
                AI Agent Performance Tracking & Capital Delegation
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <WalletConnect />
            </motion.div>
          </div>
        </motion.header>
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <AnimatedBorder 
            glowColor="rainbow" 
            intensity="medium"
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 p-4"
            >
              {[
                { id: 'leaderboard', label: '🏆 Leaderboard', icon: '📊' },
                { id: 'register', label: '🤖 Register Agent', icon: '➕' },
                { id: 'analytics', label: '📈 Analytics', icon: '📉' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>
          </AnimatedBorder>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'leaderboard' && (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold text-white mb-2">🏆 Agent Leaderboard</h2>
                  <p className="text-blue-200">Top performing AI agents ranked by performance metrics</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderboard.map((agent, index) => (
              <AnimatedBorder
                key={agent.agentAddress}
                glowColor={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'green'}
                intensity="medium"
                className="mb-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.02,
                  }}
                  className="p-6"
                >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
                    <p className="text-sm text-gray-500">Rank #{agent.rank}</p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    className="text-2xl font-bold text-green-600"
                  >
                    {agent.totalROI}
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <p className="text-xs text-gray-600">Sharpe Ratio</p>
                    <p className="text-sm font-bold">{agent.sharpeRatio}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <p className="text-xs text-gray-600">Win Rate</p>
                    <p className="text-sm font-bold">{agent.winRate}%</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <p className="text-xs text-gray-600">Max Drawdown</p>
                    <p className="text-sm font-bold">{agent.maxDrawdown}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <p className="text-xs text-gray-600">Capital</p>
                    <p className="text-sm font-bold">${(agent.totalCapitalManaged / 1000).toFixed(0)}K</p>
                  </motion.div>
                </div>
                </motion.div>
              </AnimatedBorder>
            ))}
                </div>
              </div>
            )}

            {activeTab === 'register' && (
              <AnimatedBorder glowColor="purple" intensity="medium">
                <AgentRegistration />
              </AnimatedBorder>
            )}

            {activeTab === 'analytics' && (
              <AnimatedBorder glowColor="green" intensity="medium">
                <PerformanceCharts />
              </AnimatedBorder>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
