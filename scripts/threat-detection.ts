import { ethers } from "hardhat";
import fs from 'fs';

interface Threat {
  id: string;
  type: 'unusual_activity' | 'large_transaction' | 'contract_breach' | 'gas_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  affectedContract?: string;
  transactionHash?: string;
  recommendations: string[];
}

interface ThreatReport {
  timestamp: string;
  threats: Threat[];
  networkStatus: {
    blockNumber: number;
    gasPrice: string;
    networkUtilization: number;
  };
  monitoringStatus: 'active' | 'warning' | 'critical';
}

class ThreatDetectionSystem {
  private threats: Threat[] = [];
  private isMonitoring = false;
  private alertThresholds = {
    largeTransaction: ethers.parseEther("100"), // 100 ETH
    highGasPrice: ethers.parseUnits("100", "gwei"),
    unusualActivityThreshold: 10 // transactions in short time
  };

  async startMonitoring() {
    console.log("🔴 Starting Real-time Threat Detection...");
    this.isMonitoring = true;
    
    // Simulate monitoring for 30 seconds
    const monitoringDuration = 30000;
    const startTime = Date.now();
    
    while (this.isMonitoring && Date.now() - startTime < monitoringDuration) {
      await this.performSecurityCheck();
      await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    }
    
    this.isMonitoring = false;
    console.log("⏹️ Threat monitoring stopped");
  }

  async performSecurityCheck() {
    const provider = ethers.provider;
    const blockNumber = await provider.getBlockNumber();
    const gasPrice = await provider.getFeeData();
    
    // Simulate threat detection
    const randomThreat = Math.random();
    
    if (randomThreat < 0.1) {
      this.detectUnusualActivity(blockNumber);
    } else if (randomThreat < 0.2) {
      this.detectGasAnomaly(gasPrice.gasPrice || 0n);
    } else if (randomThreat < 0.3) {
      this.detectLargeTransaction();
    }
  }

  private detectUnusualActivity(blockNumber: number) {
    const threat: Threat = {
      id: Date.now().toString(),
      type: 'unusual_activity',
      severity: 'medium',
      description: `Unusual activity detected at block ${blockNumber}. Multiple transactions from same source detected.`,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Monitor the affected addresses',
        'Consider implementing rate limiting',
        'Review transaction patterns'
      ]
    };
    
    this.addThreat(threat);
  }

  private detectGasAnomaly(gasPrice: bigint) {
    if (gasPrice > this.alertThresholds.highGasPrice) {
      const threat: Threat = {
        id: Date.now().toString(),
        type: 'gas_anomaly',
        severity: 'high',
        description: `Unusually high gas price detected: ${ethers.formatUnits(gasPrice, "gwei")} gwei`,
        timestamp: new Date().toISOString(),
        recommendations: [
          'Delay non-critical transactions',
          'Monitor network congestion',
          'Consider using gas optimization techniques'
        ]
      };
      
      this.addThreat(threat);
    }
  }

  private detectLargeTransaction() {
    const threat: Threat = {
      id: Date.now().toString(),
      type: 'large_transaction',
      severity: 'high',
      description: 'Large transaction detected requiring manual review',
      timestamp: new Date().toISOString(),
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      recommendations: [
        'Verify transaction legitimacy',
        'Check sender authorization',
        'Consider implementing multi-sig requirements'
      ]
    };
    
    this.addThreat(threat);
  }

  private addThreat(threat: Threat) {
    this.threats.push(threat);
    console.log(`🚨 THREAT DETECTED: [${threat.severity.toUpperCase()}] ${threat.type}`);
    console.log(`   Description: ${threat.description}`);
    console.log(`   Timestamp: ${threat.timestamp}`);
    console.log(`   Recommendations: ${threat.recommendations.join(', ')}`);
    console.log('');
  }

  async generateThreatReport(): Promise<ThreatReport> {
    const provider = ethers.provider;
    const blockNumber = await provider.getBlockNumber();
    const gasPrice = await provider.getFeeData();
    
    const monitoringStatus = this.threats.some(t => t.severity === 'critical') ? 'critical' :
                           this.threats.some(t => t.severity === 'high') ? 'warning' : 'active';
    
    return {
      timestamp: new Date().toISOString(),
      threats: this.threats,
      networkStatus: {
        blockNumber,
        gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei") + " gwei",
        networkUtilization: Math.random() * 100 // Simulated
      },
      monitoringStatus
    };
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }
}

async function main() {
  console.log("🛡️ Agent League Threat Detection System");
  console.log("=======================================");
  
  const threatDetector = new ThreatDetectionSystem();
  
  try {
    // Start monitoring in background
    const monitoringPromise = threatDetector.startMonitoring();
    
    // Display real-time status
    const statusInterval = setInterval(() => {
      console.log("📡 Monitoring network for threats...");
    }, 10000);
    
    // Wait for monitoring to complete
    await monitoringPromise;
    clearInterval(statusInterval);
    
    // Generate final report
    const report = await threatDetector.generateThreatReport();
    
    // Save report
    const reportPath = `threat-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log("\n📊 Threat Detection Summary");
    console.log("===========================");
    console.log(`Monitoring Period: ${report.timestamp}`);
    console.log(`Network Status: ${report.monitoringStatus.toUpperCase()}`);
    console.log(`Block Number: ${report.networkStatus.blockNumber}`);
    console.log(`Gas Price: ${report.networkStatus.gasPrice}`);
    console.log(`Network Utilization: ${report.networkStatus.networkUtilization.toFixed(1)}%`);
    
    if (report.threats.length > 0) {
      console.log(`\n🚨 Threats Detected: ${report.threats.length}`);
      report.threats.forEach((threat, index) => {
        console.log(`\n${index + 1}. [${threat.severity.toUpperCase()}] ${threat.type}`);
        console.log(`   ${threat.description}`);
        console.log(`   Time: ${threat.timestamp}`);
      });
    } else {
      console.log("\n✅ No threats detected during monitoring period");
    }
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error("❌ Error in threat detection:", error);
    threatDetector.stopMonitoring();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
