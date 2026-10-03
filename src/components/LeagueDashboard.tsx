import React, { useState } from 'react';
import { 
  Trophy, Flame, Users, Plus, KeyRound, Share2, CheckCircle2, 
  Clock, ArrowRight, Play, Sparkles, BookOpen, ChevronRight, 
  HelpCircle, Shield, Award, Calendar, ArrowLeft, Layers, Target, ChevronDown
} from 'lucide-react';
import { League, LeagueMember, MushafTheme } from '../types';
import { getTierFromRank, SCORING_RULES } from '../utils/leagueEngine';
import { triggerHaptic } from '../utils/haptics';
import { CreateLeagueModal } from './CreateLeagueModal';
import { JoinLeagueModal } from './JoinLeagueModal';
import { ShareInviteModal } from './ShareInviteModal';
import { MemberProfileModal } from './MemberProfileModal';

interface LeagueDashboardProps {
  leagues: League[];
  activeLeagueId: string;
  onSelectLeague: (leagueId: string) => void;
  onCreateLeague: (data: any) => void;
  onJoinCode: (code: string) => void;
  onStartPractice: (pageNumber?: number) => void;
  onNavigateHome: () => void;
  theme: MushafTheme;
}

export const LeagueDashboard: React.FC<LeagueDashboardProps> = ({
  leagues,
  activeLeagueId,
  onSelectLeague,
  onCreateLeague,
  onJoinCode,
  onStartPractice,
  onNavigateHome,
  theme,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [inspectingMember, setInspectingMember] = useState<LeagueMember | null>(null);
  const [showScoringRules, setShowScoringRules] = useState(false);

  const activeLeague = leagues.find(l => l.id === activeLeagueId) || leagues[0];
  const currentUserMember = activeLeague?.members.find(m => m.isCurrentUser);

  // Theme styling
  const themeClasses = {
    moonstone: {
      bg: 'bg-[#edf6f9] text-[#20373B]',
      headerBg: 'bg-white/90 border-[#519CAB]/20',
      cardBg: 'bg-white border-[#519CAB]/20 shadow-sm',
      cardHover: 'hover:border-[#519CAB]/40 hover:bg-[#f7fcfe]',
      accentBg: 'bg-[#519CAB] text-white hover:bg-[#438795]',
      accentText: 'text-[#519CAB]',
      progressFill: 'from-[#519CAB] via-[#519CAB] to-[#FFC64F]',
      subtleBox: 'bg-[#C3E7F1]/25 border-[#519CAB]/15',
    },
    parchment: {
      bg: 'bg-[#faf7f0] text-stone-900',
      headerBg: 'bg-[#fcfaf5]/90 border-amber-900/15',
      cardBg: 'bg-[#fcfaf5] border-amber-900/15 shadow-sm',
      cardHover: 'hover:border-amber-800/40 hover:bg-[#fffdf8]',
      accentBg: 'bg-amber-800 text-amber-50 hover:bg-amber-700',
      accentText: 'text-amber-800 dark:text-amber-300',
      progressFill: 'from-amber-600 via-amber-500 to-amber-700',
      subtleBox: 'bg-amber-900/5 border-amber-900/10',
    },
    emerald: {
      bg: 'bg-[#f3f7f4] text-[#0f281e]',
      headerBg: 'bg-white/90 border-emerald-900/15',
      cardBg: 'bg-white border-emerald-900/15 shadow-sm',
      cardHover: 'hover:border-emerald-700/40 hover:bg-[#f9fcfa]',
      accentBg: 'bg-emerald-800 text-emerald-50 hover:bg-emerald-700',
      accentText: 'text-emerald-800',
      progressFill: 'from-emerald-700 via-emerald-500 to-teal-600',
      subtleBox: 'bg-emerald-950/5 border-emerald-800/10',
    },
    midnight: {
      bg: 'bg-[#0f1316] text-[#f1ece1]',
      headerBg: 'bg-[#161b20]/90 border-stone-800',
      cardBg: 'bg-[#161b20] border-stone-800 shadow-md',
      cardHover: 'hover:border-amber-400/40 hover:bg-[#1a2128]',
      accentBg: 'bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold',
      accentText: 'text-amber-400',
      progressFill: 'from-amber-500 via-yellow-400 to-amber-600',
      subtleBox: 'bg-stone-800/60 border-stone-700/50',
    },
    'classic-white': {
      bg: 'bg-[#f8f9fa] text-stone-900',
      headerBg: 'bg-white/90 border-stone-200',
      cardBg: 'bg-white border-stone-200 shadow-sm',
      cardHover: 'hover:border-stone-400 hover:bg-stone-50',
      accentBg: 'bg-stone-900 text-white hover:bg-stone-800',
      accentText: 'text-stone-900',
      progressFill: 'from-stone-800 via-stone-700 to-stone-900',
      subtleBox: 'bg-stone-100 border-stone-200',
    },
  }[theme];

  if (!activeLeague) return null;

  const userTier = currentUserMember ? getTierFromRank(currentUserMember.rank, activeLeague.members.length) : null;

  return (
    <div className={`min-h-full w-full overflow-y-auto ${themeClasses.bg} pb-16 transition-colors duration-300`}>
      
      {/* Top Header Navigation */}
      <header className={`sticky top-0 z-30 w-full backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between transition-colors ${themeClasses.headerBg}`}>
        
        {/* Left: Back to Dashboard & League Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateHome();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Back to Home Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-5 w-[1px] bg-black/10 dark:bg-white/10" />

          {/* League Dropdown Selector */}
          <div className="relative">
            <select
              value={activeLeague.id}
              onChange={(e) => {
                triggerHaptic('light');
                onSelectLeague(e.target.value);
              }}
              className="appearance-none bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl px-3 py-1.5 pr-8 font-display font-bold text-sm sm:text-base border border-amber-900/10 dark:border-stone-700 cursor-pointer focus:outline-none"
            >
              {leagues.map((l) => (
                <option key={l.id} value={l.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                  🏆 {l.name} ({l.challengeStructure})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>
        </div>

        {/* Right: Quick League Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsJoinOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-amber-900/15 dark:border-stone-700 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="hidden sm:inline">Join with Code</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsCreateOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-800 text-amber-50 hover:bg-amber-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create League</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* HERO SECTION: LEAGUE IDENTITY & TARGET */}
        <section className={`relative rounded-3xl p-5 sm:p-7 md:p-8 border overflow-hidden ${themeClasses.cardBg}`}>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2 flex-1 max-w-2xl">
              
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-800/10 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px] border border-amber-800/20">
                  {activeLeague.challengeStructure.replace('-', ' ')} Challenge
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono text-[11px] font-bold opacity-80 border border-black/10 dark:border-white/10">
                  Code: {activeLeague.inviteCode}
                </span>

                <span className="text-xs opacity-60">
                  Created by {activeLeague.creatorName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight">
                {activeLeague.name}
              </h1>

              <p className="text-xs sm:text-sm opacity-80 leading-relaxed text-balance">
                {activeLeague.target.description}
              </p>

              {/* Quran Range indicator */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs opacity-75">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>
                    Range: {activeLeague.target.startPage ? `Pages ${activeLeague.target.startPage} - ${activeLeague.target.endPage || activeLeague.target.startPage}` : activeLeague.target.targetAmount + ' ' + activeLeague.target.targetUnit}
                  </span>
                </span>
                
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>{activeLeague.members.length} Members in Circle</span>
                </span>
              </div>

            </div>

            {/* League CTA Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('celebrate');
                  onStartPractice(activeLeague.target.startPage || 582);
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer ${themeClasses.accentBg}`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Practice League Range</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsShareOpen(true);
                }}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${themeClasses.subtleBox} hover:opacity-100 opacity-90`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Invite Friends (Code: {activeLeague.inviteCode})</span>
              </button>
            </div>

          </div>
        </section>

        {/* SECTION 2: YOUR STANDING & TODAY'S TARGET CARD */}
        {currentUserMember && (
          <section className={`p-5 sm:p-6 rounded-3xl border ${themeClasses.cardBg}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              
              {/* Member overview */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center text-2xl font-bold shadow-md">
                  {currentUserMember.avatarEmoji || '🌟'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                      Your League Standing
                    </span>
                    {userTier && (
                      <span className={`px-2 py-0.5 rounded-lg border font-bold text-[10px] ${userTier.color}`}>
                        {userTier.badge} {userTier.label}
                      </span>
                    )}
                  </div>

                  <div className="text-xl sm:text-2xl font-display font-extrabold flex items-center gap-2">
                    <span>Rank #{currentUserMember.rank}</span>
                    <span className="text-base font-normal opacity-60">of {activeLeague.members.length} members</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      {currentUserMember.points} Total XP
                    </span>
                    <span className="opacity-60">•</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      +{currentUserMember.todayPoints} XP Today
                    </span>
                    <span className="opacity-60">•</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{currentUserMember.streakDays}-day streak</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Today Status */}
              <div className="w-full md:w-80 space-y-2 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-amber-900/10 dark:border-stone-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-700" />
                    <span>League Target Progress</span>
                  </span>
                  <span className="font-mono font-bold">{currentUserMember.progressPercent}%</span>
                </div>

                <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${themeClasses.progressFill}`}
                    style={{ width: `${Math.max(currentUserMember.progressPercent, 5)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="opacity-75 font-mono">
                    {currentUserMember.progressCurrent} / {currentUserMember.progressTarget} {activeLeague.target.targetUnit}
                  </span>
                  
                  {currentUserMember.completedToday ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Today's Target Met!</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due Today</span>
                    </span>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* SECTION 3: MIMO-STYLE SOCIAL LEADERBOARD */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg sm:text-xl font-display font-bold tracking-tight">
                  League Leaderboard
                </h2>
              </div>
              <p className="text-xs opacity-75">
                Top memorizers advance to higher tiers based on active Hifz and retention accuracy
              </p>
            </div>

            {/* Points scoring guide button */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setShowScoringRules(!showScoringRules);
              }}
              className="text-xs text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium cursor-pointer self-start sm:self-auto"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How Scoring & XP Works</span>
            </button>
          </div>

          {/* Scoring Rules Drawer if open */}
          {showScoringRules && (
            <div className={`p-4 rounded-2xl border ${themeClasses.cardBg} space-y-2 animate-in fade-in duration-200`}>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Meaningful Hifz Scoring System</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Points in Mushaf Hafiz are tied directly to actual Quran memorization activity, avoiding pointless grind:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-sm block">+{SCORING_RULES.AYAH_CORRECT} XP</span>
                  <span className="text-[11px] opacity-75">Correct Ayah Blank</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-sm block">+{SCORING_RULES.PAGE_COMPLETED} XP</span>
                  <span className="text-[11px] opacity-75">Page Testing Completed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-sm block">+{SCORING_RULES.DAILY_TARGET_MET} XP</span>
                  <span className="text-[11px] opacity-75">Daily Target Reached</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-sm block">+{SCORING_RULES.STREAK_BONUS_PER_DAY} XP/day</span>
                  <span className="text-[11px] opacity-75">Consecutive Streak Bonus</span>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table / Cards */}
          <div className={`rounded-3xl border overflow-hidden ${themeClasses.cardBg}`}>
            
            {/* Header / Promotion Zone notice */}
            <div className="px-5 py-3 border-b border-amber-900/10 dark:border-stone-800 bg-amber-800/5 dark:bg-stone-900/40 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Top 3 Promotion Zone (Gold & Silver Tiers)</span>
              </span>
              <span className="opacity-60 text-[11px]">Tap member for 7-day activity</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/5">
              {activeLeague.members.map((member, idx) => {
                const isTop3 = member.rank <= 3;
                const tier = getTierFromRank(member.rank, activeLeague.members.length);

                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      triggerHaptic('light');
                      setInspectingMember(member);
                    }}
                    className={`px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-4 transition-all cursor-pointer ${
                      member.isCurrentUser
                        ? 'bg-amber-500/10 hover:bg-amber-500/15'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    
                    {/* Rank & Avatar */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      
                      {/* Rank Position */}
                      <div className="w-7 sm:w-8 text-center flex items-center justify-center font-mono font-black text-sm sm:text-base">
                        {member.rank === 1 && <span className="text-xl">🥇</span>}
                        {member.rank === 2 && <span className="text-xl">🥈</span>}
                        {member.rank === 3 && <span className="text-xl">🥉</span>}
                        {member.rank > 3 && (
                          <span className="opacity-60 font-semibold">{member.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-xs flex-shrink-0 ${member.avatarColor}`}>
                        {member.avatarEmoji || member.name[0]}
                      </div>

                      {/* Name & status */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-bold text-sm truncate">
                            {member.name}
                          </span>
                          {member.isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-800 text-amber-50 text-[10px] font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] opacity-70 truncate max-w-[180px] sm:max-w-xs">
                          {member.statusMessage || `Progress: ${member.progressCurrent}/${member.progressTarget} ${activeLeague.target.targetUnit}`}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Today's Target Status & Streak */}
                    <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                      {/* Streak */}
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{member.streakDays}d</span>
                      </div>

                      {/* Today Target Status */}
                      {member.completedToday ? (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done Today</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 text-stone-500 dark:text-stone-400 font-medium text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 opacity-60" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    {/* Right: Progress % & Points */}
                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0 text-right">
                      
                      {/* Progress bar preview */}
                      <div className="hidden md:flex flex-col items-end gap-1 w-24">
                        <span className="text-[10px] font-mono opacity-70">
                          {member.progressCurrent}/{member.progressTarget} {activeLeague.target.targetUnit}
                        </span>
                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${Math.max(member.progressPercent, 4)}%` }}
                          />
                        </div>
                      </div>

                      {/* Points (XP) */}
                      <div className="text-right">
                        <div className="font-mono font-black text-sm sm:text-base text-amber-800 dark:text-amber-400 tabular-nums">
                          {member.points} <span className="text-[11px] font-sans font-bold">XP</span>
                        </div>
                        {member.todayPoints > 0 && (
                          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            +{member.todayPoints} today
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* SECTION 4: LIVE HALAQAH ACTIVITY FEED */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-display font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Circle Activity Stream</span>
            </h2>
            <span className="text-xs opacity-60">Real-time peer milestones</span>
          </div>

          <div className={`p-4 sm:p-5 rounded-3xl border ${themeClasses.cardBg} space-y-3`}>
            {activeLeague.activityFeed.length === 0 ? (
              <p className="text-xs opacity-60 text-center py-4">
                No activity yet. Start testing blanks to earn points and inspire your circle!
              </p>
            ) : (
              <div className="space-y-2.5">
                {activeLeague.activityFeed.slice(0, 8).map((feed) => {
                  const minutesAgo = Math.max(1, Math.round((Date.now() - feed.timestamp) / (1000 * 60)));
                  const timeFormatted = minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.round(minutesAgo / 60)}h ago`;

                  return (
                    <div 
                      key={feed.id}
                      className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base flex-shrink-0">
                          {feed.type === 'page' && '📖'}
                          {feed.type === 'ayah' && '🎯'}
                          {feed.type === 'streak' && '🔥'}
                          {feed.type === 'target_met' && '🎉'}
                          {feed.type === 'joined' && '👋'}
                        </span>
                        
                        <div className="truncate">
                          <strong className="font-semibold text-stone-900 dark:text-stone-100">
                            {feed.memberName}
                          </strong>{' '}
                          <span className="opacity-80">{feed.actionText}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                          +{feed.pointsEarned} XP
                        </span>
                        <span className="text-[10px] opacity-50 font-mono">
                          {timeFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Modals */}
      <CreateLeagueModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateLeague={onCreateLeague}
        theme={theme}
      />

      <JoinLeagueModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoinCode={onJoinCode}
        availableLeagues={leagues}
        theme={theme}
      />

      <ShareInviteModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        league={activeLeague}
        theme={theme}
      />

      <MemberProfileModal
        member={inspectingMember}
        onClose={() => setInspectingMember(null)}
        targetDescription={activeLeague.target.description}
        theme={theme}
      />

    </div>
  );
};
