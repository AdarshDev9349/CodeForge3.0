'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import About from './about';
import ScheduleTimeline from './ScheduleTimeline';
import RulesAndFAQ from './RulesAndFAQ';
import Footer from './Footer';

export default function HomeLoggedOut() {
  const shouldReduceMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    // Replace this with actual countdown logic if needed
    const interval = setInterval(() => {
      setTimeLeft({
        days: '30',
        hours: '00',
        minutes: '00',
        seconds: '00',
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div 
        className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-6 text-white pb-20 md:pb-6 pt-20 md:pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.1 : 0.3 }}
        style={{ willChange: 'opacity' }}
      >
        
        {/* Floating geometric shapes with staggered animations */}
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldReduceMotion ? 0.3 : 1 }}
          transition={{ duration: shouldReduceMotion ? 0.5 : 2, delay: shouldReduceMotion ? 0.2 : 0.8 }}
        >
          {/* Animated circles */}
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 border border-purple-500/30 rounded-full animate-pulse"
            initial={{ scale: 0, rotate: shouldReduceMotion ? 0 : -180 }}
            animate={{ scale: shouldReduceMotion ? 1 : 1, rotate: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.5, delay: shouldReduceMotion ? 0.2 : 1, ease: "easeOut" }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-20 h-20 border border-purple-400/40 rounded-full animate-ping"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.2, delay: shouldReduceMotion ? 0.2 : 1.2, ease: "easeOut" }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          />
          <motion.div 
            className="absolute bottom-40 left-20 w-16 h-16 bg-purple-600/20 rounded-full animate-bounce"
            initial={{ y: shouldReduceMotion ? 0 : 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.2 : 1.4, ease: "easeOut" }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          />
          
          {/* Floating hexagons */}
          <motion.div 
            className="absolute top-60 right-10 w-24 h-24 border border-purple-300/30 transform rotate-45 animate-spin" 
            style={{animationDuration: shouldReduceMotion ? '40s' : '20s', willChange: shouldReduceMotion ? 'auto' : 'transform'}}
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.3, delay: shouldReduceMotion ? 0.2 : 1.6, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute bottom-60 right-40 w-12 h-12 border border-purple-500/40 transform rotate-12 animate-pulse"
            initial={{ scale: 0, rotate: 12 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.1, delay: shouldReduceMotion ? 0.2 : 1.8, ease: "easeOut" }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          />
        </motion.div>

        {/* Main Content Container with morphing entrance */}
        <motion.div 
          className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between z-10 gap-6 lg:gap-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, scale: shouldReduceMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.4 : 1.2, delay: shouldReduceMotion ? 0.1 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
        >
          
          {/* Left Content - Enhanced with morphing title */}
          <motion.div 
            className="text-center lg:text-left max-w-2xl relative"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.4 : 1, delay: shouldReduceMotion ? 0.2 : 0.7, ease: "easeOut" }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          >
            
            {/* Glitch effect background text */}
            <motion.div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 2, delay: 1.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-400 animate-pulse">
                CODEFORGE 3.0
              </h1>
            </motion.div>
            
            {/* IEEE Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
              <motion.div 
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              />
              <motion.p 
                className="uppercase text-xs tracking-widest text-purple-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                IEEE Student Branch UCEK
              </motion.p>
            </motion.div>
            
            {/* Main Title with enhanced morphing styling */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 100, scale: shouldReduceMotion ? 1 : 0.8, filter: shouldReduceMotion ? "blur(0px)" : "blur(20px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: shouldReduceMotion ? 0.4 : 1.5, delay: shouldReduceMotion ? 0.2 : 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, filter' }}
            >
              <motion.span 
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.3 : 1.2 }}
              >
                CodeForge 3.0
                <motion.span 
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 blur opacity-30 animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: shouldReduceMotion ? 0.2 : 0.3 }}
                  transition={{ duration: shouldReduceMotion ? 0.3 : 2, delay: shouldReduceMotion ? 0.3 : 1.5 }}
                />
              </motion.span>
              <br />
              <motion.span 
                className="text-purple-100 text-3xl md:text-4xl lg:text-5xl"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.3 : 1.4 }}
                style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
              >
                Hackathon
              </motion.span>
            </motion.h1>
            
            {/* Enhanced description */}
            <motion.p 
              className="mt-6 text-lg md:text-xl text-purple-100 leading-relaxed"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.3 : 1.6 }}
              style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
            >
              Join us for the ultimate 
              <motion.span 
                className="text-purple-300 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: shouldReduceMotion ? 0.3 : 1.8 }}
              > coding competition </motion.span>
              where innovation meets creativity. 
              <br className="hidden md:block" />
              Build, compete, and win amazing prizes!
            </motion.p>
            
            {/* CTA Buttons with staggered entrance */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.4 : 1.8 }}
              style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
            >
              <motion.button 
                className="group relative px-8 py-4 md:mx-0 mx-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-purple-500/25 hover:shadow-2xl"
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: shouldReduceMotion ? 0.4 : 2 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
              >
                <span className="relative z-10">Register Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 mx-6 border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 font-semibold rounded-lg transition-all transform hover:scale-105"
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: shouldReduceMotion ? 0.4 : 2.2 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
              >
                Learn More
              </motion.button>
            </motion.div>
            
          </motion.div>
          
          {/* Right: Compact Timer - Mobile Optimized with entrance animation */}
          <motion.div 
            className="relative w-full max-w-sm lg:max-w-md"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 100, rotateY: shouldReduceMotion ? 0 : 45 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.4 : 1.2, delay: shouldReduceMotion ? 0.3 : 1, ease: "easeOut" }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          >
            {/* Glowing background effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-2xl blur-lg"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.3 : 1.5, delay: shouldReduceMotion ? 0.3 : 1.2 }}
              style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
            />
            
            <motion.div 
              className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.3 : 1.3 }}
              style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
            >
              
              {/* Header */}
              <motion.div 
                className="text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <h3 className="text-purple-200 text-xs md:text-sm uppercase tracking-wide mb-2">Event Starts In</h3>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              </motion.div>
              
              {/* Compact Timer Grid with staggered number animations */}
              <motion.div 
                className="flex justify-center gap-2 md:gap-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.4 : 1.7 }}
              >
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((unit, index) => (
                  <motion.div 
                    key={unit.label} 
                    className="text-center flex-1 max-w-16 md:max-w-20"
                    initial={{ opacity: 0, scale: 0, rotateY: shouldReduceMotion ? 0 : 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: shouldReduceMotion ? 0.4 + index * 0.05 : 1.8 + index * 0.1, ease: "easeOut" }}
                    style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                  >
                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-lg p-2 md:p-3 border border-purple-400/30 hover:border-purple-300/50 transition-all group">
                      <div className="text-lg md:text-2xl lg:text-3xl font-mono font-bold text-purple-100 group-hover:text-white transition-colors leading-none">
                        {unit.value}
                      </div>
                      <div className="text-xs uppercase text-purple-300 mt-1 tracking-wide">
                        {unit.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Status indicator */}
              <motion.div 
                className="flex items-center justify-center gap-2 text-purple-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: shouldReduceMotion ? 0.5 : 2.2 }}
              >
                <motion.div 
                  className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0.5 : 2.3 }}
                  style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                />
                <span className="text-xs font-mono">LIVE</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Bottom decorative elements */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-purple-400/60"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.6 : 2.5 }}
          style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
        >
          <motion.div 
            className="w-8 h-px bg-purple-500/50"
            initial={{ width: shouldReduceMotion ? 32 : 0 }}
            animate={{ width: 32 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.6 : 2.7 }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'width' }}
          />
          <motion.div 
            className="w-2 h-2 border border-purple-500/50 rounded-full animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0.6 : 2.8 }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
          />
          <motion.div 
            className="w-8 h-px bg-purple-500/50"
            initial={{ width: shouldReduceMotion ? 32 : 0 }}
            animate={{ width: 32 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.6 : 2.9 }}
            style={{ willChange: shouldReduceMotion ? 'auto' : 'width' }}
          />
        </motion.div>
      </motion.div>
      
      {/* About Section */}
      <About />
      {/* Schedule Timeline Section */}
      <ScheduleTimeline />
      {/* Rules and FAQ Section */}
      <RulesAndFAQ />
      <Footer/>
    </>
  );
}
