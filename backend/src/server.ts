/**
 * Backend API Server
 * Provides REST endpoints for the Agent Performance League frontend
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { AgentLeagueBackend } from './index';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    'https://agent-league.onrender.com',
    'http://localhost:5173',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(bodyParser.json());

// Initialize backend service
const backend = new AgentLeagueBackend();

// Register some demo agents
backend.registerAgent({
  address: '0x1111111111111111111111111111111111111111',
  name: 'Alice - Conservative Yield',
  equityCurve: [100000, 101000, 102050, 101500, 103100, 104500],
  trades: [
    { timestamp: 1, entryPrice: 100, exitPrice: 101, quantity: 100, pnl: 100 },
    { timestamp: 2, entryPrice: 101, exitPrice: 102, quantity: 100, pnl: 100 },
    { timestamp: 3, entryPrice: 102, exitPrice: 101.5, quantity: 100, pnl: -50 },
    { timestamp: 4, entryPrice: 101.5, exitPrice: 103, quantity: 100, pnl: 150 },
    { timestamp: 5, entryPrice: 103, exitPrice: 104.5, quantity: 100, pnl: 150 },
  ],
  totalCapitalManaged: 500000,
});

backend.registerAgent({
  address: '0x2222222222222222222222222222222222222222',
  name: 'Bob - Aggressive Growth',
  equityCurve: [100000, 105000, 108000, 103000, 112000, 115000],
  trades: [
    { timestamp: 1, entryPrice: 100, exitPrice: 105, quantity: 100, pnl: 500 },
    { timestamp: 2, entryPrice: 105, exitPrice: 108, quantity: 100, pnl: 300 },
    { timestamp: 3, entryPrice: 108, exitPrice: 103, quantity: 100, pnl: -500 },
    { timestamp: 4, entryPrice: 103, exitPrice: 112, quantity: 100, pnl: 900 },
    { timestamp: 5, entryPrice: 112, exitPrice: 115, quantity: 100, pnl: 300 },
  ],
  totalCapitalManaged: 750000,
});

backend.registerAgent({
  address: '0x3333333333333333333333333333333333333333',
  name: 'Charlie - Balanced',
  equityCurve: [100000, 102000, 104500, 103200, 106000, 107800],
  trades: [
    { timestamp: 1, entryPrice: 100, exitPrice: 102, quantity: 100, pnl: 200 },
    { timestamp: 2, entryPrice: 102, exitPrice: 104.5, quantity: 100, pnl: 250 },
    { timestamp: 3, entryPrice: 104.5, exitPrice: 103.2, quantity: 100, pnl: -130 },
    { timestamp: 4, entryPrice: 103.2, exitPrice: 106, quantity: 100, pnl: 280 },
    { timestamp: 5, entryPrice: 106, exitPrice: 107.8, quantity: 100, pnl: 180 },
  ],
  totalCapitalManaged: 300000,
});

// Update leaderboard
backend.updateLeaderboard();

// API Routes

/**
 * GET /api/leaderboard
 * Get current leaderboard
 */
app.get('/api/leaderboard', (req, res) => {
  try {
    const topN = req.query.top ? parseInt(req.query.top as string) : undefined;
    const leaderboard = backend.getLeaderboard(topN);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/agent/:address
 * Get detailed agent information
 */
app.get('/api/agent/:address', (req, res) => {
  try {
    const agentDetails = backend.getAgentDetails(req.params.address);
    if (!agentDetails) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agentDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent details' });
  }
});

/**
 * POST /api/agent/:address/update
 * Update agent performance data (for demo purposes)
 */
app.post('/api/agent/:address/update', (req, res) => {
  try {
    const { equityCurve, trades } = req.body;
    backend.updateAgentPerformance(req.params.address, equityCurve, trades);
    backend.updateLeaderboard();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agents: backend.getLeaderboard().length,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Agent League API server running on port ${port}`);
  console.log(`📊 Leaderboard available at http://localhost:${port}/api/leaderboard`);
  console.log(`👤 Agent details at http://localhost:${port}/api/agent/:address`);
});

export default app;