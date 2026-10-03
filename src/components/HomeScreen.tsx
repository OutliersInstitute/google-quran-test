import React, { useState } from 'react';
import { 
  User, BookOpen, Trophy, BarChart3, Settings, Play, Target, 
  Flame, CheckCircle2, ChevronRight, Edit3, Check, Compass, Sparkles
} from 'lucide-react';
import { 
  DailyTargetConfig, GoalProgressSummary, DailyProgressData, 
  DailyHistoryRecord, MushafTheme, League 
} from '../types';
import { loadUserName, saveUserName } from '../utils/leagueEngine';
import { triggerHaptic } from '../utils/haptics';
import { MyJourneyModal } from './MyJourneyModal';
import { ProgressCheckerModal } from './ProgressCheckerModal';

interface HomeScreenProps {
  activeTarget: DailyTargetConfig;
  goalSummary: GoalProgressSummary;
  dailyProgress: DailyProgressData;
  historyRecords: DailyHistoryRecord[];
  currentPageNumber: number;
  theme: MushafTheme;
  mistakesCount: number;
  activeLeague?: League;
  onNavigateLeagues?: () => void;
  onOpenDailyTarget: () => void;
  onSaveTarget?: (newTarget: DailyTargetConfig) => void;
  onStartPractice: (pageNumber?: number) => void;
  onOpenSettings: () => void;
  onOpenSurahPicker: () => void;
  onOpenPagePicker: () => void;
  onOpenReview: () => void;
  onChangeTheme: (theme: MushafTheme) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeTarget,
  goalSummary,
  dailyProgress,
  historyRecords,
  currentPageNumber,
  theme,
  mistakesCount,
  activeLeague,
  onNavigateLeagues,
  onOpenDailyTarget,
  onSaveTarget,
  onStartPractice,
  onOpenSettings,
  onOpenSurahPicker,
  onOpenPagePicker,
  onOpenReview,
  onChangeTheme,
}) => {
  const [userName, setUserName] = useState<string>(() => loadUserName());
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(userName);

  // Modals for the 3 buttons
  const [isJourneyOpen, setIsJourneyOpen] = useState<boolean>(false);
  const [isProgressCheckerOpen, setIsProgressCheckerOpen] = useState<boolean>(false);

  // Theme styling
  const themeClasses = {
    moonstone: {
      bg: 'bg-[#edf6f9] text-[#20373B]',
      headerBg: 'bg-white/85 backdrop-blur-md border-[#519CAB]/20',
      cardBg: 'bg-white border-2 border-[#519CAB]/25 shadow-xl shadow-[#519CAB]/10',
      cardHover: 'hover:border-[#519CAB]/50 hover:bg-[#fafdfe]',
      accentBg: 'bg-[#519CAB] text-white hover:bg-[#438795]',
      accentText: 'text-[#519CAB]',
      btnSecondary: 'bg-white hover:bg-[#f4fafc] border-2 border-[#519CAB]/30 text-[#20373B]',
      subtleBox: 'bg-[#C3E7F1]/30 border border-[#519CAB]/20',
      avatarBg: 'bg-gradient-to-tr from-[#20373B] via-[#20373B] to-[#519CAB]',
      avatarRing: 'ring-4 ring-[#519CAB]/25',
      avatarIcon: 'text-[#C3E7F1]',
      editBadge: 'bg-[#FFC64F] text-[#20373B]',
      journeyBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-md shadow-[#519CAB]/20',
      journeyIconBg: 'bg-[#20373B]/30 text-[#FFC64F]',
      journeySubtext: 'text-[#C3E7F1]',
      leaguesIconBg: 'bg-[#C3E7F1]/50 text-[#519CAB]',
      checkerIconBg: 'bg-[#C3E7F1]/50 text-[#20373B]',
      headerIconBg: 'bg-[#519CAB] text-[#FFC64F]',
    },
    parchment: {
      bg: 'bg-[#faf7f0] text-stone-900',
      headerBg: 'bg-[#fcfaf5]/90 border-amber-900/15',
      cardBg: 'bg-[#fcfaf5] border-amber-900/20 shadow-xl',
      cardHover: 'hover:border-amber-800/40 hover:bg-[#fffdf8]',
      accentBg: 'bg-amber-800 text-amber-50 hover:bg-amber-700',
      accentText: 'text-amber-800 dark:text-amber-300',
      btnSecondary: 'bg-white hover:bg-amber-50/80 border-amber-900/15 text-stone-900',
      subtleBox: 'bg-amber-900/5 border-amber-900/10',
      avatarBg: 'bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-900',
      avatarRing: 'ring-4 ring-amber-700/20',
      avatarIcon: 'text-amber-200',
      editBadge: 'bg-amber-800 text-amber-50',
      journeyBtn: 'bg-amber-800 hover:bg-amber-700 text-amber-50 shadow-md',
      journeyIconBg: 'bg-amber-700/80 text-amber-100',
      journeySubtext: 'text-amber-100/80',
      leaguesIconBg: 'bg-amber-900/10 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400',
      checkerIconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      headerIconBg: 'bg-amber-800 text-amber-200',
    },
    emerald: {
      bg: 'bg-[#f3f7f4] text-[#0f281e]',
      headerBg: 'bg-white/90 border-emerald-900/15',
      cardBg: 'bg-white border-emerald-900/20 shadow-xl',
      cardHover: 'hover:border-emerald-700/40 hover:bg-[#f9fcfa]',
      accentBg: 'bg-emerald-800 text-emerald-50 hover:bg-emerald-700',
      accentText: 'text-emerald-800',
      btnSecondary: 'bg-white hover:bg-emerald-50/80 border-emerald-900/15 text-[#0f281e]',
      subtleBox: 'bg-emerald-950/5 border-emerald-800/10',
      avatarBg: 'bg-gradient-to-tr from-emerald-800 to-teal-700',
      avatarRing: 'ring-4 ring-emerald-700/20',
      avatarIcon: 'text-emerald-200',
      editBadge: 'bg-emerald-800 text-emerald-50',
      journeyBtn: 'bg-emerald-800 hover:bg-emerald-700 text-emerald-50 shadow-md',
      journeyIconBg: 'bg-emerald-700/80 text-emerald-100',
      journeySubtext: 'text-emerald-100/80',
      leaguesIconBg: 'bg-emerald-900/10 text-emerald-800',
      checkerIconBg: 'bg-emerald-500/10 text-emerald-600',
      headerIconBg: 'bg-emerald-800 text-emerald-200',
    },
    midnight: {
      bg: 'bg-[#0f1316] text-[#f1ece1]',
      headerBg: 'bg-[#161b20]/90 border-stone-800',
      cardBg: 'bg-[#161b20] border-stone-800 shadow-2xl',
      cardHover: 'hover:border-amber-400/40 hover:bg-[#1a2128]',
      accentBg: 'bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold',
      accentText: 'text-amber-400',
      btnSecondary: 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-100',
      subtleBox: 'bg-stone-800/60 border-stone-700/50',
      avatarBg: 'bg-gradient-to-tr from-stone-800 to-amber-700',
      avatarRing: 'ring-4 ring-amber-500/20',
      avatarIcon: 'text-amber-300',
      editBadge: 'bg-amber-500 text-stone-950',
      journeyBtn: 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md font-bold',
      journeyIconBg: 'bg-stone-900 text-amber-400',
      journeySubtext: 'text-stone-900/80',
      leaguesIconBg: 'bg-stone-800 text-amber-400',
      checkerIconBg: 'bg-stone-800 text-orange-400',
      headerIconBg: 'bg-amber-500 text-stone-950',
    },
    'classic-white': {
      bg: 'bg-[#f8f9fa] text-stone-900',
      headerBg: 'bg-white/90 border-stone-200',
      cardBg: 'bg-white border-stone-200 shadow-xl',
      cardHover: 'hover:border-stone-400 hover:bg-stone-50',
      accentBg: 'bg-stone-900 text-white hover:bg-stone-800',
      accentText: 'text-stone-900',
      btnSecondary: 'bg-white hover:bg-stone-50 border-stone-200 text-stone-900',
      subtleBox: 'bg-stone-100 border-stone-200',
      avatarBg: 'bg-gradient-to-tr from-stone-700 to-stone-900',
      avatarRing: 'ring-4 ring-stone-400/20',
      avatarIcon: 'text-stone-200',
      editBadge: 'bg-stone-900 text-white',
      journeyBtn: 'bg-stone-900 hover:bg-stone-800 text-white shadow-md',
      journeyIconBg: 'bg-stone-800 text-stone-100',
      journeySubtext: 'text-stone-300',
      leaguesIconBg: 'bg-stone-100 text-stone-800',
      checkerIconBg: 'bg-stone-100 text-stone-800',
      headerIconBg: 'bg-stone-900 text-white',
    },
  }[theme] || {
    bg: 'bg-[#edf6f9] text-[#20373B]',
    headerBg: 'bg-white/85 backdrop-blur-md border-[#519CAB]/20',
    cardBg: 'bg-white border-2 border-[#519CAB]/25 shadow-xl shadow-[#519CAB]/10',
    cardHover: 'hover:border-[#519CAB]/50 hover:bg-[#fafdfe]',
    accentBg: 'bg-[#519CAB] text-white hover:bg-[#438795]',
    accentText: 'text-[#519CAB]',
    btnSecondary: 'bg-white hover:bg-[#f4fafc] border-2 border-[#519CAB]/30 text-[#20373B]',
    subtleBox: 'bg-[#C3E7F1]/30 border border-[#519CAB]/20',
    avatarBg: 'bg-gradient-to-tr from-[#20373B] via-[#20373B] to-[#519CAB]',
    avatarRing: 'ring-4 ring-[#519CAB]/25',
    avatarIcon: 'text-[#C3E7F1]',
    editBadge: 'bg-[#FFC64F] text-[#20373B]',
    journeyBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-md shadow-[#519CAB]/20',
    journeyIconBg: 'bg-[#20373B]/30 text-[#FFC64F]',
    journeySubtext: 'text-[#C3E7F1]',
    leaguesIconBg: 'bg-[#C3E7F1]/50 text-[#519CAB]',
    checkerIconBg: 'bg-[#C3E7F1]/50 text-[#20373B]',
    headerIconBg: 'bg-[#519CAB] text-[#FFC64F]',
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      const trimmed = tempName.trim();
      setUserName(trimmed);
      saveUserName(trimmed);
      setIsEditingName(false);
      triggerHaptic('light');
    }
  };

  const currentLeagueMember = activeLeague?.members.find(m => m.isCurrentUser);

  return (
    <div className={`min-h-full w-full flex flex-col justify-between ${themeClasses.bg} transition-colors duration-300`}>
      
      {/* Minimal Top Header */}
      <header className={`w-full backdrop-blur-md border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${themeClasses.headerBg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${themeClasses.headerIconBg}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight">
              Mushaf Hafiz
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs opacity-60 font-serif">
              حِفْظُ المَدِينَةِ • Medina Mushaf Memorizer
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
          title="Open Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Decluttered Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        
        {/* The Clean Main Card */}
        <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 sm:py-10 border ${themeClasses.cardBg} flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-300 relative`}>
          
          {/* Top Middle: Profile Icon & User Name */}
          <div className="flex flex-col items-center space-y-3">
            
            {/* Profile Avatar Circle with elegant ring */}
            <div className="relative group cursor-pointer" onClick={() => setIsEditingName(true)}>
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg transition-transform group-hover:scale-105 duration-200 ${themeClasses.avatarBg} ${themeClasses.avatarRing}`}>
                <User className={`w-10 h-10 sm:w-12 sm:h-12 ${themeClasses.avatarIcon}`} />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center shadow-xs ${themeClasses.editBadge}`}>
                <Edit3 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Name Underneath */}
            <div className="pt-1">
              {isEditingName ? (
                <div className="flex items-center gap-1.5 justify-center">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    placeholder="Your name"
                    autoFocus
                    className="px-3 py-1 text-center font-display font-bold text-lg sm:text-xl rounded-xl border border-[#519CAB] bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-[#519CAB]/40 text-[#20373B]"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-xl bg-[#519CAB] text-white cursor-pointer hover:bg-[#438795]"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                  className="group flex items-center justify-center gap-2 cursor-pointer"
                  title="Click to edit name"
                >
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                    {userName}
                  </h1>
                  <Edit3 className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              )}

              <p className="text-xs opacity-75 font-serif mt-1">
                طَالِبُ الحِفْظِ • Quran Memorizer
              </p>
            </div>

          </div>

          {/* THREE MAIN BUTTONS (User Friendly & Decluttered) */}
          <div className="w-full space-y-3.5 pt-2">
            
            {/* 1st Button: My Journey (continue testing / change target) */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsJourneyOpen(true);
              }}
              className={`w-full p-4 sm:p-4.5 rounded-2xl active:scale-98 transition-all cursor-pointer flex items-center justify-between text-left group ${themeClasses.journeyBtn}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${themeClasses.journeyIconBg}`}>
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-base sm:text-lg leading-tight flex items-center gap-2">
                    <span>My Journey</span>
                    {goalSummary.isComplete && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FFC64F] text-[#20373B] font-sans text-[10px] font-extrabold shadow-2xs">
                        Target Met!
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mt-0.5 ${themeClasses.journeySubtext}`}>
                    Continue testing or change your target
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold opacity-90">
                <span className="hidden sm:inline-block truncate max-w-[130px]">
                  {activeTarget.title}
                </span>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 2nd Button: My Leagues (social halaqahs & leaderboard) */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                if (onNavigateLeagues) {
                  onNavigateLeagues();
                }
              }}
              className={`w-full p-4 sm:p-4.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left group active:scale-98 ${themeClasses.btnSecondary}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${themeClasses.leaguesIconBg}`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-base sm:text-lg leading-tight flex items-center gap-2">
                    <span>My Leagues</span>
                    {currentLeagueMember && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#519CAB]/15 text-[#519CAB] font-sans text-[10px] font-bold">
                        Rank #{currentLeagueMember.rank}
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-70 mt-0.5">
                    Halaqahs with friends & leaderboard
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#519CAB]">
                {currentLeagueMember && (
                  <span className="hidden sm:inline-block">
                    {currentLeagueMember.points} XP
                  </span>
                )}
                <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 3rd Button: Progress Checker (activities, streaks & history) */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsProgressCheckerOpen(true);
              }}
              className={`w-full p-4 sm:p-4.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left group active:scale-98 ${themeClasses.btnSecondary}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${themeClasses.checkerIconBg}`}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-base sm:text-lg leading-tight flex items-center gap-2">
                    <span>Progress Checker</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#FFC64F]/30 text-[#20373B] font-mono text-[10px] font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-[#FFC64F] fill-[#FFC64F]" />
                      <span>{dailyProgress.currentStreakDays}d streak</span>
                    </span>
                  </div>
                  <div className="text-xs opacity-70 mt-0.5">
                    Information on activities, streaks & Juz mastery
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#519CAB]">
                <span className="hidden sm:inline-block">
                  {dailyProgress.completedPages.length}p tested
                </span>
                <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>

          {/* Quick subtle status footer */}
          <div className="pt-1 flex items-center justify-center gap-4 text-xs opacity-75 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#519CAB]" />
              <span>Page {currentPageNumber} of 604</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#519CAB]" />
              <span>{goalSummary.formattedLabel}</span>
            </span>
          </div>

        </div>

      </main>

      {/* Modals for Journey and Progress Checker */}
      <MyJourneyModal
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
        activeTarget={activeTarget}
        goalSummary={goalSummary}
        currentPageNumber={currentPageNumber}
        onStartPractice={onStartPractice}
        onOpenDailyTarget={onOpenDailyTarget}
        onSaveTarget={onSaveTarget}
        onOpenSurahPicker={onOpenSurahPicker}
        onOpenPagePicker={onOpenPagePicker}
        theme={theme}
      />

      <ProgressCheckerModal
        isOpen={isProgressCheckerOpen}
        onClose={() => setIsProgressCheckerOpen(false)}
        dailyProgress={dailyProgress}
        historyRecords={historyRecords}
        mistakesCount={mistakesCount}
        onOpenReview={onOpenReview}
        onStartPractice={onStartPractice}
        theme={theme}
      />

      {/* Subtle bottom aesthetic hint */}
      <footer className="w-full text-center py-3 text-[11px] opacity-40 font-serif">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • Medina Uthmani Mushaf Testing
      </footer>

    </div>
  );
};
