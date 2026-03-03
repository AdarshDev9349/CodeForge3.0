'use client';

import { motion } from 'framer-motion';

export default function HomeLoggedIn({ session }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-6 text-white pt-24 md:pt-28 pb-12 md:pb-16">
      {/* Logged In Badge - Top Left */}
      <motion.div
        className="fixed top-10 left-4 md:left-8 z-20 inline-flex items-center gap-2 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <p className="uppercase text-xs tracking-widest text-purple-200">Logged In</p>
      </motion.div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-20 h-20 border border-purple-400/40 rounded-full animate-ping" />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-purple-600/20 rounded-full animate-bounce" />
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-4xl w-full z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <div className="text-center mb-12 mt-8 md:mt-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Welcome, <span className="text-purple-400">{session.teamName}</span>
          </h1>
          <p className="text-lg text-purple-200">
            You're all set for CodeForge 3.0!
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Team Info Card */}
          <motion.div
            className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/40 rounded-2xl p-6 hover:border-purple-400/60 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Team Info</h3>
            </div>
            <p className="text-purple-200 text-sm">Team Name: {session.teamName}</p>
            <p className="text-purple-200 text-sm mt-2">Members: {session.totalMembers}</p>
          </motion.div>

          {/* Event Status Card */}
          <motion.div
            className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/40 rounded-2xl p-6 hover:border-purple-400/60 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Event Status</h3>
            </div>
            <p className="text-purple-200 text-sm">Registration: Confirmed</p>
            <p className="text-purple-200 text-sm mt-2">Status: Ready</p>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/40 rounded-2xl p-6 hover:border-purple-400/60 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition-colors text-sm">
              View Schedule
            </button>
          </motion.div>
        </div>

        {/* Notice Board */}
        <motion.div
          className="mt-8 bg-purple-900/40 backdrop-blur-lg border border-purple-500/40 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">📢 Announcements</h3>
          <div className="space-y-3">
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <p className="text-purple-100 text-sm">
                Welcome to CodeForge 3.0! Make sure to check the schedule and rules before the event.
              </p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <p className="text-purple-100 text-sm">
                Event starts in 30 days. Stay tuned for more updates!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
