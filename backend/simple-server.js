/**
 * Simple Production Server for Render
 * Agent League Backend API
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// CORS configuration
app.use(cors({
  origin: [
    'https://agent-league.onrender.com',
    'http://localhost:5173',
    'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json());

// Mock agent data
const agents = [
  {
    address: '0x1111111111111111111111111111111111111111',
    name: 'Alice - Conservative Yield',
    description: 'Low-risk yield farming strategy focused on stable returns',
    metrics: {
      roi: 4.5,
      sharpeRatio: 1.85,
      winRate: 80,
      maxDrawdown: 2.15,
      totalTrades: 8,
      winningTrades: 6,
      averageTradeSize: 50000
    },
    rank: 2,
    capital: 500000
  },
  {
    address: '0x2222222222222222222222222222222222222222',
    name: 'Bob - Aggressive Growth',
    description: 'High-risk, high-reward perpetual trading strategy',
    metrics: {
      roi: 15.0,
      sharpeRatio: 2.12,
      winRate: 80,
      maxDrawdown: 8.5,
      totalTrades: 12,
      winningTrades: 10,
      averageTradeSize: 75000
    },
    rank: 1,
    capital: 750000
  },
  {
    address: '0x3333333333333333333333333333333333333333',
    name: 'Charlie - Balanced',
    description: 'Balanced approach combining yield farming and trading',
    metrics: {
      roi: 8.25,
      sharpeRatio: 1.45,
      winRate: 80,
      maxDrawdown: 5.0,
      totalTrades: 15,
      winningTrades: 12,
      averageTradeSize: 30000
    },
    rank: 3,
    capital: 300000
  }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    network: 'sepolia',
    agents: agents.length,
    contracts: {
      agentRegistry: process.env.AGENT_REGISTRY_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      agentDelegation: process.env.AGENT_DELEGATION_ADDRESS || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      disputeResolver: process.env.DISPUTE_RESOLVER_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      agentProfileNFT: process.env.AGENT_PROFILE_NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      stablecoin: process.env.STABLECOIN_ADDRESS || '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
    }
  });
});

app.get('/api/leaderboard', (req, res) => {
  try {
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/agent/:address', (req, res) => {
  try {
    const agent = agents.find(a => a.address.toLowerCase() === req.params.address.toLowerCase());
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent details' });
  }
});

app.post('/api/agent/register', (req, res) => {
  try {
    const { name, description, strategy, riskLevel, expectedReturns } = req.body;
    
    const newAgent = {
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      name: name || 'New Agent',
      description: description || 'Agent description',
      metrics: {
        roi: expectedReturns || 5.0,
        sharpeRatio: 1.5,
        winRate: 75,
        maxDrawdown: riskLevel === 'low' ? 2.0 : riskLevel === 'medium' ? 5.0 : 10.0,
        totalTrades: 0,
        winningTrades: 0,
        averageTradeSize: 50000
      },
      rank: agents.length + 1,
      capital: 100000
    };
    
    agents.push(newAgent);
    
    res.json({ 
      success: true, 
      message: 'Agent registered successfully',
      agent: newAgent
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Agent League API running on port ${port}`);
  console.log(`🌐 Live at: https://agent-league-backend.onrender.com`);
});

module.exports = app;
