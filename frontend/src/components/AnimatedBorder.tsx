import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'pink' | 'rainbow';
  intensity?: 'subtle' | 'medium' | 'strong';
}

const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  className = '',
  borderClassName = '',
  glowColor = 'blue',
  intensity = 'medium'
}) => {
  const getGradientColors = (color: string, intensity: string) => {
    const colors = {
      blue: {
        subtle: ['from-blue-400', 'via-blue-500', 'to-blue-600'],
        medium: ['from-blue-500', 'via-purple-500', 'to-pink-500'],
        strong: ['from-cyan-400', 'via-blue-500', 'to-purple-600']
      },
      purple: {
        subtle: ['from-purple-400', 'via-purple-500', 'to-purple-600'],
        medium: ['from-purple-500', 'via-pink-500', 'to-red-500'],
        strong: ['from-purple-400', 'via-pink-500', 'to-orange-500']
      },
      green: {
        subtle: ['from-green-400', 'via-green-500', 'to-green-600'],
        medium: ['from-green-500', 'via-emerald-500', 'to-teal-500'],
        strong: ['from-lime-400', 'via-green-500', 'to-emerald-600']
      },
      pink: {
        subtle: ['from-pink-400', 'via-pink-500', 'to-pink-600'],
        medium: ['from-pink-500', 'via-rose-500', 'to-red-500'],
        strong: ['from-pink-400', 'via-purple-500', 'to-indigo-600']
      },
      rainbow: {
        subtle: ['from-red-400', 'via-yellow-500', 'to-blue-500'],
        medium: ['from-red-500', 'via-yellow-500', 'to-green-500', 'via-blue-500', 'to-purple-500'],
        strong: ['from-red-500', 'via-orange-500', 'via-yellow-500', 'via-green-500', 'via-blue-500', 'via-indigo-500', 'via-purple-500']
      }
    };
    
    return colors[color as keyof typeof colors]?.[intensity as keyof typeof colors[keyof typeof colors]] || colors.blue.medium;
  };

  const getBlurIntensity = (intensity: string) => {
    switch (intensity) {
      case 'subtle': return 'blur-sm';
      case 'medium': return 'blur-md';
      case 'strong': return 'blur-lg';
      default: return 'blur-md';
    }
  };

  const gradientColors = getGradientColors(glowColor, intensity);
  const blurClass = getBlurIntensity(intensity);

  return (
    <div className={`relative ${className}`}>
      {/* Animated border layers */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradientColors.join(' ')} rounded-lg ${blurClass} opacity-75`}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradientColors.join(' ')} rounded-lg ${blurClass} opacity-50`}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradientColors.join(' ')} rounded-lg ${blurClass} opacity-25`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Pulsing corners */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, index) => (
        <motion.div
          key={corner}
          className={`absolute w-4 h-4 bg-gradient-to-r ${gradientColors.join(' ')} rounded-full ${blurClass}`}
          style={{
            [corner.includes('top') ? 'top' : 'bottom']: '-2px',
            [corner.includes('left') ? 'left' : 'right']: '-2px',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            delay: index * 0.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      {/* Content container */}
      <div className={`relative bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 ${borderClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorder;
