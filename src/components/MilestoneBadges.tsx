import React, { useState } from 'react';
import { Award, Flame, ShieldCheck, Sparkles, Crown, Lock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { safeGetDate } from '../lib/utils';

interface MilestoneBadgesProps {
  history: any[];
}

export default function MilestoneBadges({ history }: MilestoneBadgesProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate metrics based on real Firestore scans
  const totalScans = history.length;
  
  // Get unique calendar days scanned
  const uniqueDays = new Set<string>();
  let scansWithHighScoreCount = 0;
  let maxScore = 0;

  history.forEach(scan => {
    const d = safeGetDate(scan.timestamp);
    if (d) {
      const dateStr = d.toDateString();
      uniqueDays.add(dateStr);
    }
    const score = scan.healthScore || 0;
    if (score >= 80) scansWithHighScoreCount++;
    if (score > maxScore) maxScore = score;
  });

  const uniqueDaysCount = uniqueDays.size;

  const badges = [
    {
      id: 'pioneer',
      title: 'Dermal Pioneer',
      description: 'Awarded for initiating your skin health journey with your first facial scan.',
      icon: Award,
      color: 'from-blue-600/20 to-indigo-600/20 text-blue-400 border-blue-500/30',
      glow: 'shadow-blue-500/10',
      isUnlocked: totalScans >= 1,
      progressLabel: `${Math.min(totalScans, 1)} / 1 scan`,
      progressPercent: Math.min(totalScans, 1) * 100,
    },
    {
      id: 'consistent',
      title: 'Weekly Consistent',
      description: 'Establish a solid tracking routine by scanning on 3 different days.',
      icon: Flame,
      color: 'from-amber-600/20 to-orange-600/20 text-orange-400 border-orange-500/30',
      glow: 'shadow-orange-500/10',
      isUnlocked: uniqueDaysCount >= 3,
      progressLabel: `${Math.min(uniqueDaysCount, 3)} / 3 days`,
      progressPercent: (Math.min(uniqueDaysCount, 3) / 3) * 100,
    },
    {
      id: 'healthy_streak',
      title: 'Healthy Streak',
      description: 'Maintain high standards with a skin health score of 80+ across 2 or more scans.',
      icon: ShieldCheck,
      color: 'from-emerald-600/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-emerald-500/10',
      isUnlocked: scansWithHighScoreCount >= 2,
      progressLabel: `${Math.min(scansWithHighScoreCount, 2)} / 2 high scores`,
      progressPercent: (Math.min(scansWithHighScoreCount, 2) / 2) * 100,
    },
    {
      id: 'perfect_derm',
      title: 'Perfect Derm',
      description: 'Achieve an exceptional skin health score of 90 or above on any analysis.',
      icon: Sparkles,
      color: 'from-pink-600/20 to-rose-600/20 text-pink-400 border-pink-500/30',
      glow: 'shadow-pink-500/10',
      isUnlocked: maxScore >= 90,
      progressLabel: maxScore >= 90 ? '90+ Achieved!' : `Best: ${maxScore}/90`,
      progressPercent: Math.min((maxScore / 90) * 100, 100),
    },
    {
      id: 'skin_devotee',
      title: 'Skin Devotee',
      description: 'Visualize your long-term skin health trends by completing at least 5 scans.',
      icon: Crown,
      color: 'from-purple-600/20 to-fuchsia-600/20 text-purple-400 border-purple-500/30',
      glow: 'shadow-purple-500/10',
      isUnlocked: totalScans >= 5,
      progressLabel: `${Math.min(totalScans, 5)} / 5 scans`,
      progressPercent: (Math.min(totalScans, 5) / 5) * 100,
    }
  ];

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const filteredBadges = badges.filter(b => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  return (
    <div className="glass p-6 rounded-3xl mb-12 border-white/5 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Milestone Badges
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                {unlockedCount} / {badges.length} Unlocked
              </span>
            </h2>
            <p className="text-xs text-slate-400">Earn recognition for consistent tracking and high skin health scores.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-0.5 glass rounded-xl text-[10px] font-black uppercase tracking-wider">
            {(['all', 'unlocked', 'locked'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === tab 
                    ? 'bg-brand-purple text-white shadow-md' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 glass text-slate-400 hover:text-white rounded-xl transition-all"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Quick Summary Progress Bar */}
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span>Overall Achievement Progress</span>
                <span className="font-bold text-white">{Math.round((unlockedCount / badges.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div 
                  className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink rounded-full transition-all duration-1000"
                  style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredBadges.map((badge, idx) => {
                const IconComponent = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`glass p-5 rounded-2xl flex flex-col items-center text-center transition-all border relative ${
                      badge.isUnlocked 
                        ? `bg-gradient-to-b ${badge.color} border-white/10 ${badge.glow} shadow-lg` 
                        : 'bg-white/[0.01] border-white/5 grayscale saturate-50 opacity-60'
                    }`}
                  >
                    {/* Lock Icon Overlay for locked badges */}
                    {!badge.isUnlocked && (
                      <div className="absolute top-3 right-3 text-slate-600">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                    
                    {/* Unlock Check Icon Overlay */}
                    {badge.isUnlocked && (
                      <div className="absolute top-3 right-3 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shadow-sm" />
                      </div>
                    )}

                    {/* Badge Icon Wrapper */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${
                      badge.isUnlocked ? 'bg-white/10 scale-110' : 'bg-white/5'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${badge.isUnlocked ? '' : 'text-slate-500'}`} />
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 tracking-tight">{badge.title}</h4>
                    <p className="text-[11px] text-slate-400 mb-4 flex-grow leading-relaxed">{badge.description}</p>
                    
                    {/* Badge Progress Tracking */}
                    <div className="w-full mt-auto">
                      <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        <span>Progress</span>
                        <span>{badge.progressLabel}</span>
                      </div>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            badge.isUnlocked 
                              ? 'bg-gradient-to-r from-white to-white/70' 
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
