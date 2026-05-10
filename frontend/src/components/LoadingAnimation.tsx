import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
        
        {/* Middle rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 w-28 h-28 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />
        
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 w-24 h-24 border-4 border-pink-500/30 border-t-pink-500 rounded-full"
        />
        
        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        {/* Floating sparks */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            style={{
              top: `${50 + Math.cos((i * 60) * Math.PI / 180) * 40}%`,
              left: `${50 + Math.sin((i * 60) * Math.PI / 180) * 40}%`,
            }}
          >
            <Sparkles className="w-3 h-3 text-white" />
          </motion.div>
        ))}
        
        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-white font-semibold text-lg">Loading Agent League</p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-blue-300 text-sm mt-1"
          >
            Initializing AI agents...
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
