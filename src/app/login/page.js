'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { IconMail, IconLock, IconUser, IconArrowRight, IconArrowLeft, IconAlertCircle, IconUsers, IconSchool, IconHash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  
  const [step, setStep] = useState('email'); // 'email', 'login', 'register', 'team-members'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [additionalMembers, setAdditionalMembers] = useState([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [currentMemberData, setCurrentMemberData] = useState({ name: '', email: '', yearOfStudy: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if user exists in teams table
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('leader_email', email)
      .single();

    if (teamError) {
      // Check if it's a "not found" error (PGRST116)
      if (teamError.code === 'PGRST116' || teamError.message.includes('multiple (or no) rows')) {
        // User doesn't exist, show registration form
        setStep('register');
      } else {
        // Network error, database error, or other issue - show error message
        setError('Unable to verify email. Please check your connection and try again.');
      }
    } else if (teamData) {
      // User exists, show login form
      setStep('login');
    } else {
      // No data and no error (shouldn't happen, but handle it)
      setStep('register');
    }
    
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify credentials against database
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('leader_email', email)
        .single();

      if (!teamData) {
        throw new Error('Account not found');
      }

      if (teamData.password !== password) {
        throw new Error('Invalid password');
      }

      // Login successful - save minimal session data (fetch full data from DB on load)
      const sessionData = {
        teamId: teamData.team_id,
        teamName: teamData.team_name,
        leaderEmail: teamData.leader_email,
        totalMembers: teamData.total_members,
      };
      localStorage.setItem('teamSession', JSON.stringify(sessionData));
      window.dispatchEvent(new Event('sessionUpdate'));

      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };



  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    const totalMembers = parseInt(teamMembers);
    const additionalMembersNeeded = totalMembers - 1; // Subtract the leader
    
    if (additionalMembersNeeded > 0) {
      // Move to team members step
      setStep('team-members');
      setCurrentMemberIndex(0);
      setAdditionalMembers([]);
    } else {
      // No additional members, complete registration
      await completeRegistration();
    }
  };

  const handleAddTeamMember = (e) => {
    e.preventDefault();
    setError('');
    
    const totalMembers = parseInt(teamMembers);
    const additionalMembersNeeded = totalMembers - 1;
    
    // Add current member to list
    const updatedMembers = [...additionalMembers, currentMemberData];
    setAdditionalMembers(updatedMembers);
    
    if (currentMemberIndex + 1 < additionalMembersNeeded) {
      // More members to add
      setCurrentMemberIndex(currentMemberIndex + 1);
      setCurrentMemberData({ name: '', email: '', yearOfStudy: '' });
    } else {
      // All members added, complete registration
      completeRegistration(updatedMembers);
    }
  };

  const completeRegistration = async (members = additionalMembers) => {
    setLoading(true);
    try {
      // Double-check that email doesn't already exist (prevents race conditions)
      const { data: existingTeam, error: checkError } = await supabase
        .from('teams')
        .select('team_id')
        .eq('leader_email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116' && !checkError.message.includes('multiple (or no) rows')) {
        // A real error occurred (not just "not found")
        throw new Error('Unable to verify email availability. Please try again.');
      }

      if (existingTeam) {
        // Email already exists
        throw new Error('This email is already registered. Please use the login option.');
      }

      // Generate a unique team ID
      const teamId = crypto.randomUUID();
      
      // Prepare team data with individual member columns
      const teamData = {
        team_id: teamId,
        team_name: teamName,
        total_members: parseInt(teamMembers),
        password: password,
        // Leader (Member 1)
        leader_name: name,
        leader_email: email,
        leader_year: yearOfStudy,
        // Member 2
        member2_name: members[0]?.name || null,
        member2_email: members[0]?.email || null,
        member2_year: members[0]?.yearOfStudy || null,
        // Member 3
        member3_name: members[1]?.name || null,
        member3_email: members[1]?.email || null,
        member3_year: members[1]?.yearOfStudy || null,
        // Member 4
        member4_name: members[2]?.name || null,
        member4_email: members[2]?.email || null,
        member4_year: members[2]?.yearOfStudy || null,
        created_at: new Date().toISOString(),
      };
      
      // Insert single row with all team members
      const { error: insertError } = await supabase
        .from('teams')
        .insert([teamData]);
      
      if (insertError) throw insertError;

      // Save minimal session data (fetch full data from DB on load)
      const sessionData = {
        teamId: teamId,
        teamName: teamName,
        leaderEmail: email,
        totalMembers: parseInt(teamMembers),
      };
      localStorage.setItem('teamSession', JSON.stringify(sessionData));
      window.dispatchEvent(new Event('sessionUpdate'));

      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'team-members') {
      if (currentMemberIndex > 0) {
        // Go back to previous team member
        setCurrentMemberIndex(currentMemberIndex - 1);
        setCurrentMemberData(additionalMembers[currentMemberIndex - 1]);
        setAdditionalMembers(additionalMembers.slice(0, -1));
      } else {
        // Go back to register step
        setStep('register');
        setCurrentMemberIndex(0);
        setAdditionalMembers([]);
        setCurrentMemberData({ name: '', email: '', yearOfStudy: '' });
      }
    } else {
      setStep('email');
      setError('');
      setPassword('');
      setName('');
      setTeamName('');
      setTeamMembers('');
      setYearOfStudy('');
      setAdditionalMembers([]);
      setCurrentMemberIndex(0);
      setCurrentMemberData({ name: '', email: '', yearOfStudy: '' });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 text-white overflow-hidden">
      {/* Animated background shapes - matching home page */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldReduceMotion ? 0.3 : 1 }}
        transition={{ duration: shouldReduceMotion ? 0.5 : 2, delay: shouldReduceMotion ? 0.2 : 0.8 }}
      >
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 border border-purple-500/30 rounded-full animate-pulse"
          initial={{ scale: 0, rotate: shouldReduceMotion ? 0 : -180 }}
          animate={{ scale: shouldReduceMotion ? 1 : 1, rotate: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.5, delay: shouldReduceMotion ? 0.2 : 1, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-20 h-20 border border-purple-400/40 rounded-full animate-ping"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.2, delay: shouldReduceMotion ? 0.2 : 1.2, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 w-16 h-16 bg-purple-600/20 rounded-full animate-bounce"
          initial={{ y: shouldReduceMotion ? 0 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1, delay: shouldReduceMotion ? 0.2 : 1.4, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute top-60 right-10 w-24 h-24 border border-purple-300/30 transform rotate-45 animate-spin" 
          style={{animationDuration: shouldReduceMotion ? '40s' : '20s'}}
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 45 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.3, delay: shouldReduceMotion ? 0.2 : 1.6, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute bottom-60 right-40 w-12 h-12 border border-purple-500/40 transform rotate-12 animate-pulse"
          initial={{ scale: 0, rotate: 12 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.1, delay: shouldReduceMotion ? 0.2 : 1.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Login Form Container */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, scale: shouldReduceMotion ? 1 : 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.4 : 1.2, delay: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <motion.div
          className="bg-purple-900/80 backdrop-blur-lg rounded-3xl border border-purple-500/40 p-8 shadow-2xl"
          style={{
            boxShadow: '0 0 40px rgba(134, 26, 133, 0.5), 0 0 80px rgba(81, 47, 141, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0.1 : 0.7 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-purple-300 bg-clip-text text-transparent mb-2">
              {step === 'email' ? 'Welcome' : step === 'login' ? 'Welcome Back' : step === 'team-members' ? 'Add Team Members' : 'Create Account'}
            </h1>
            <p className="text-purple-300 text-sm">
              {step === 'email' ? 'Enter your email to continue' : step === 'login' ? 'Enter your password to login' : step === 'team-members' ? `Team Member ${currentMemberIndex + 1} of ${parseInt(teamMembers) - 1}` : 'Complete your registration'}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-3"
            >
              <IconAlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <motion.form
              onSubmit={handleEmailSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                {loading ? 'Checking...' : 'Continue'}
                <IconArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.form>
          )}

          {/* Login Step */}
          {step === 'login' && (
            <motion.form
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-purple-800/20 border border-purple-500/20 rounded-xl pl-12 pr-4 py-3 text-purple-200 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconLock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="bg-purple-800/30 border border-purple-500/30 text-purple-200 font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 hover:bg-purple-800/50"
                >
                  <IconArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Register Step */}
          {step === 'register' && (
            <motion.form
              onSubmit={handleRegister}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-purple-800/20 border border-purple-500/20 rounded-xl pl-12 pr-4 py-3 text-purple-200 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Team Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconUsers className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Team Phoenix"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Number of Team Members
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconHash className="w-5 h-5" />
                  </div>
                  <select
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={loading}
                  >
                    <option value="" className="bg-purple-900">Select team size...</option>
                    <option value="2" className="bg-purple-900">2 Members</option>
                    <option value="3" className="bg-purple-900">3 Members</option>
                    <option value="4" className="bg-purple-900">4 Members</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Year of Study
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconSchool className="w-5 h-5" />
                  </div>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={loading}
                  >
                    <option value="" className="bg-purple-900">Select year...</option>
                    <option value="1st Year" className="bg-purple-900">1st Year</option>
                    <option value="2nd Year" className="bg-purple-900">2nd Year</option>
                    <option value="3rd Year" className="bg-purple-900">3rd Year</option>
                    <option value="4th Year" className="bg-purple-900">4th Year</option>
                    <option value="Graduate" className="bg-purple-900">Graduate</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconLock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Create a password (min 6 characters)"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="bg-purple-800/30 border border-purple-500/30 text-purple-200 font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 hover:bg-purple-800/50"
                >
                  <IconArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  {parseInt(teamMembers) > 1 ? 'Next: Add Team Members' : 'Create Account'}
                  <IconArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Team Members Step */}
          {step === 'team-members' && (
            <motion.form
              onSubmit={handleAddTeamMember}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="bg-purple-800/20 border border-purple-500/20 rounded-xl p-4 mb-4">
                  <p className="text-purple-200 text-sm">
                    <span className="font-semibold">Team:</span> {teamName}
                  </p>
                  <p className="text-purple-300 text-xs mt-1">
                    Adding member {currentMemberIndex + 2} of {teamMembers}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Member Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={currentMemberData.name}
                    onChange={(e) => setCurrentMemberData({ ...currentMemberData, name: e.target.value })}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Jane Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Member Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={currentMemberData.email}
                    onChange={(e) => setCurrentMemberData({ ...currentMemberData, email: e.target.value })}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="jane@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Year of Study
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <IconSchool className="w-5 h-5" />
                  </div>
                  <select
                    value={currentMemberData.yearOfStudy}
                    onChange={(e) => setCurrentMemberData({ ...currentMemberData, yearOfStudy: e.target.value })}
                    required
                    className="w-full bg-purple-800/30 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={loading}
                  >
                    <option value="" className="bg-purple-900">Select year...</option>
                    <option value="1st Year" className="bg-purple-900">1st Year</option>
                    <option value="2nd Year" className="bg-purple-900">2nd Year</option>
                    <option value="3rd Year" className="bg-purple-900">3rd Year</option>
                    <option value="4th Year" className="bg-purple-900">4th Year</option>
                    <option value="Graduate" className="bg-purple-900">Graduate</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="bg-purple-800/30 border border-purple-500/30 text-purple-200 font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 hover:bg-purple-800/50"
                >
                  <IconArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving...' : currentMemberIndex + 1 < parseInt(teamMembers) - 1 ? 'Next Member' : 'Complete Registration'}
                  <IconArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            <motion.div 
              className={`h-2 rounded-full transition-all duration-300 ${step === 'email' ? 'bg-purple-400 w-8' : 'bg-purple-600/50 w-2'}`}
              animate={{ width: step === 'email' ? 32 : 8 }}
            />
            <motion.div 
              className={`h-2 rounded-full transition-all duration-300 ${step === 'login' || step === 'register' ? 'bg-purple-400 w-8' : 'bg-purple-600/50 w-2'}`}
              animate={{ width: step === 'login' || step === 'register' ? 32 : 8 }}
            />
            <motion.div 
              className={`h-2 rounded-full transition-all duration-300 ${step === 'team-members' ? 'bg-purple-400 w-8' : 'bg-purple-600/50 w-2'}`}
              animate={{ width: step === 'team-members' ? 32 : 8 }}
            />
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => router.push('/')}
            className="text-purple-300 hover:text-purple-200 transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
