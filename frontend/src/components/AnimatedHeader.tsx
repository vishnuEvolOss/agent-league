import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Trophy, Zap, Globe, Shield } from 'lucide-react';

export default function AnimatedHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-lg border-b border-white/20 shadow-2xl"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            {/* Animated Logo */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl blur-xl"
              />
            </motion.div>

            {/* Title Section */}
            <div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-2"
              >
                <span>Agent Performance League</span>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm md:text-base text-blue-100 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Agent Performance Tracking & Capital Delegation</span>
                <Sparkles className="w-4 h-4" />
              </motion.p>
            </div>
          </motion.div>

          {/* Navigation/Stats */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden md:flex items-center space-x-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30"
            >
              <Globe className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Mantle Network</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30"
            >
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Audited</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap className="w-4 h-4" />
              <span>Connect Wallet</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden mt-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
        >
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white" />
        </motion.button>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </motion.header>
  );
}
