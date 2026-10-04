import React, { useState } from 'react';
import { 
  Trophy, Flame, Users, Plus, KeyRound, Share2, CheckCircle2, 
  Clock, ArrowRight, Play, Sparkles, BookOpen, ChevronRight, 
  HelpCircle, Shield, Award, Calendar, ArrowLeft, Layers, Target, ChevronDown,
  Copy, Check
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
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'activity' | 'rules'>('leaderboard');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeLeague = leagues.find(l => l.id === activeLeagueId) || leagues[0];
  const currentUserMember = activeLeague?.members.find(m => m.isCurrentUser);

  // Theme styling
  const themeClasses = {
    moonstone: {
      bg: 'bg-white text-[#20373B]',
      headerBg: 'bg-white/95 backdrop-blur-md border-[#519CAB]/20',
      cardBg: 'bg-white border-[#519CAB]/20 shadow-sm',
      cardHover: 'hover:border-[#519CAB]/40 hover:bg-stone-50',
      accentBg: 'bg-[#519CAB] text-white hover:bg-[#438795]',
      accentText: 'text-[#519CAB]',
      progressFill: 'from-[#519CAB] via-[#519CAB] to-[#FFC64F]',
      subtleBox: 'bg-white border border-[#519CAB]/25',
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
      <header className={`sticky top-0 z-30 w-full backdrop-blur-md border-b px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 transition-colors ${themeClasses.headerBg}`}>
        
        {/* Left: Back to Dashboard & League Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateHome();
            }}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold flex-shrink-0"
            title="Back to Home Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-4 sm:h-5 w-[1px] bg-black/10 dark:bg-white/10 flex-shrink-0" />

          {/* League Dropdown Selector */}
          <div className="relative min-w-0 max-w-[140px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
            <select
              value={activeLeague.id}
              onChange={(e) => {
                triggerHaptic('light');
                onSelectLeague(e.target.value);
              }}
              className="appearance-none w-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl px-2.5 sm:px-3 py-1.5 pr-7 sm:pr-8 font-display font-bold text-xs sm:text-base border border-black/10 dark:border-white/10 cursor-pointer focus:outline-none truncate"
            >
              {leagues.map((l) => (
                <option key={l.id} value={l.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                  🏆 {l.name} ({l.challengeStructure})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>
        </div>

        {/* Right: Quick League Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsJoinOpen(true);
            }}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Join with invite code"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#519CAB]" />
            <span className="hidden sm:inline">Join with Code</span>
            <span className="inline sm:hidden">Join</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsCreateOpen(true);
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer ${themeClasses.accentBg}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create League</span>
            <span className="inline sm:hidden">Create</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* UNIFIED HERO CARD: Quick League Info & Your Personal Standing (Neat & Clean like HomeScreen) */}
        <section className={`rounded-3xl p-4 sm:p-6 md:p-7 border overflow-hidden ${themeClasses.cardBg}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* Left: League Info & Target */}
            <div className="space-y-2.5 flex-1 min-w-0">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${
                  theme === 'moonstone' 
                    ? 'bg-[#519CAB]/10 text-[#519CAB] border-[#519CAB]/20' 
                    : 'bg-amber-800/10 text-amber-800 dark:text-amber-400 border-amber-800/20'
                }`}>
                  {activeLeague.challengeStructure.replace('-', ' ')}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono text-[11px] font-bold opacity-80 border border-black/10 dark:border-white/10">
                  Code: {activeLeague.inviteCode}
                </span>

                <span className="text-[11px] opacity-60">
                  {activeLeague.members.length} Members
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold tracking-tight truncate">
                {activeLeague.name}
              </h1>

              <div className="flex items-center gap-2 text-xs opacity-80">
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-[#519CAB]" />
                <span className="font-semibold">
                  {activeLeague.target.startPage ? `Pages ${activeLeague.target.startPage} - ${activeLeague.target.endPage || activeLeague.target.startPage}` : `${activeLeague.target.targetAmount} ${activeLeague.target.targetUnit}`}
                </span>
                <span className="opacity-40">•</span>
                <span className="truncate">{activeLeague.target.description}</span>
              </div>

              {/* User Standing Quick Pill (HomeScreen style) */}
              {currentUserMember && (
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                  <div className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 border ${
                    theme === 'moonstone'
                      ? 'bg-stone-50 border-[#519CAB]/25 text-[#20373B]'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                  }`}>
                    <span>{currentUserMember.rank === 1 ? '🥇' : currentUserMember.rank === 2 ? '🥈' : currentUserMember.rank === 3 ? '🥉' : '🎖️'}</span>
                    <span>Rank #{currentUserMember.rank} of {activeLeague.members.length}</span>
                    <span className="opacity-40">•</span>
                    <span className="font-mono font-black">{currentUserMember.points} XP</span>
                    <span className="opacity-40">•</span>
                    <span className="text-orange-600 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-current" />
                      {currentUserMember.streakDays}d
                    </span>
                  </div>

                  {currentUserMember.completedToday ? (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Today's Target Met!</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[11px] flex items-center gap-1 border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      <span>Due Today ({currentUserMember.progressCurrent}/{currentUserMember.progressTarget})</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Quick CTA Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto flex-shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('celebrate');
                  onStartPractice(activeLeague.target.startPage || 582);
                }}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer ${themeClasses.accentBg}`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Practice League Range</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsShareOpen(true);
                }}
                className={`w-full sm:w-auto px-4 py-2 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${themeClasses.subtleBox} opacity-90 hover:opacity-100`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Invite Friends</span>
              </button>
            </div>

          </div>
        </section>

        {/* SEGMENTED TAB CONTROLLER (Leaderboard | Activity | Info & Rules) */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('leaderboard');
            }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('activity');
            }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'activity'
                ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Circle Stream</span>
            <span className="xs:hidden">Activity</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('rules');
            }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rules'
                ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Info & Rules</span>
            <span className="xs:hidden">Rules</span>
          </button>
        </div>

        {/* TAB 1: SOCIAL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <section className="space-y-3 animate-in fade-in duration-200">
            {/* Promotion Zone Notice */}
            <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Top 3 Promotion Zone (Gold & Silver Tiers)</span>
              </span>
              <span className="opacity-60 text-[11px] hidden sm:inline">Tap member for 7-day stats</span>
            </div>

            {/* Leaderboard Table / Cards */}
            <div className={`rounded-3xl border overflow-hidden ${themeClasses.cardBg}`}>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {activeLeague.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      triggerHaptic('light');
                      setInspectingMember(member);
                    }}
                    className={`px-3 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-4 transition-all cursor-pointer ${
                      member.isCurrentUser
                        ? 'bg-amber-500/10 hover:bg-amber-500/15'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    
                    {/* Rank & Avatar & Name */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      
                      {/* Rank Position */}
                      <div className="w-6 sm:w-8 text-center flex items-center justify-center font-mono font-black text-sm sm:text-base flex-shrink-0">
                        {member.rank === 1 && <span className="text-lg sm:text-xl">🥇</span>}
                        {member.rank === 2 && <span className="text-lg sm:text-xl">🥈</span>}
                        {member.rank === 3 && <span className="text-lg sm:text-xl">🥉</span>}
                        {member.rank > 3 && (
                          <span className="opacity-60 font-semibold">{member.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold shadow-2xs flex-shrink-0 ${member.avatarColor}`}>
                        {member.avatarEmoji || member.name[0]}
                      </div>

                      {/* Name & status */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-bold text-xs sm:text-sm truncate max-w-[120px] xs:max-w-[170px] sm:max-w-none">
                            {member.name}
                          </span>
                          {member.isCurrentUser && (
                            <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                              theme === 'moonstone' ? 'bg-[#519CAB] text-white' : 'bg-amber-800 text-amber-50'
                            }`}>
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] sm:text-[11px] opacity-70 truncate max-w-[130px] xs:max-w-[200px] sm:max-w-xs">
                          {member.statusMessage || `Progress: ${member.progressCurrent}/${member.progressTarget} ${activeLeague.target.targetUnit}`}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Today's Target Status & Streak */}
                    <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{member.streakDays}d</span>
                      </div>

                      {member.completedToday ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Done</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 text-stone-500 dark:text-stone-400 font-medium text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 opacity-60" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    {/* Right: Points (XP) & Mobile Streak */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 text-right">
                      <div className="text-right">
                        <div className={`font-mono font-black text-xs sm:text-base tabular-nums ${
                          theme === 'moonstone' ? 'text-[#20373B]' : 'text-amber-800 dark:text-amber-400'
                        }`}>
                          {member.points} <span className="text-[10px] sm:text-[11px] font-sans font-bold">XP</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="sm:hidden font-mono text-[10px] text-orange-600 font-bold flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 fill-current" />
                            {member.streakDays}d
                          </span>
                          {member.todayPoints > 0 && (
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              +{member.todayPoints}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Quick footer hint to rules */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('rules');
                }}
                className="text-xs text-[#519CAB] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>How are points and XP calculated?</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        )}

        {/* TAB 2: LIVE HALAQAH ACTIVITY STREAM */}
        {activeTab === 'activity' && (
          <section className="space-y-3 animate-in fade-in duration-200">
            <div className={`p-4 sm:p-5 rounded-3xl border ${themeClasses.cardBg} space-y-3`}>
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Real-Time Circle Milestones</span>
                </h2>
                <span className="text-xs opacity-60">Live feed</span>
              </div>

              {activeLeague.activityFeed.length === 0 ? (
                <p className="text-xs opacity-60 text-center py-6">
                  No activity yet. Start testing blanks to earn points and inspire your circle!
                </p>
              ) : (
                <div className="space-y-2">
                  {activeLeague.activityFeed.slice(0, 15).map((feed) => {
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
        )}

        {/* TAB 3: LEAGUE INFO & SCORING RULES */}
        {activeTab === 'rules' && (
          <section className="space-y-4 animate-in fade-in duration-200">
            {/* League Details Card */}
            <div className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${themeClasses.cardBg}`}>
              <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#519CAB]" />
                <span>Circle Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                  <span className="opacity-60 text-[11px]">Target Description</span>
                  <p className="font-medium">{activeLeague.target.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                  <span className="opacity-60 text-[11px]">Memorization Range</span>
                  <p className="font-medium">
                    {activeLeague.target.startPage ? `Pages ${activeLeague.target.startPage} - ${activeLeague.target.endPage || activeLeague.target.startPage}` : `${activeLeague.target.targetAmount} ${activeLeague.target.targetUnit}`}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                  <span className="opacity-60 text-[11px]">Circle Creator</span>
                  <p className="font-medium">{activeLeague.creatorName}</p>
                </div>

                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                  <span className="opacity-60 text-[11px]">Invite Code</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm tracking-wider">{activeLeague.inviteCode}</span>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('success');
                        navigator.clipboard?.writeText(activeLeague.inviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-2 py-1 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Meaningful Hifz Scoring Guide */}
            <div className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${themeClasses.cardBg}`}>
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Meaningful Hifz Scoring System</span>
                </h2>
                <p className="text-xs opacity-75">
                  Points in Mushaf Hafiz are tied directly to actual Quran memorization activity, avoiding pointless grind:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center space-y-1">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-base block">+{SCORING_RULES.AYAH_CORRECT} XP</span>
                  <span className="text-[11px] opacity-75 leading-tight block">Correct Ayah Blank</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center space-y-1">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-base block">+{SCORING_RULES.PAGE_COMPLETED} XP</span>
                  <span className="text-[11px] opacity-75 leading-tight block">Page Testing Completed</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center space-y-1">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-base block">+{SCORING_RULES.DAILY_TARGET_MET} XP</span>
                  <span className="text-[11px] opacity-75 leading-tight block">Daily Target Met</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center space-y-1">
                  <span className="font-mono font-black text-amber-800 dark:text-amber-400 text-base block">+{SCORING_RULES.STREAK_BONUS_PER_DAY} XP/d</span>
                  <span className="text-[11px] opacity-75 leading-tight block">Streak Bonus</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${themeClasses.cardBg}`}>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Looking for another circle?</h3>
                <p className="text-xs opacity-70">Join a friend's league or create your own custom group</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setIsJoinOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 text-xs font-bold cursor-pointer"
                >
                  Join Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    setIsCreateOpen(true);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${themeClasses.accentBg}`}
                >
                  Create Circle
                </button>
              </div>
            </div>

          </section>
        )}

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
