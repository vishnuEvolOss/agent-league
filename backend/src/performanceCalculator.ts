/**
 * Performance Calculation Service
 * Calculates Sharpe ratio, max drawdown, ROI, and other metrics for agents
 */

export interface TradeRecord {
  timestamp: number;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number; // profit/loss
}

export interface PerformanceMetrics {
  totalROI: number; // in basis points (10000 = 100%)
  sharpeRatio: number;
  maxDrawdown: number; // in basis points
  totalTrades: number;
  winningTrades: number;
  averageTradeSize: number;
  winRate: number;
  calmarRatio: number;
  sortinoRatio: number;
  profitFactor: number;
}

const RISK_FREE_RATE = 0.02; // 2% annual risk-free rate
const TRADING_DAYS_PER_YEAR = 252;

/**
 * Calculate Total Return on Investment (ROI)
 */
export function calculateROI(
  initialCapital: number,
  finalCapital: number
): number {
  if (initialCapital <= 0) return 0;
  const roi = ((finalCapital - initialCapital) / initialCapital) * 10000; // basis points
  return Math.round(roi);
}

/**
 * Calculate daily returns from equity curve
 */
export function getDailyReturns(equityCurve: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    const dailyReturn = (equityCurve[i] - equityCurve[i - 1]) / equityCurve[i - 1];
    returns.push(dailyReturn);
  }
  return returns;
}

/**
 * Calculate Sharpe Ratio
 * Higher is better (>1 is generally considered good)
 */
export function calculateSharpeRatio(dailyReturns: number[]): number {
  if (dailyReturns.length === 0) return 0;

  // Mean daily return
  const meanReturn =
    dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;

  // Standard deviation of returns
  const variance =
    dailyReturns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
    dailyReturns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Annualize Sharpe ratio
  const excessReturn = meanReturn - RISK_FREE_RATE / TRADING_DAYS_PER_YEAR;
  const sharpeRatio =
    (excessReturn / stdDev) * Math.sqrt(TRADING_DAYS_PER_YEAR);

  return Math.round(sharpeRatio * 1e18); // Scale by 1e18 for solidity
}

/**
 * Calculate Maximum Drawdown
 * Represents the largest peak-to-trough decline
 */
export function calculateMaxDrawdown(equityCurve: number[]): number {
  if (equityCurve.length === 0) return 0;

  let maxDrawdown = 0;
  let peak = equityCurve[0];

  for (const value of equityCurve) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return Math.round(maxDrawdown * 10000); // Convert to basis points
}

/**
 * Calculate Calmar Ratio (annual return / max drawdown)
 */
export function calculateCalmarRatio(
  annualReturn: number,
  maxDrawdown: number
): number {
  if (maxDrawdown === 0) return 0;
  const calmar = (annualReturn / 100) / (maxDrawdown / 10000);
  return Math.round(calmar * 1e18);
}

/**
 * Calculate Sortino Ratio (only penalizes downside volatility)
 */
export function calculateSortinoRatio(dailyReturns: number[]): number {
  if (dailyReturns.length === 0) return 0;

  const meanReturn =
    dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;

  // Downside deviation (only negative returns)
  const downsideReturns = dailyReturns.filter((r) => r < 0);
  if (downsideReturns.length === 0) return 0;

  const downsideVariance =
    downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) /
    dailyReturns.length;
  const downsideStdDev = Math.sqrt(downsideVariance);

  if (downsideStdDev === 0) return 0;

  const excessReturn = meanReturn - RISK_FREE_RATE / TRADING_DAYS_PER_YEAR;
  const sortinoRatio =
    (excessReturn / downsideStdDev) * Math.sqrt(TRADING_DAYS_PER_YEAR);

  return Math.round(sortinoRatio * 1e18);
}

/**
 * Calculate Profit Factor (gross profit / gross loss)
 */
export function calculateProfitFactor(trades: TradeRecord[]): number {
  if (trades.length === 0) return 0;

  let totalProfit = 0;
  let totalLoss = 0;

  for (const trade of trades) {
    if (trade.pnl > 0) {
      totalProfit += trade.pnl;
    } else {
      totalLoss += Math.abs(trade.pnl);
    }
  }

  if (totalLoss === 0) return totalProfit > 0 ? 100 : 0;

  return Math.round((totalProfit / totalLoss) * 10000) / 10000;
}

/**
 * Calculate Win Rate
 */
export function calculateWinRate(trades: TradeRecord[]): number {
  if (trades.length === 0) return 0;
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  return (winningTrades / trades.length) * 100;
}

/**
 * Calculate Average Trade Size
 */
export function calculateAverageTradeSize(trades: TradeRecord[]): number {
  if (trades.length === 0) return 0;
  const totalSize = trades.reduce((sum, t) => sum + Math.abs(t.pnl), 0);
  return Math.round(totalSize / trades.length);
}

/**
 * Comprehensive performance calculation
 */
export function calculatePerformanceMetrics(
  equityCurve: number[],
  trades: TradeRecord[]
): PerformanceMetrics {
  const initialCapital = equityCurve[0] || 0;
  const finalCapital = equityCurve[equityCurve.length - 1] || 0;

  const dailyReturns = getDailyReturns(equityCurve);
  const roi = calculateROI(initialCapital, finalCapital);
  const sharpeRatio = calculateSharpeRatio(dailyReturns);
  const maxDrawdown = calculateMaxDrawdown(equityCurve);
  const sortinoRatio = calculateSortinoRatio(dailyReturns);
  const calmarRatio = calculateCalmarRatio(roi, maxDrawdown);
  const profitFactor = calculateProfitFactor(trades);
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const averageTradeSize = calculateAverageTradeSize(trades);

  return {
    totalROI: roi,
    sharpeRatio,
    maxDrawdown,
    totalTrades: trades.length,
    winningTrades,
    averageTradeSize,
    winRate: calculateWinRate(trades),
    calmarRatio,
    sortinoRatio,
    profitFactor,
  };
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: PerformanceMetrics) {
  return {
    totalROI: `${(metrics.totalROI / 100).toFixed(2)}%`,
    sharpeRatio: (metrics.sharpeRatio / 1e18).toFixed(2),
    maxDrawdown: `${(metrics.maxDrawdown / 100).toFixed(2)}%`,
    totalTrades: metrics.totalTrades,
    winningTrades: metrics.winningTrades,
    winRate: `${metrics.winRate.toFixed(2)}%`,
    averageTradeSize: `$${metrics.averageTradeSize.toLocaleString()}`,
    calmarRatio: (metrics.calmarRatio / 1e18).toFixed(2),
    sortinoRatio: (metrics.sortinoRatio / 1e18).toFixed(2),
    profitFactor: metrics.profitFactor.toFixed(2),
  };
}
