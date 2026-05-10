import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedBorder from './AnimatedBorder';

interface SecurityMetric {
  id: string;
  name: string;
  status: 'secure' | 'warning' | 'critical';
  value: string;
  description: string;
  lastChecked: string;
}

const SecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    {
      id: '1',
      name: 'Smart Contract Security',
      status: 'secure',
      value: '100%',
      description: 'All contracts audited and verified',
      lastChecked: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Private Key Protection',
      status: 'warning',
      value: 'Protected',
      description: 'Keys stored securely, never exposed',
      lastChecked: '1 minute ago'
    },
    {
      id: '3',
      name: 'Network Security',
      status: 'secure',
      value: 'Active',
      description: 'HTTPS enabled, SSL certificates valid',
      lastChecked: '30 seconds ago'
    },
    {
      id: '4',
      name: 'Access Control',
      status: 'secure',
      value: 'Enforced',
      description: 'Role-based access control active',
      lastChecked: '5 minutes ago'
    },
    {
      id: '5',
      name: 'Data Encryption',
      status: 'secure',
      value: 'AES-256',
      description: 'All data encrypted at rest and in transit',
      lastChecked: '3 minutes ago'
    },
    {
      id: '6',
      name: 'Rate Limiting',
      status: 'secure',
      value: 'Active',
      description: 'DDoS protection and rate limiting enabled',
      lastChecked: '1 minute ago'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);

  const runSecurityScan = async () => {
    setIsScanning(true);
    
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      lastChecked: 'Just now',
      status: Math.random() > 0.1 ? 'secure' : 'warning'
    })));
    
    setIsScanning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const secureCount = metrics.filter(m => m.status === 'secure').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const overallSecurity = (secureCount / metrics.length) * 100;

  return (
    <AnimatedBorder glowColor="green" intensity="medium">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🛡️ Security Dashboard</h2>
          <p className="text-gray-600">Real-time security monitoring and threat detection</p>
        </div>

        {/* Overall Security Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Overall Security Score</h3>
              <p className="text-sm text-gray-600">Based on {metrics.length} security metrics</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{overallSecurity.toFixed(0)}%</div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">Secure</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallSecurity}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            />
          </div>
        </motion.div>

        {/* Security Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <h4 className="font-semibold text-gray-800">{metric.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{metric.value}</div>
                  <div className="text-xs text-gray-500">{metric.lastChecked}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Actions */}
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runSecurityScan}
            disabled={isScanning}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Run Security Scan</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a3 3 0 003 3h0a3 3 0 003-3v-1m3-10V4a2 2 0 00-2-2H8a2 2 0 00-2 2v3m3 2h6" />
            </svg>
            <span>View Logs</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </motion.button>
        </div>

        {/* Recent Security Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Recent Security Events</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">✅ Security scan completed</span>
              <span className="text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600">🔐 Smart contract verified</span>
              <span className="text-gray-500">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">🛡️ All systems operational</span>
              <span className="text-gray-500">1 hour ago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedBorder>
  );
};

export default SecurityDashboard;
