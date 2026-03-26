import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, ChevronRight, 
  Award, Star, Zap, CheckCircle2 , Coins
} from 'lucide-react';

import Header from '../components/Header';

const GamificationDashboard = () => {
  const [stats, setStats] = useState({ xp: 0, current_level: 1, current_streak: 0 });
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const [statsRes, missionsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/gamification/stats', config),
          axios.get('http://localhost:5000/api/gamification/missions', config)
        ]);

        setStats(statsRes.data);
        setMissions(missionsRes.data);
      } catch (error) {
        console.error("Error fetching gamification data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGamificationData();
  }, []);

  // Calculate progress to next level (assuming Level = sqrt(XP/100) + 1)
  const currentLevelXP = Math.pow(stats.current_level - 1, 2) * 100;
  const nextLevelXP = Math.pow(stats.current_level, 2) * 100;
  const progress = ((stats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  if (loading) return <div className="p-10 text-center text-slate-400">Loading your progress...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      <Header />
      
      {/* --- HEADER SECTION: LEVEL & STREAK --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">Current Rank</span>
            <h2 className="text-4xl font-bold text-slate-900">Level {stats.current_level}</h2>
            <p className="text-slate-500 text-sm font-medium">You need {nextLevelXP - stats.xp} XP to reach Level {stats.current_level + 1}</p>
          </div>
          <div className="relative flex items-center justify-center w-24 h-24">
             <Trophy size={48} className="text-blue-600 absolute" />
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                <motion.circle 
                  cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" 
                  strokeDasharray={276}
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * progress) / 100 }}
                  className="text-blue-600"
                />
             </svg>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center text-center"
        >
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200 mb-4">
            <Flame className="text-white" size={24} />
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{stats.current_streak} Day Streak</h3>
          <p className="text-orange-600 text-xs font-bold uppercase mt-2">Keep it up, you're on fire! 🔥</p>
        </motion.div>
      </div>

      {/* --- XP PROGRESS BAR --- */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between mb-4 items-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience Points</span>
          <span className="text-lg font-black text-slate-900">{stats.xp} <span className="text-slate-300">/ {nextLevelXP}</span></span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>

      {/* --- ACTIVE MISSIONS --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-900 rounded-xl text-white">
            <Target size={20} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Active Missions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((mission, idx) => (
            <motion.div 
              key={mission.mission_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden p-6 rounded-[2rem] border transition-all ${
                mission.is_completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* REWARD BADGE - This is what was missing! */}
              <div className="absolute top-0 right-0 flex">
                <div className="bg-blue-600 text-white px-4 py-1.5 text-[10px] font-black uppercase rounded-bl-2xl shadow-sm">
                  +{mission.xp_reward} XP
                </div>
                <div className="bg-amber-400 text-amber-900 px-4 py-1.5 text-[10px] font-black uppercase rounded-bl-none shadow-sm flex items-center gap-1">
                  <Coins size={10} /> {mission.token_reward}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{mission.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{mission.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{mission.is_completed ? 'Mission Accomplished' : 'Progress'}</span>
                    <span>{mission.current_value} / {mission.requirement_value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(mission.current_value / mission.requirement_value) * 100}%` }}
                      className={`h-full ${mission.is_completed ? 'bg-green-500' : 'bg-blue-600'}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;