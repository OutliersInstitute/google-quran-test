import React from 'react';
import { X, Trophy, Flame, CheckCircle2, Clock, Calendar, Award, Target, Sparkles } from 'lucide-react';
import { LeagueMember, MushafTheme } from '../types';
import { getTierFromRank } from '../utils/leagueEngine';
import { triggerHaptic } from '../utils/haptics';

interface MemberProfileModalProps {
  member: LeagueMember | null;
  onClose: () => void;
  targetDescription: string;
  theme: MushafTheme;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  onClose,
  targetDescription,
  theme,
}) => {
  if (!member) return null;

  const tier = getTierFromRank(member.rank, 6);

  // Generate last 7 days keys
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNum = d.getDate();
    return { key, dayName, dayNum };
  });

  const isMoonstone = theme === 'moonstone';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${
          isMoonstone 
            ? 'bg-white text-[#20373B] border-2 border-[#519CAB]/30' 
            : 'bg-[#faf7f0] dark:bg-[#161b20] text-stone-900 dark:text-stone-100 border border-amber-900/20 dark:border-stone-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isMoonstone 
            ? 'bg-white border-[#519CAB]/20 text-[#20373B]' 
            : 'border-amber-900/10 dark:border-stone-800 bg-[#f4eee0] dark:bg-[#12161a]'
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-75">
            League Member Profile
          </span>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 space-y-6">
          
          {/* Avatar & Rank */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md ${member.avatarColor}`}>
              {member.avatarEmoji || member.name[0]}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg">{member.name}</h3>
                {member.isCurrentUser && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isMoonstone ? 'bg-[#519CAB] text-white' : 'bg-amber-800 text-amber-50'
                  }`}>
                    You
                  </span>
                )}
              </div>
              <div className="text-xs opacity-75">{member.statusMessage || 'Active League Member'}</div>
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] ${tier.color}`}>
                  {tier.badge} Rank #{member.rank} • {tier.label}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl border border-amber-900/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 text-center">
              <span className="text-[10px] uppercase font-bold opacity-60 block">Points</span>
              <span className="font-mono text-base font-black text-amber-800 dark:text-amber-400">
                {member.points} XP
              </span>
            </div>

            <div className="p-3 rounded-2xl border border-amber-900/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 text-center">
              <span className="text-[10px] uppercase font-bold opacity-60 block">Streak</span>
              <span className="font-mono text-base font-black text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-current" />
                <span>{member.streakDays}d</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl border border-amber-900/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 text-center">
              <span className="text-[10px] uppercase font-bold opacity-60 block">Today</span>
              <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                {member.completedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 opacity-50" />
                    <span className="text-stone-400">Due</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Progress toward League Target */}
          <div className="p-4 rounded-2xl border border-amber-900/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 opacity-80">
                <Target className="w-3.5 h-3.5 text-amber-700" />
                <span>Progress to Target</span>
              </span>
              <span className="font-mono font-bold">{member.progressPercent}%</span>
            </div>

            <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-amber-800 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(member.progressPercent, 4)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] opacity-70">
              <span>{member.progressCurrent} / {member.progressTarget} completed</span>
              <span className="truncate max-w-[200px]">{targetDescription}</span>
            </div>
          </div>

          {/* 7-Day Activity Heatmap */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last 7 Days Activity</span>
            </span>

            <div className="grid grid-cols-7 gap-1.5">
              {last7Days.map((d) => {
                const activityVal = member.dailyActivity[d.key] || 0;
                return (
                  <div 
                    key={d.key} 
                    className="p-2 rounded-xl border border-amber-900/10 dark:border-stone-800 bg-white/50 dark:bg-stone-900/30 text-center flex flex-col items-center justify-between gap-1"
                  >
                    <span className="text-[10px] opacity-60 font-sans">{d.dayName}</span>
                    <div 
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        activityVal > 0 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-black/10 dark:bg-white/10 text-stone-400'
                      }`}
                    >
                      {activityVal > 0 ? '✓' : '·'}
                    </div>
                    <span className="text-[9px] font-mono opacity-70">
                      {activityVal > 0 ? `+${activityVal}` : '0'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
