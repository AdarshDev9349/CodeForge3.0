'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 border border-purple-500/30 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-20 h-20 border border-purple-400/40 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 w-16 h-16 bg-purple-600/20 rounded-full"
          animate={{ 
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-60 right-40 w-12 h-12 border border-purple-500/40 transform rotate-12"
          animate={{ 
            rotate: [12, 192, 372],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Loading content */}
      <motion.div
        className="relative z-10 flex flex-col items-center space-y-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated spinner */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute inset-2 w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Loading text with animated dots */}
        <div className="flex items-center space-x-2">
          <motion.span 
            className="text-lg font-medium text-purple-300"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading
          </motion.span>
          <div className="flex space-x-1">
            <motion.div 
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                delay: 0.1,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                delay: 0.2,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/20">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
            animate={{ 
              x: ['-100%', '100%']
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;


