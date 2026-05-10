import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Activity, Zap, Shield, Target, BarChart3 } from 'lucide-react';

interface AnimatedStatsProps {
  totalAgents: number;
  avgROI: number;
  totalCapital: number;
  totalTrades: number;
}

export default function AnimatedStats({ totalAgents, avgROI, totalCapital, totalTrades }: AnimatedStatsProps) {
  const stats = [
    {
      title: "Total Agents",
      value: totalAgents,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      delay: 0.1,
    },
    {
      title: "Average ROI",
      value: `${avgROI.toFixed(2)}%`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      delay: 0.2,
    },
    {
      title: "Total Capital",
      value: `$${totalCapital.toFixed(1)}M`,
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      delay: 0.3,
    },
    {
      title: "Total Trades",
      value: totalTrades,
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: stat.delay,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              rotateX: 5,
              rotateY: 5,
            }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
            
            <div className={`relative bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300`}>
              {/* Floating Icon */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  delay: stat.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Title */}
              <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
              
              {/* Value */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stat.delay + 0.3, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.div>

              {/* Animated Underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: stat.delay + 0.5, duration: 0.8 }}
                className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-3`}
              />

              {/* Particle Effects */}
              <div className="absolute top-2 right-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [0, -20, -40],
                    }}
                    transition={{
                      duration: 2,
                      delay: stat.delay + i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className={`w-2 h-2 bg-gradient-to-r ${stat.color} rounded-full`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Additional animated metrics component
export function AnimatedMetrics() {
  const metrics = [
    { label: "Success Rate", value: "94%", icon: Target, trend: "+12%" },
    { label: "Risk Score", value: "Low", icon: Shield, trend: "-8%" },
    { label: "Activity", value: "High", icon: Activity, trend: "+25%" },
    { label: "Efficiency", value: "87%", icon: Zap, trend: "+5%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.trend.startsWith('+');
        
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-800">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
