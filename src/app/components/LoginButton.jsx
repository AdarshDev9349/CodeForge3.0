'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { IconLogin, IconUserCircle, IconLogout, IconUser, IconMail, IconSchool, IconX, IconRefresh } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginButton() {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [session, setSession] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for session on mount and fetch team data from database
    const checkSession = async () => {
      const sessionData = localStorage.getItem('teamSession');
      
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        
        // Fetch full team data from database using email
        if (parsedSession.leaderEmail) {
          try {
            const { data: teamData, error } = await supabase
              .from('teams')
              .select('*')
              .eq('leader_email', parsedSession.leaderEmail)
              .single();
            
            if (teamData && !error) {
              // Build members array from database
              const members = [
                {
                  name: teamData.leader_name,
                  email: teamData.leader_email,
                  year: teamData.leader_year,
                },
                teamData.member2_name ? {
                  name: teamData.member2_name,
                  email: teamData.member2_email,
                  year: teamData.member2_year,
                } : null,
                teamData.member3_name ? {
                  name: teamData.member3_name,
                  email: teamData.member3_email,
                  year: teamData.member3_year,
                } : null,
                teamData.member4_name ? {
                  name: teamData.member4_name,
                  email: teamData.member4_email,
                  year: teamData.member4_year,
                } : null,
              ].filter(Boolean);
              
              // Update session with fresh data
              const updatedSession = {
                ...parsedSession,
                teamName: teamData.team_name,
                totalMembers: teamData.total_members,
                members: members,
              };
              
              setSession(updatedSession);
            } else {
              console.error('Database error:', error);
              setSession(parsedSession);
            }
          } catch (err) {
            console.error('Error fetching team data:', err);
            setSession(parsedSession);
          }
        } else {
          setSession(parsedSession);
        }
      }
    };
    
    checkSession();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkSession);
    
    // Custom event for same-tab updates
    window.addEventListener('sessionUpdate', checkSession);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('sessionUpdate', checkSession);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('teamSession');
    setSession(null);
    setShowDropdown(false);
    
    // Dispatch custom event to notify parent components
    window.dispatchEvent(new Event('sessionUpdate'));
    
    // Force page refresh to show logged-out view
    window.location.href = '/';
  };

  const fetchTeamData = async (email) => {
    try {
      const { data: teamData, error } = await supabase
        .from('teams')
        .select('*')
        .eq('leader_email', email)
        .single();
      
      if (teamData && !error) {
        // Build members array from database
        const members = [
          {
            name: teamData.leader_name,
            email: teamData.leader_email,
            year: teamData.leader_year,
          },
          teamData.member2_name ? {
            name: teamData.member2_name,
            email: teamData.member2_email,
            year: teamData.member2_year,
          } : null,
          teamData.member3_name ? {
            name: teamData.member3_name,
            email: teamData.member3_email,
            year: teamData.member3_year,
          } : null,
          teamData.member4_name ? {
            name: teamData.member4_name,
            email: teamData.member4_email,
            year: teamData.member4_year,
          } : null,
        ].filter(Boolean);
        
        return {
          teamName: teamData.team_name,
          totalMembers: teamData.total_members,
          members: members,
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching team data:', err);
      return null;
    }
  };

  // If logged in, show team name
  if (session) {
    return (
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
      >
        <div className="relative dropdown-container">
          <motion.button
            onClick={() => setShowDropdown(!showDropdown)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
            className="group relative flex items-center gap-2 px-6 py-3 rounded-full bg-purple-900/80 backdrop-blur-lg border border-purple-500/40 transition-all duration-300 hover:border-purple-400/60"
            style={{
              boxShadow: hovered
                ? '0 0 40px rgba(134, 26, 133, 0.6), 0 0 80px rgba(81, 47, 141, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 0 20px rgba(134, 26, 133, 0.4), 0 0 40px rgba(81, 47, 141, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/0 via-purple-500/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                backgroundPosition: hovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ backgroundSize: '200% 100%' }}
            />

            {/* Icon */}
            <motion.div
              animate={{
                rotate: hovered ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
              className="relative z-10"
            >
              <IconUserCircle className="w-5 h-5 text-purple-200 group-hover:text-purple-100 transition-colors" />
            </motion.div>

            {/* Team Name */}
            <span className="relative z-10 text-purple-200 font-medium group-hover:text-purple-100 transition-colors">
              {session.teamName}
            </span>
          </motion.button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-56 bg-purple-900/95 backdrop-blur-lg border border-purple-500/40 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20"
            >
              <div className="p-3 border-b border-purple-500/30">
                <p className="text-purple-300 text-xs uppercase tracking-wide font-medium">Team Members</p>
              </div>
              
              {/* Team Members List */}
              <div className="max-h-64 overflow-y-auto">
                {session.members && session.members.length > 0 ? (
                  session.members.map((member, index) => (
                    <div
                      key={index}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 border-b border-purple-500/10 last:border-b-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-700/50 flex items-center justify-center">
                        <IconUser className="w-4 h-4 text-purple-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-purple-100 truncate">{member.name}</p>
                        {index === 0 && (
                          <p className="text-xs text-purple-400">Team Leader</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-purple-400 text-sm">
                    No member data available
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div className="border-t border-purple-500/30">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-purple-200 hover:bg-purple-800/50 transition-colors flex items-center gap-2"
                >
                  <IconLogout className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // If not logged in, show login button
  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
    >
      <motion.button
        onClick={handleLogin}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
        whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
        className="group relative flex items-center gap-2 px-6 py-3 rounded-full bg-purple-900/80 backdrop-blur-lg border border-purple-500/40 transition-all duration-300 hover:border-purple-400/60"
        style={{
          boxShadow: hovered
            ? '0 0 40px rgba(134, 26, 133, 0.6), 0 0 80px rgba(81, 47, 141, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 0 20px rgba(134, 26, 133, 0.4), 0 0 40px rgba(81, 47, 141, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/0 via-purple-500/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            backgroundPosition: hovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 100%' }}
        />

        {/* Icon with animation */}
        <motion.div
          animate={{
            rotate: hovered ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          className="relative z-10"
        >
          <IconUserCircle className="w-5 h-5 text-purple-200 group-hover:text-purple-100 transition-colors" />
        </motion.div>

        {/* Text */}
        <span className="relative z-10 text-purple-200 font-medium group-hover:text-purple-100 transition-colors">
          Login
        </span>

        {/* Arrow icon with slide animation */}
        <motion.div
          animate={{
            x: hovered ? 3 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="relative z-10"
        >
          <IconLogin className="w-5 h-5 text-purple-200 group-hover:text-purple-100 transition-colors" />
        </motion.div>

        {/* Pulse effect on hover */}
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400/60"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}
