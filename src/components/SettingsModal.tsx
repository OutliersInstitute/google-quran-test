import React from 'react';
import { 
  X, Settings, Sparkles, Layers, Sliders, Volume2, VolumeX, Eye, EyeOff, 
  RotateCcw, Shuffle, BookOpen, Bookmark, HelpCircle, Check, ArrowRight, 
  Zap, Palette, ShieldAlert, Award, Compass, FileText, Smartphone, Maximize2, Target, Home, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChallengeType, DifficultyLevel, MushafTheme, PageViewMode, PageRenderMode, Surah, PageRangeConfig, PageMarginConfig, PageMarginPreset, DailyTargetConfig, GoalProgressSummary } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Page Display Mode (Authentic Printed Medina Mushaf vs Digital Text)
  pageRenderMode: PageRenderMode;
  onChangePageRenderMode: (mode: PageRenderMode) => void;
  // Page Margins
  pageMargins: PageMarginConfig;
  onChangePageMargins: (margins: PageMarginConfig) => void;
  // Challenge Mode & Difficulty
  challengeType: ChallengeType;
  onChangeChallengeType: (type: ChallengeType) => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  // Page Layout (1 Page vs 2 Pages)
  pageViewMode: PageViewMode;
  onChangePageViewMode: (mode: PageViewMode) => void;
  isMobile?: boolean;
  // Blanks count per page
  blankCountChoice: number | 'all';
  onChangeBlankCountChoice: (count: number | 'all') => void;
  // Audio & Translation & Haptics
  autoPlayAudio: boolean;
  onToggleAutoPlayAudio: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  hapticsEnabled?: boolean;
  onToggleHaptics?: () => void;
  // Auto-advance
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  autoAdvanceOnCorrect?: boolean;
  onToggleAutoAdvanceOnCorrect?: () => void;
  // Multiple blanks in long ayahs
  allowMultiBlanksPerAyah?: boolean;
  onToggleMultiBlanksPerAyah?: () => void;
  // Theme
  theme: MushafTheme;
  onChangeTheme: (theme: MushafTheme) => void;
  // Actions
  onShuffleNewBlanks: () => void;
  onResetPageBlanks: () => void;
  onOpenSurahPicker: () => void;
  onOpenPagePicker: () => void;
  onOpenReview: () => void;
  onOpenHowToPlay: () => void;
  // Daily Target
  dailyTarget?: DailyTargetConfig;
  goalSummary?: GoalProgressSummary | null;
  onOpenDailyTarget?: () => void;
  // Stats & Info
  currentSurah: Surah;
  currentPageNumber: number;
  activeRange: PageRangeConfig | null;
  mistakesCount: number;
  totalAnswered: number;
  correctAnswers: number;
  onNavigateHome?: () => void;
  onNavigateLeagues?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  pageRenderMode,
  onChangePageRenderMode,
  pageMargins,
  onChangePageMargins,
  challengeType,
  onChangeChallengeType,
  difficulty,
  onChangeDifficulty,
  pageViewMode,
  onChangePageViewMode,
  isMobile = false,
  blankCountChoice,
  onChangeBlankCountChoice,
  autoPlayAudio,
  onToggleAutoPlayAudio,
  showTranslation,
  onToggleTranslation,
  hapticsEnabled = true,
  onToggleHaptics,
  autoAdvance,
  onToggleAutoAdvance,
  autoAdvanceOnCorrect = true,
  onToggleAutoAdvanceOnCorrect,
  allowMultiBlanksPerAyah = true,
  onToggleMultiBlanksPerAyah,
  theme,
  onChangeTheme,
  onShuffleNewBlanks,
  onResetPageBlanks,
  onOpenSurahPicker,
  onOpenPagePicker,
  onOpenReview,
  onOpenHowToPlay,
  dailyTarget,
  goalSummary,
  onOpenDailyTarget,
  currentSurah,
  currentPageNumber,
  activeRange,
  mistakesCount,
  totalAnswered,
  correctAnswers,
  onNavigateHome,
  onNavigateLeagues,
}) => {
  if (!isOpen) return null;

  const accuracyPct = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  const [activeTab, setActiveTab] = React.useState<'test' | 'mushaf' | 'audio' | 'tools'>('test');

  // Dynamic theme styling - in moonstone theme all light blue is replaced with pure white
  const st = {
    moonstone: {
      modalBg: 'bg-white text-[#20373B] border sm:border-2 border-[#519CAB]/30',
      headerBg: 'bg-white border-b border-[#519CAB]/20 text-[#20373B]',
      headerIcon: 'bg-[#519CAB] text-white',
      headerTitle: 'text-[#20373B]',
      headerSubtitle: 'text-[#20373B]/70',
      closeBtn: 'bg-stone-100 hover:bg-stone-200 text-[#20373B]',
      contextPill: 'bg-white border border-[#519CAB]/25 text-[#20373B]',
      contextIconBox: 'bg-[#519CAB] text-[#FFC64F]',
      btnAction: 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-xs',
      btnSecondary: 'bg-white hover:bg-stone-50 border border-[#519CAB]/25 text-[#20373B]',
      goalCard: 'bg-white border border-[#519CAB]/25 text-[#20373B]',
      goalIcon: 'text-[#519CAB]',
      goalFill: 'from-[#519CAB] via-[#519CAB] to-[#FFC64F]',
      sectionLabel: 'text-[#20373B]',
      sectionIcon: 'text-[#519CAB]',
      cardDefault: 'bg-white text-[#20373B] border-[#519CAB]/20 hover:border-[#519CAB]/40',
      cardSelected: 'bg-[#519CAB] text-white border-[#519CAB] shadow-md ring-2 ring-[#519CAB]/30',
      cardSubDefault: 'text-stone-500',
      cardSubSelected: 'text-white/90',
      toggleActive: 'bg-[#519CAB]',
      toggleInactive: 'bg-stone-300',
      itemCard: 'bg-white border border-[#519CAB]/20',
      itemIconBox: 'bg-stone-100 text-[#519CAB]',
      badgeActive: 'bg-[#519CAB]/10 text-[#519CAB]',
      sliderAccent: 'accent-[#519CAB]',
      footerBg: 'border-t border-[#519CAB]/20 bg-white text-[#20373B]',
    },
    parchment: {
      modalBg: 'bg-[#fdfbf7] dark:bg-[#191c20] text-stone-900 dark:text-stone-100 border sm:border-2 border-amber-900/25',
      headerBg: 'border-b border-amber-900/15 bg-amber-900/5 dark:bg-stone-900/60',
      headerIcon: 'bg-amber-800 text-amber-100',
      headerTitle: 'text-amber-950 dark:text-amber-100',
      headerSubtitle: 'text-amber-900/70 dark:text-amber-300/70',
      closeBtn: 'bg-amber-900/10 hover:bg-amber-900/20 text-stone-700 dark:text-stone-300',
      contextPill: 'bg-amber-100/70 dark:bg-stone-800/80 border border-amber-900/15 text-stone-900 dark:text-stone-100',
      contextIconBox: 'bg-amber-800 text-amber-200',
      btnAction: 'bg-amber-800 hover:bg-amber-700 text-white shadow-xs',
      btnSecondary: 'bg-amber-900/15 hover:bg-amber-900/25 text-amber-950 dark:text-amber-200',
      goalCard: 'bg-amber-800/10 dark:bg-amber-950/40 border border-amber-800/25 text-stone-900 dark:text-stone-100',
      goalIcon: 'text-amber-700 dark:text-amber-400',
      goalFill: 'from-amber-600 to-amber-500',
      sectionLabel: 'text-amber-950 dark:text-amber-200',
      sectionIcon: 'text-amber-700 dark:text-amber-400',
      cardDefault: 'bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:border-amber-700/40',
      cardSelected: 'bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-600/30',
      cardSubDefault: 'text-stone-500 dark:text-stone-400',
      cardSubSelected: 'text-amber-100',
      toggleActive: 'bg-amber-800',
      toggleInactive: 'bg-stone-300 dark:bg-stone-700',
      itemCard: 'bg-white dark:bg-stone-800 border border-amber-900/15',
      itemIconBox: 'bg-amber-900/10 text-amber-900 dark:text-amber-200',
      badgeActive: 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200',
      sliderAccent: 'accent-amber-800',
      footerBg: 'border-t border-amber-900/15 bg-amber-900/5 dark:bg-stone-900/80',
    },
    emerald: {
      modalBg: 'bg-[#f4f8f5] dark:bg-[#101c15] text-[#0f281e] dark:text-emerald-100 border sm:border-2 border-emerald-900/25',
      headerBg: 'border-b border-emerald-900/15 bg-emerald-900/5 dark:bg-stone-900/60',
      headerIcon: 'bg-emerald-800 text-emerald-100',
      headerTitle: 'text-emerald-950 dark:text-emerald-100',
      headerSubtitle: 'text-emerald-900/70 dark:text-emerald-300/70',
      closeBtn: 'bg-emerald-900/10 hover:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200',
      contextPill: 'bg-emerald-100/70 dark:bg-stone-800/80 border border-emerald-900/15 text-[#0f281e] dark:text-emerald-100',
      contextIconBox: 'bg-emerald-800 text-emerald-200',
      btnAction: 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs',
      btnSecondary: 'bg-emerald-900/15 hover:bg-emerald-900/25 text-emerald-950 dark:text-emerald-200',
      goalCard: 'bg-emerald-800/10 dark:bg-emerald-950/40 border border-emerald-800/25 text-[#0f281e] dark:text-emerald-100',
      goalIcon: 'text-emerald-700 dark:text-emerald-400',
      goalFill: 'from-emerald-700 to-teal-500',
      sectionLabel: 'text-emerald-950 dark:text-emerald-200',
      sectionIcon: 'text-emerald-700 dark:text-emerald-400',
      cardDefault: 'bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border-emerald-900/15 hover:border-emerald-700/40',
      cardSelected: 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30',
      cardSubDefault: 'text-stone-500 dark:text-stone-400',
      cardSubSelected: 'text-emerald-100',
      toggleActive: 'bg-emerald-800',
      toggleInactive: 'bg-stone-300 dark:bg-stone-700',
      itemCard: 'bg-white dark:bg-stone-800 border border-emerald-900/15',
      itemIconBox: 'bg-emerald-900/10 text-emerald-900 dark:text-emerald-200',
      badgeActive: 'bg-emerald-200 text-emerald-900',
      sliderAccent: 'accent-emerald-800',
      footerBg: 'border-t border-emerald-900/15 bg-emerald-900/5 dark:bg-stone-900/80',
    },
    midnight: {
      modalBg: 'bg-[#161b20] text-stone-100 border sm:border-2 border-stone-700',
      headerBg: 'border-b border-stone-800 bg-[#12161a]',
      headerIcon: 'bg-amber-500 text-stone-950',
      headerTitle: 'text-amber-100',
      headerSubtitle: 'text-stone-400',
      closeBtn: 'bg-stone-800 hover:bg-stone-700 text-stone-300',
      contextPill: 'bg-stone-800 border border-stone-700 text-stone-100',
      contextIconBox: 'bg-amber-500 text-stone-950',
      btnAction: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-xs',
      btnSecondary: 'bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700',
      goalCard: 'bg-stone-800/80 border border-stone-700 text-stone-100',
      goalIcon: 'text-amber-400',
      goalFill: 'from-amber-500 to-yellow-400',
      sectionLabel: 'text-amber-200',
      sectionIcon: 'text-amber-400',
      cardDefault: 'bg-stone-800/90 text-stone-200 border-stone-700 hover:border-amber-400/40',
      cardSelected: 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md ring-2 ring-amber-400/30',
      cardSubDefault: 'text-stone-400',
      cardSubSelected: 'text-stone-900',
      toggleActive: 'bg-amber-500',
      toggleInactive: 'bg-stone-700',
      itemCard: 'bg-stone-800 border border-stone-700',
      itemIconBox: 'bg-stone-700 text-amber-300',
      badgeActive: 'bg-amber-500/20 text-amber-300',
      sliderAccent: 'accent-amber-500',
      footerBg: 'border-t border-stone-800 bg-[#12161a]',
    },
    'classic-white': {
      modalBg: 'bg-white text-stone-900 border sm:border-2 border-stone-300',
      headerBg: 'border-b border-stone-200 bg-stone-50',
      headerIcon: 'bg-stone-900 text-white',
      headerTitle: 'text-stone-900',
      headerSubtitle: 'text-stone-500',
      closeBtn: 'bg-stone-100 hover:bg-stone-200 text-stone-800',
      contextPill: 'bg-stone-50 border border-stone-200 text-stone-900',
      contextIconBox: 'bg-stone-900 text-white',
      btnAction: 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs',
      btnSecondary: 'bg-stone-100 hover:bg-stone-200 text-stone-900',
      goalCard: 'bg-stone-50 border border-stone-200 text-stone-900',
      goalIcon: 'text-stone-800',
      goalFill: 'from-stone-800 to-stone-600',
      sectionLabel: 'text-stone-900',
      sectionIcon: 'text-stone-700',
      cardDefault: 'bg-white text-stone-800 border-stone-200 hover:border-stone-400',
      cardSelected: 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-400/30',
      cardSubDefault: 'text-stone-500',
      cardSubSelected: 'text-stone-300',
      toggleActive: 'bg-stone-900',
      toggleInactive: 'bg-stone-300',
      itemCard: 'bg-white border border-stone-200',
      itemIconBox: 'bg-stone-100 text-stone-800',
      badgeActive: 'bg-stone-200 text-stone-900',
      sliderAccent: 'accent-stone-900',
      footerBg: 'border-t border-stone-200 bg-stone-50',
    },
  }[theme] || {
    modalBg: 'bg-white text-[#20373B] border sm:border-2 border-[#519CAB]/30',
    headerBg: 'bg-white border-b border-[#519CAB]/20 text-[#20373B]',
    headerIcon: 'bg-[#519CAB] text-white',
    headerTitle: 'text-[#20373B]',
    headerSubtitle: 'text-[#20373B]/70',
    closeBtn: 'bg-stone-100 hover:bg-stone-200 text-[#20373B]',
    contextPill: 'bg-white border border-[#519CAB]/25 text-[#20373B]',
    contextIconBox: 'bg-[#519CAB] text-[#FFC64F]',
    btnAction: 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-xs',
    btnSecondary: 'bg-white hover:bg-stone-50 border border-[#519CAB]/25 text-[#20373B]',
    goalCard: 'bg-white border border-[#519CAB]/25 text-[#20373B]',
    goalIcon: 'text-[#519CAB]',
    goalFill: 'from-[#519CAB] via-[#519CAB] to-[#FFC64F]',
    sectionLabel: 'text-[#20373B]',
    sectionIcon: 'text-[#519CAB]',
    cardDefault: 'bg-white text-[#20373B] border-[#519CAB]/20 hover:border-[#519CAB]/40',
    cardSelected: 'bg-[#519CAB] text-white border-[#519CAB] shadow-md ring-2 ring-[#519CAB]/30',
    cardSubDefault: 'text-stone-500',
    cardSubSelected: 'text-white/90',
    toggleActive: 'bg-[#519CAB]',
    toggleInactive: 'bg-stone-300',
    itemCard: 'bg-white border border-[#519CAB]/20',
    itemIconBox: 'bg-stone-100 text-[#519CAB]',
    badgeActive: 'bg-[#519CAB]/10 text-[#519CAB]',
    sliderAccent: 'accent-[#519CAB]',
    footerBg: 'border-t border-[#519CAB]/20 bg-white text-[#20373B]',
  };

  return (
    <AnimatePresence>
      <div 
        id="settings-modal-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          id="settings-modal-content"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden ${st.modalBg}`}
        >
          {/* Header Bar */}
          <div className={`flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 flex-shrink-0 ${st.headerBg}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${st.headerIcon}`}>
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-bold font-display tracking-wide flex items-center gap-1.5 ${st.headerTitle}`}>
                  MUSHAF SETTINGS & CONTROLS
                </h2>
                <p className={`text-xs font-sans ${st.headerSubtitle}`}>
                  Customize testing modes, difficulty, blanks & interface
                </p>
              </div>
            </div>

            <button
              id="close-settings-modal-btn"
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${st.closeBtn}`}
              title="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 custom-scrollbar">
            
            {/* Current Surah & Page Context Banner (Mobile-Optimized) */}
            <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${st.contextPill}`}>
              {/* Surah details */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${st.contextIconBox}`}>
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm leading-tight truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
                      {currentSurah.englishName}
                    </span>
                    <span className="font-arabic text-sm opacity-80" dir="rtl">
                      ({currentSurah.name})
                    </span>
                  </div>
                  <div className="text-[11px] opacity-75 flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                    <span>Page {currentPageNumber} of 604</span>
                    <span className="opacity-40">•</span>
                    <span>Surah #{currentSurah.number}</span>
                    <span className="opacity-40">•</span>
                    <span>{currentSurah.numberOfAyahs} Ayahs</span>
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons - Flex fluid grid on mobile, row on desktop */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto flex-shrink-0">
                {onNavigateHome && (
                  <button
                    onClick={() => { onClose(); onNavigateHome(); }}
                    className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1 transition-all ${st.btnSecondary}`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>
                )}
                {onNavigateLeagues && (
                  <button
                    onClick={() => { onClose(); onNavigateLeagues(); }}
                    className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1 transition-all ${st.btnSecondary}`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-[#FFC64F]" />
                    <span>Leagues</span>
                  </button>
                )}
                <button
                  onClick={() => { onClose(); onOpenPagePicker(); }}
                  className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer flex items-center justify-center transition-all ${st.btnAction}`}
                >
                  Change Page
                </button>
                <button
                  onClick={() => { onClose(); onOpenSurahPicker(); }}
                  className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer flex items-center justify-center transition-all ${st.btnSecondary}`}
                >
                  Surah List
                </button>
              </div>
            </div>

            {/* Segmented Tab Navigation Bar (User-Friendly Categorization) */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold">
              <button
                type="button"
                id="settings-tab-test-btn"
                onClick={() => setActiveTab('test')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'test'
                    ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Test Mode</span>
                <span className="xs:hidden">Test</span>
              </button>

              <button
                type="button"
                id="settings-tab-mushaf-btn"
                onClick={() => setActiveTab('mushaf')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'mushaf'
                    ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mushaf View</span>
                <span className="xs:hidden">View</span>
              </button>

              <button
                type="button"
                id="settings-tab-audio-btn"
                onClick={() => setActiveTab('audio')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'audio'
                    ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Theme & Audio</span>
                <span className="xs:hidden">Theme</span>
              </button>

              <button
                type="button"
                id="settings-tab-tools-btn"
                onClick={() => setActiveTab('tools')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'tools'
                    ? (theme === 'moonstone' ? 'bg-[#519CAB] text-white shadow-xs' : 'bg-amber-800 text-white shadow-xs')
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Quick Tools</span>
                <span className="xs:hidden">Tools</span>
              </button>
            </div>

            {/* Daily Memorization Target & Goal Card */}
            {activeTab === 'test' && dailyTarget && (
              <div className={`p-3.5 rounded-2xl border flex flex-col gap-2 ${st.goalCard}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 ${st.goalIcon}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider font-display ${st.sectionLabel}`}>
                      Daily Memorization Goal
                    </span>
                  </div>
                  {goalSummary && (
                    <span className={`text-xs font-bold font-mono ${st.sectionLabel}`}>
                      {goalSummary.formattedLabel} ({goalSummary.percent}%)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs gap-2 flex-wrap sm:flex-nowrap">
                  <span className="font-semibold">
                    {dailyTarget.title}
                  </span>
                  {onOpenDailyTarget && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDailyTarget();
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer shadow-xs active:scale-95 transition-all flex-shrink-0 ${st.btnAction}`}
                    >
                      Set Target (Juz / Surah / Pages)
                    </button>
                  )}
                </div>

                {goalSummary && (
                  <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div
                      className={`h-full bg-gradient-to-r ${st.goalFill} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(3, goalSummary.percent))}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* SECTION 1: Page Typography & Display Mode */}
            {activeTab === 'mushaf' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <BookOpen className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Mushaf Page Typography
                  </label>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    {pageRenderMode === 'authentic-image' ? 'Authentic King Fahd Complex' : 'Standard Web Font'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="settings-page-mode-authentic-btn"
                    onClick={() => onChangePageRenderMode('authentic-image')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      pageRenderMode === 'authentic-image' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm">Authentic Printed Mushaf</span>
                      {pageRenderMode === 'authentic-image' && <Check className="w-4 h-4" />}
                    </div>
                    <p className={`text-[11px] leading-tight ${pageRenderMode === 'authentic-image' ? st.cardSubSelected : st.cardSubDefault}`}>
                      Exact 1:1 King Fahd Medina Mushaf pages. Zero word gaps, perfect calligraphic ligatures, matches printed Quran.
                    </p>
                  </button>

                  <button
                    id="settings-page-mode-digital-btn"
                    onClick={() => onChangePageRenderMode('digital-text')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      pageRenderMode === 'digital-text' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm">Digital Text Mode</span>
                      {pageRenderMode === 'digital-text' && <Check className="w-4 h-4" />}
                    </div>
                    <p className={`text-[11px] leading-tight ${pageRenderMode === 'digital-text' ? st.cardSubSelected : st.cardSubDefault}`}>
                      Vector text with selectable words and customizable font sizes.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2 & 3: Testing Mode & Difficulty */}
            {activeTab === 'test' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                      <Sparkles className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                      Challenge Mode
                    </label>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isMobile ? 'Mobile: Portions (Carousel Fit)' : challengeType === 'full-ayah' ? 'Full Ayah testing' : 'Portion (Start / Middle / End)'}
                    </span>
                  </div>

                  {isMobile && (
                    <div className={`p-2 rounded-xl border text-[11px] flex items-center gap-1.5 ${st.itemCard}`}>
                      <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 ${st.sectionIcon}`} />
                      <span>
                        <strong>Mobile Optimized:</strong> Verses are masked in concise 2-3 word portions to fit the bottom carousel cards as sketched.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="settings-mode-full-btn"
                      onClick={() => onChangeChallengeType('full-ayah')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        challengeType === 'full-ayah' && !isMobile ? st.cardSelected : st.cardDefault
                      } ${isMobile ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">Complete Ayah</span>
                        {challengeType === 'full-ayah' && !isMobile && <Check className="w-4 h-4" />}
                      </div>
                      <p className={`text-[11px] leading-tight ${challengeType === 'full-ayah' && !isMobile ? st.cardSubSelected : st.cardSubDefault}`}>
                        Masks the entire verse. Ideal for tablet and desktop landscape memorization.
                      </p>
                    </button>

                    <button
                      id="settings-mode-portion-btn"
                      onClick={() => onChangeChallengeType('portion-ayah')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        challengeType === 'portion-ayah' || isMobile ? st.cardSelected : st.cardDefault
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">Portion Blanking</span>
                        {(challengeType === 'portion-ayah' || isMobile) && <Check className="w-4 h-4" />}
                      </div>
                      <p className={`text-[11px] leading-tight ${challengeType === 'portion-ayah' || isMobile ? st.cardSubSelected : st.cardSubDefault}`}>
                        Blanks dynamic beginning, middle, or ending clauses. Perfect for mobile bottom carousel.
                      </p>
                    </button>
                  </div>
                </div>

                {/* SECTION 3: Difficulty Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                      <ShieldAlert className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                      Difficulty Level
                    </label>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      {difficulty === 'easy' ? 'Easy (Distinct)' : difficulty === 'medium' ? 'Medium (Same Surah)' : 'Hafiz (Mutashabihat)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Easy */}
                    <button
                      id="settings-diff-easy-btn"
                      onClick={() => onChangeDifficulty('easy')}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        difficulty === 'easy'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
                          : st.cardDefault
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm">Easy</span>
                      <span className={`text-[10px] ${difficulty === 'easy' ? 'text-emerald-100' : 'opacity-70'}`}>
                        Distinct Verses
                      </span>
                    </button>

                    {/* Medium */}
                    <button
                      id="settings-diff-medium-btn"
                      onClick={() => onChangeDifficulty('medium')}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        difficulty === 'medium' ? st.cardSelected : st.cardDefault
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm">Medium</span>
                      <span className={`text-[10px] ${difficulty === 'medium' ? st.cardSubSelected : 'opacity-70'}`}>
                        Same-Surah Verses
                      </span>
                    </button>

                    {/* Hafiz Mutashabihat */}
                    <button
                      id="settings-diff-hafiz-btn"
                      onClick={() => onChangeDifficulty('hafiz')}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        difficulty === 'hafiz'
                          ? 'bg-rose-700 text-white border-rose-700 shadow-md ring-2 ring-rose-500/30'
                          : st.cardDefault
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm flex items-center gap-1">
                        <span>Hafiz</span> 👑
                      </span>
                      <span className={`text-[10px] font-medium ${difficulty === 'hafiz' ? 'text-rose-100' : 'text-rose-600 dark:text-rose-400'}`}>
                        Mutashabihat
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* SECTION 4: Page Display Layout (Desktop & Tablet) */}
            {activeTab === 'mushaf' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <BookOpen className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Page Display Layout (Desktop & Tablet)
                  </label>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {pageViewMode === 'single' ? '1 Page Focused' : '2 Pages Spread'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* 1 Page Option */}
                  <button
                    id="settings-layout-single-btn"
                    onClick={() => onChangePageViewMode('single')}
                    className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      pageViewMode === 'single' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span>1 Page (Single Focused)</span>
                      </span>
                      {pageViewMode === 'single' && <Check className="w-4 h-4" />}
                    </div>
                    <p className={`text-[11px] leading-snug ${pageViewMode === 'single' ? st.cardSubSelected : st.cardSubDefault}`}>
                      Single centered 15-line page with maximum font size.
                    </p>
                  </button>

                  {/* 2 Pages Option */}
                  <button
                    id="settings-layout-double-btn"
                    onClick={() => onChangePageViewMode('double')}
                    className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      pageViewMode === 'double' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>2 Pages (Open Spread)</span>
                      </span>
                      {pageViewMode === 'double' && <Check className="w-4 h-4" />}
                    </div>
                    <p className={`text-[11px] leading-snug ${pageViewMode === 'double' ? st.cardSubSelected : st.cardSubDefault}`}>
                      Two facing Medina pages side-by-side on wide screens.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 5: Blanks Per Page */}
            {activeTab === 'test' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <Layers className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Blanks Per Page
                  </label>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {blankCountChoice === 'all' ? 'All ayahs masked' : `${blankCountChoice} verse(s) per page`}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 'all'].map((opt) => {
                    const isSelected = blankCountChoice === opt;
                    return (
                      <button
                        key={String(opt)}
                        id={`settings-blanks-${opt}-btn`}
                        onClick={() => onChangeBlankCountChoice(opt as number | 'all')}
                        className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          isSelected ? st.cardSelected : st.cardDefault
                        }`}
                      >
                        {opt === 'all' ? 'ALL' : opt}
                      </button>
                    );
                  })}
                </div>

                {/* Multi-Blank for Long Ayahs toggle */}
                {onToggleMultiBlanksPerAyah && (
                  <div className={`p-3 rounded-2xl border flex items-center justify-between mt-2 ${st.itemCard}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>Multiple Blanks in Long Ayahs</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${st.badgeActive}`}>Active</span>
                        </div>
                        <div className="text-[10px] opacity-70">
                          Split long ayahs into multiple fill-in checkpoints (beginning, middle, and conclusion clauses)
                        </div>
                      </div>
                    </div>
                    <button
                      id="settings-toggle-multiblanks-btn"
                      onClick={onToggleMultiBlanksPerAyah}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                        allowMultiBlanksPerAyah ? st.toggleActive : st.toggleInactive
                      }`}
                      title="Toggle multiple blanks per long ayah"
                    >
                      <span 
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          allowMultiBlanksPerAyah ? 'transform translate-x-5' : ''
                        }`} 
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 6 & 7: Audio, Automation & Theme Appearance */}
            {activeTab === 'audio' && (
              <>
                {/* SECTION 7: Theme Appearance First in Theme Tab */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <Palette className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Mushaf Aesthetic & Color Scheme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {/* Moonstone & Saffron Palette */}
                    <button
                      id="settings-theme-moonstone-btn"
                      onClick={() => onChangeTheme('moonstone')}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'moonstone' ? 'border-[#519CAB] ring-2 ring-[#519CAB]/30 bg-white text-[#20373B] shadow-sm' : 'border-[#519CAB]/20 bg-white text-[#20373B] hover:border-[#519CAB]/40'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#20373B] via-[#519CAB] to-[#FFC64F] border border-[#519CAB] shadow-xs" />
                      <span className="text-[11px] font-bold">Moonstone</span>
                    </button>

                    {/* Parchment */}
                    <button
                      id="settings-theme-parchment-btn"
                      onClick={() => onChangeTheme('parchment')}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'parchment' ? 'border-amber-700 ring-2 ring-amber-600/30 bg-[#fcf9f2] text-stone-900 shadow-sm' : 'border-amber-900/15 bg-[#fcf9f2] text-stone-800 hover:border-amber-700/40'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#fdfbf7] border border-amber-600/60 shadow-xs" />
                      <span className="text-[11px] font-bold">Parchment</span>
                    </button>

                    {/* Emerald */}
                    <button
                      id="settings-theme-emerald-btn"
                      onClick={() => onChangeTheme('emerald')}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'emerald' ? 'border-emerald-700 ring-2 ring-emerald-600/30 bg-[#e8f5e9] text-emerald-950 shadow-sm' : 'border-emerald-900/15 bg-[#e8f5e9] text-emerald-900 hover:border-emerald-700/40'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#e8f5e9] border border-emerald-600/60 shadow-xs" />
                      <span className="text-[11px] font-bold">Emerald</span>
                    </button>

                    {/* Midnight */}
                    <button
                      id="settings-theme-midnight-btn"
                      onClick={() => onChangeTheme('midnight')}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'midnight' ? 'border-amber-500 ring-2 ring-amber-500/30 bg-[#161b20] text-amber-200 shadow-sm' : 'border-stone-700 bg-[#161b20] text-stone-300 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#161b20] border border-amber-500/60 shadow-xs" />
                      <span className="text-[11px] font-bold">Midnight</span>
                    </button>

                    {/* Classic White */}
                    <button
                      id="settings-theme-white-btn"
                      onClick={() => onChangeTheme('classic-white')}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'classic-white' ? 'border-stone-600 ring-2 ring-stone-400/30 bg-white text-stone-900 shadow-sm' : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500/40'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-white border border-stone-400 shadow-xs" />
                      <span className="text-[11px] font-bold">White</span>
                    </button>
                  </div>
                </div>

                {/* Audio & Automation Preferences */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <Sliders className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Audio & Automation Preferences
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Auto Play Audio */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          {autoPlayAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs">Ayah Recitation</div>
                          <div className="text-[10px] opacity-70">Play audio on correct answer</div>
                        </div>
                      </div>
                      <button
                        id="settings-toggle-audio-btn"
                        onClick={onToggleAutoPlayAudio}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          autoPlayAudio ? st.toggleActive : st.toggleInactive
                        }`}
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            autoPlayAudio ? 'transform translate-x-5' : ''
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Auto Advance Ayah on Correct */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Auto-Next Ayah on Correct</div>
                          <div className="text-[10px] opacity-70">Proceed to next verse upon right answer</div>
                        </div>
                      </div>
                      <button
                        id="settings-toggle-autoadvance-correct-btn"
                        onClick={onToggleAutoAdvanceOnCorrect}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          autoAdvanceOnCorrect ? st.toggleActive : st.toggleInactive
                        }`}
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            autoAdvanceOnCorrect ? 'transform translate-x-5' : ''
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Auto Advance Page */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Auto-Advance Page</div>
                          <div className="text-[10px] opacity-70">Proceed when page completed</div>
                        </div>
                      </div>
                      <button
                        id="settings-toggle-autoadvance-btn"
                        onClick={onToggleAutoAdvance}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          autoAdvance ? st.toggleActive : st.toggleInactive
                        }`}
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            autoAdvance ? 'transform translate-x-5' : ''
                          }`} 
                        />
                      </button>
                    </div>

                    {/* English Meanings */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          {showTranslation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs">English Meanings</div>
                          <div className="text-[10px] opacity-70">Display Sahih Int. translation</div>
                        </div>
                      </div>
                      <button
                        id="settings-toggle-translation-btn"
                        onClick={onToggleTranslation}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          showTranslation ? st.toggleActive : st.toggleInactive
                        }`}
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            showTranslation ? 'transform translate-x-5' : ''
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Haptic Feedback (Vibration) */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Haptic Feedback</div>
                          <div className="text-[10px] opacity-70">Vibrate on taps, page turns & answers</div>
                        </div>
                      </div>
                      <button
                        id="settings-toggle-haptics-btn"
                        onClick={onToggleHaptics}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          hapticsEnabled ? st.toggleActive : st.toggleInactive
                        }`}
                        title="Toggle Haptic Feedback"
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            hapticsEnabled ? 'transform translate-x-5' : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SECTION 8: Page Margins & Padding */}
            {activeTab === 'mushaf' && (
              <div className={`space-y-2.5 p-3.5 rounded-2xl border ${st.itemCard}`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <Maximize2 className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Page Margins & Spacing
                  </label>
                  <span className="text-[11px] font-medium opacity-80">
                    {pageMargins.horizontalPadding}px horiz • {pageMargins.verticalPadding}px vert
                  </span>
                </div>

                {/* Preset quick buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    id="settings-margin-compact-btn"
                    type="button"
                    onClick={() => onChangePageMargins({ preset: 'compact', horizontalPadding: 12, verticalPadding: 6 })}
                    className={`py-2 px-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      pageMargins.preset === 'compact' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <span className="text-xs font-bold">Compact</span>
                    <span className={`text-[10px] ${pageMargins.preset === 'compact' ? st.cardSubSelected : 'opacity-70'}`}>12px / 6px</span>
                  </button>

                  <button
                    id="settings-margin-standard-btn"
                    type="button"
                    onClick={() => onChangePageMargins({ preset: 'standard', horizontalPadding: 24, verticalPadding: 10 })}
                    className={`py-2 px-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      pageMargins.preset === 'standard' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <span className="text-xs font-bold">Standard</span>
                    <span className={`text-[10px] ${pageMargins.preset === 'standard' ? st.cardSubSelected : 'opacity-70'}`}>24px / 10px</span>
                  </button>

                  <button
                    id="settings-margin-spacious-btn"
                    type="button"
                    onClick={() => onChangePageMargins({ preset: 'spacious', horizontalPadding: 36, verticalPadding: 16 })}
                    className={`py-2 px-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      pageMargins.preset === 'spacious' ? st.cardSelected : st.cardDefault
                    }`}
                  >
                    <span className="text-xs font-bold">Spacious</span>
                    <span className={`text-[10px] ${pageMargins.preset === 'spacious' ? st.cardSubSelected : 'opacity-70'}`}>36px / 16px</span>
                  </button>
                </div>

                {/* Sliders for precision fine-tuning */}
                <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="opacity-80 font-medium">Horizontal Page Margin (Sides)</span>
                      <span className="font-mono font-bold">{pageMargins.horizontalPadding} px</span>
                    </div>
                    <input
                      id="settings-margin-horizontal-slider"
                      type="range"
                      min="4"
                      max="56"
                      step="2"
                      value={pageMargins.horizontalPadding}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onChangePageMargins({
                          preset: 'custom',
                          horizontalPadding: val,
                          verticalPadding: pageMargins.verticalPadding
                        });
                      }}
                      className={`w-full ${st.sliderAccent} h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer`}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="opacity-80 font-medium">Vertical Page Margin (Top & Bottom)</span>
                      <span className="font-mono font-bold">{pageMargins.verticalPadding} px</span>
                    </div>
                    <input
                      id="settings-margin-vertical-slider"
                      type="range"
                      min="2"
                      max="30"
                      step="2"
                      value={pageMargins.verticalPadding}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onChangePageMargins({
                          preset: 'custom',
                          horizontalPadding: pageMargins.horizontalPadding,
                          verticalPadding: val
                        });
                      }}
                      className={`w-full ${st.sliderAccent} h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 9: Session Actions (Shuffle & Reset) & Learning Tools */}
            {activeTab === 'tools' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <RotateCcw className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Page Blanks Management
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="settings-shuffle-blanks-btn"
                      onClick={() => { onShuffleNewBlanks(); onClose(); }}
                      className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${st.btnSecondary}`}
                    >
                      <Shuffle className="w-4 h-4 text-[#519CAB]" />
                      <span>Shuffle New Blanks</span>
                    </button>

                    <button
                      id="settings-reset-blanks-btn"
                      onClick={() => { onResetPageBlanks(); onClose(); }}
                      className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${st.btnSecondary}`}
                    >
                      <RotateCcw className="w-4 h-4 text-[#519CAB]" />
                      <span>Retry Page Blanks</span>
                    </button>
                  </div>
                </div>

                {/* Helpful Learning Tools */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${st.sectionLabel}`}>
                    <Sparkles className={`w-3.5 h-3.5 ${st.sectionIcon}`} />
                    Help & Review Tools
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Review Mistakes Quick Access */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Mistake Bookmarks</div>
                          <div className="text-[10px] opacity-70">{mistakesCount} verse(s) to review</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { onClose(); onOpenReview(); }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all ${st.btnAction}`}
                      >
                        Review
                      </button>
                    </div>

                    {/* How to Play Guide Quick Access */}
                    <div className={`p-3 rounded-2xl border flex items-center justify-between ${st.itemCard}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${st.itemIconBox}`}>
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">How to Play & Guide</div>
                          <div className="text-[10px] opacity-70">Rules & memorization tips</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { onClose(); onOpenHowToPlay(); }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all ${st.btnSecondary}`}
                      >
                        Guide
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Navigation shortcuts */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${st.itemCard}`}>
                  <div>
                    <span className="font-bold block">Quick Navigation</span>
                    <span className="text-[11px] opacity-70">Jump to any surah or page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onClose(); onOpenSurahPicker(); }}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer ${st.btnSecondary}`}
                    >
                      Surah Index
                    </button>
                    <button
                      onClick={() => { onClose(); onOpenPagePicker(); }}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer ${st.btnSecondary}`}
                    >
                      Page Picker
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Sticky Action Bar */}
          <div className={`p-3 sm:p-4 border-t flex items-center justify-between flex-shrink-0 ${st.footerBg}`}>
            <div className="flex items-center gap-2 text-xs font-sans opacity-85">
              <span>Overall Accuracy: <strong className="font-bold">{accuracyPct}%</strong></span>
              <span>•</span>
              <span>Answered: <strong className="font-bold">{totalAnswered}</strong></span>
            </div>

            <button
              id="settings-done-footer-btn"
              onClick={onClose}
              className={`py-2 px-6 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${st.btnAction}`}
            >
              <span>Save & Apply</span>
              <Check className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
