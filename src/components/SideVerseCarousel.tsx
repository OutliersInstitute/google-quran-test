import React, { useState, useEffect, useRef } from 'react';
import { BlankTarget, CarouselOption, ChallengeType, DifficultyLevel, Surah, PageRangeConfig, PageViewMode, MushafTheme, BlankCountChoice } from '../types';
import { 
  Sparkles, CheckCircle2, XCircle, Volume2, VolumeX, ArrowRight, 
  Shuffle, Eye, EyeOff, BookOpen, Flame, Award, ChevronLeft, ChevronRight, RotateCcw,
  CheckCheck, ListFilter, ArrowLeft, Target, Zap, Pause, Play, CornerDownLeft, Settings, Home, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toArabicDigits } from '../services/quranApi';
import { triggerHaptic } from '../utils/haptics';
import { stripTajweedMarkers } from '../utils/kashida';

interface SideVerseCarouselProps {
  blankTargets: BlankTarget[];
  activeBlankIndex: number;
  onSelectBlankIndex: (index: number) => void;
  blankCountChoice: BlankCountChoice;
  onChangeBlankCountChoice: (count: BlankCountChoice) => void;
  selectedOption: CarouselOption | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelectOption: (option: CarouselOption) => void;
  onNextQuestion: () => void;
  onResetPageBlanks: () => void;
  onPlayAudio?: (audioUrl?: string) => void;
  autoPlayAudio?: boolean;
  onToggleAutoPlayAudio?: () => void;
  currentSurah: Surah;
  currentPageNumber: number;
  pageViewMode?: PageViewMode;
  secondaryPageNumber?: number | null;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onOpenSurahPicker: () => void;
  onOpenPagePicker: () => void;
  onOpenRangePicker: () => void;
  activeRange: PageRangeConfig | null;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  challengeType: ChallengeType;
  difficulty: DifficultyLevel;
  onChangeChallengeType: (type: ChallengeType) => void;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  correctAnswers: number;
  isPlayingAudio?: boolean;
  onOpenSettings?: () => void;
  onNavigateHome?: () => void;
  onNavigateLeagues?: () => void;
  theme?: MushafTheme;
}

export const SideVerseCarousel: React.FC<SideVerseCarouselProps> = ({
  blankTargets,
  activeBlankIndex,
  onSelectBlankIndex,
  blankCountChoice,
  onChangeBlankCountChoice,
  selectedOption,
  isAnswered,
  isCorrect,
  onSelectOption,
  onNextQuestion,
  onResetPageBlanks,
  onPlayAudio,
  autoPlayAudio = false,
  onToggleAutoPlayAudio,
  currentSurah,
  currentPageNumber,
  pageViewMode = 'single',
  secondaryPageNumber = null,
  onNextPage,
  onPreviousPage,
  onOpenSurahPicker,
  onOpenPagePicker,
  onOpenRangePicker,
  activeRange,
  autoAdvance,
  onToggleAutoAdvance,
  challengeType,
  difficulty,
  onChangeChallengeType,
  onChangeDifficulty,
  streak,
  bestStreak,
  totalAnswered,
  correctAnswers,
  isPlayingAudio = false,
  onOpenSettings,
  onNavigateHome,
  onNavigateLeagues,
  theme = 'moonstone',
}) => {
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownPaused, setIsCountdownPaused] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeTarget: BlankTarget | null = blankTargets[activeBlankIndex] || blankTargets[0] || null;
  const options = activeTarget?.options || [];

  // Track completion across all blanks on the page
  const totalBlanks = blankTargets.length;
  const answeredCount = blankTargets.filter(b => b.isAnswered).length;
  const correctCount = blankTargets.filter(b => b.isCorrect).length;
  const isPageAllCompleted = totalBlanks > 0 && answeredCount === totalBlanks;

  // Auto-scroll to top of options when blank target or page changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeBlankIndex, currentPageNumber]);

  // Auto-advance countdown effect when all blanks on the current page are answered
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPageAllCompleted && autoAdvance && !isCountdownPaused) {
      if (countdown === null) {
        setCountdown(3);
      } else if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else if (countdown === 0) {
        setCountdown(null);
        onNextPage();
      }
    } else {
      if (countdown !== null) {
        setCountdown(null);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPageAllCompleted, autoAdvance, isCountdownPaused, countdown, onNextPage]);

  // Haptic feedback on completing all blanks on the page
  useEffect(() => {
    if (isPageAllCompleted) {
      triggerHaptic('celebrate');
    }
  }, [isPageAllCompleted]);

  // Reset pause state when page changes
  useEffect(() => {
    setIsCountdownPaused(false);
    setCountdown(null);
  }, [currentPageNumber]);

  // Comprehensive Desktop Keyboard shortcut listener (1-4, A-D, Space, Enter, Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!activeTarget?.options) return;
      const opts = activeTarget.options;
      const keyLower = e.key.toLowerCase();

      // Number keys 1-4
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < opts.length && !activeTarget?.isAnswered) {
          e.preventDefault();
          onSelectOption(opts[idx]);
        }
      }
      // Letter keys A-D
      else if (['a', 'b', 'c', 'd'].includes(keyLower)) {
        const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
        const idx = letterMap[keyLower];
        if (idx !== undefined && idx < opts.length && !activeTarget?.isAnswered) {
          e.preventDefault();
          onSelectOption(opts[idx]);
        }
      }
      // Navigation keys
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeBlankIndex < totalBlanks - 1) {
          e.preventDefault();
          onSelectBlankIndex(activeBlankIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeBlankIndex > 0) {
          e.preventDefault();
          onSelectBlankIndex(activeBlankIndex - 1);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (isPageAllCompleted) {
          e.preventDefault();
          onNextPage();
        } else if (activeTarget?.isAnswered) {
          e.preventDefault();
          const nextUnansweredIdx = blankTargets.findIndex((b, i) => i > activeBlankIndex && !b.isAnswered);
          if (nextUnansweredIdx !== -1) {
            onSelectBlankIndex(nextUnansweredIdx);
          } else {
            const firstUnanswered = blankTargets.findIndex(b => !b.isAnswered);
            if (firstUnanswered !== -1) {
              onSelectBlankIndex(firstUnanswered);
            } else {
              onNextQuestion();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTarget, activeBlankIndex, totalBlanks, blankTargets, isPageAllCompleted, onSelectOption, onSelectBlankIndex, onNextPage, onNextQuestion]);

  const st = {
    moonstone: {
      aside: 'bg-white text-[#20373B] border-2 border-[#519CAB]/25 shadow-xl',
      headerBorder: 'border-b border-[#519CAB]/15',
      navBox: 'bg-white border border-[#519CAB]/25 text-[#20373B] shadow-2xs',
      navBtn: 'hover:bg-[#519CAB] hover:text-white text-[#20373B]',
      accentBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white',
      accentIcon: 'text-[#FFC64F]',
      secondaryBtn: 'bg-white hover:bg-stone-50 text-[#20373B] border border-[#519CAB]/20 shadow-xs',
      secondaryIcon: 'text-[#519CAB]',
      badgeActive: 'bg-[#519CAB] text-white border-[#519CAB]',
      badgeDefault: 'bg-stone-100 text-[#20373B] border-stone-200',
      portionBanner: 'bg-stone-50 border border-[#519CAB]/20',
      portionTitle: 'text-[#519CAB]',
      cardDefault: 'bg-white hover:bg-stone-50 border-[#519CAB]/30 text-[#20373B]',
      badgeLetter: 'bg-stone-100 text-[#20373B] border-[#519CAB]/30',
      hotkey: 'bg-stone-100 text-[#20373B]',
      footerBox: 'bg-white border-t border-[#519CAB]/15',
      shuffleBtn: 'bg-stone-100 hover:bg-stone-200 text-[#20373B] border border-[#519CAB]/20',
      nextPageBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white',
      actionPrimary: 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-md',
      actionPrimaryIcon: 'text-[#FFC64F]',
      actionSecondary: 'bg-stone-100 hover:bg-stone-200 text-[#20373B] border border-[#519CAB]/20',
      audioBtn: 'bg-[#519CAB]/15 hover:bg-[#519CAB]/25 text-[#20373B] border border-[#519CAB]/30',
      audioIcon: 'text-[#519CAB]',
      pillActive: 'bg-[#519CAB] text-white font-bold',
      pillDefault: 'hover:bg-[#519CAB]/10 text-[#20373B]',
      blankTabActive: 'bg-[#519CAB] text-white border-[#438795] shadow-xs font-bold',
      blankTabDefault: 'bg-white text-[#20373B] border border-[#519CAB]/20',
      contextPill: 'bg-[#519CAB]/10 text-[#519CAB] border border-[#519CAB]/20',
      contextBlankHighlight: 'text-[#519CAB] bg-[#519CAB]/10 border-b-2 border-[#519CAB]',
    },
    parchment: {
      aside: 'bg-[#fcf9f2] dark:bg-[#181c20] text-stone-900 dark:text-stone-100 border-2 border-amber-900/25 shadow-xl',
      headerBorder: 'border-b border-amber-900/15',
      navBox: 'bg-white dark:bg-stone-800 border border-amber-900/25 text-stone-900 dark:text-stone-100 shadow-2xs',
      navBtn: 'hover:bg-amber-800 hover:text-white text-stone-800 dark:text-stone-200',
      accentBtn: 'bg-amber-800 hover:bg-amber-700 text-white',
      accentIcon: 'text-amber-300',
      secondaryBtn: 'bg-white dark:bg-stone-800 hover:bg-amber-50 text-stone-900 dark:text-stone-100 border border-amber-900/20 shadow-xs',
      secondaryIcon: 'text-amber-800 dark:text-amber-400',
      badgeActive: 'bg-amber-800 text-white border-amber-900',
      badgeDefault: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300',
      portionBanner: 'bg-amber-100/70 dark:bg-stone-800/90 border border-amber-900/20',
      portionTitle: 'text-amber-900 dark:text-amber-300',
      cardDefault: 'bg-white dark:bg-stone-800 hover:bg-amber-50/50 border-amber-900/25 text-stone-900 dark:text-stone-100',
      badgeLetter: 'bg-amber-900/10 text-amber-950 dark:text-amber-200 border-amber-900/20',
      hotkey: 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300',
      footerBox: 'bg-amber-950/5 dark:bg-stone-900/80 border-t border-amber-900/15',
      shuffleBtn: 'bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border border-amber-900/15',
      nextPageBtn: 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-amber-900 hover:from-emerald-600 text-white',
      actionPrimary: 'bg-amber-800 hover:bg-amber-700 text-amber-50 shadow-md',
      actionPrimaryIcon: 'text-amber-300',
      actionSecondary: 'bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border border-amber-900/15',
      audioBtn: 'bg-amber-200/70 hover:bg-amber-300 text-amber-950 border border-amber-800/30',
      audioIcon: 'text-amber-900',
      pillActive: 'bg-amber-800 text-white font-bold',
      pillDefault: 'hover:bg-amber-900/10 text-amber-950 dark:text-amber-200',
      blankTabActive: 'bg-amber-800 text-white border-amber-900 shadow-xs font-bold',
      blankTabDefault: 'bg-amber-100 dark:bg-stone-800 border border-amber-900/20 text-amber-900 dark:text-amber-200',
      contextPill: 'bg-amber-200/50 text-amber-900/80 dark:text-amber-300/80',
      contextBlankHighlight: 'text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-stone-800 border-b-2 border-amber-800',
    },
    emerald: {
      aside: 'bg-[#f3f7f4] text-[#0f281e] border-2 border-emerald-900/25 shadow-xl',
      headerBorder: 'border-b border-emerald-900/15',
      navBox: 'bg-white border border-emerald-900/25 text-[#0f281e] shadow-2xs',
      navBtn: 'hover:bg-emerald-800 hover:text-white text-[#0f281e]',
      accentBtn: 'bg-emerald-800 hover:bg-emerald-700 text-white',
      accentIcon: 'text-emerald-200',
      secondaryBtn: 'bg-white hover:bg-emerald-50 text-[#0f281e] border border-emerald-900/20 shadow-xs',
      secondaryIcon: 'text-emerald-800',
      badgeActive: 'bg-emerald-800 text-white border-emerald-900',
      badgeDefault: 'bg-stone-100 text-stone-700 border-stone-300',
      portionBanner: 'bg-emerald-100/70 border border-emerald-900/20',
      portionTitle: 'text-emerald-900',
      cardDefault: 'bg-white hover:bg-emerald-50/50 border-emerald-900/25 text-[#0f281e]',
      badgeLetter: 'bg-emerald-900/10 text-emerald-950 border-emerald-900/20',
      hotkey: 'bg-stone-100 text-stone-700',
      footerBox: 'bg-emerald-950/5 border-t border-emerald-900/15',
      shuffleBtn: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-900/15',
      nextPageBtn: 'bg-emerald-800 hover:bg-emerald-700 text-white',
      actionPrimary: 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-md',
      actionPrimaryIcon: 'text-emerald-200',
      actionSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-900/15',
      audioBtn: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-800/30',
      audioIcon: 'text-emerald-900',
      pillActive: 'bg-emerald-800 text-white font-bold',
      pillDefault: 'hover:bg-emerald-900/10 text-emerald-950',
      blankTabActive: 'bg-emerald-800 text-white border-emerald-900 shadow-xs font-bold',
      blankTabDefault: 'bg-emerald-50 border border-emerald-900/20 text-emerald-900',
      contextPill: 'bg-emerald-100 text-emerald-900',
      contextBlankHighlight: 'text-emerald-900 bg-emerald-100 border-b-2 border-emerald-800',
    },
    midnight: {
      aside: 'bg-[#14181c] text-[#f1ece1] border-2 border-stone-800 shadow-xl',
      headerBorder: 'border-b border-stone-800',
      navBox: 'bg-[#1a2128] border border-stone-700 text-stone-100 shadow-2xs',
      navBtn: 'hover:bg-stone-700 hover:text-amber-400 text-stone-200',
      accentBtn: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold',
      accentIcon: 'text-stone-950',
      secondaryBtn: 'bg-[#1a2128] hover:bg-stone-800 text-stone-100 border border-stone-700 shadow-xs',
      secondaryIcon: 'text-amber-400',
      badgeActive: 'bg-amber-500 text-stone-950 border-amber-600 font-bold',
      badgeDefault: 'bg-stone-800 text-stone-300 border-stone-700',
      portionBanner: 'bg-stone-800/80 border border-stone-700',
      portionTitle: 'text-amber-400',
      cardDefault: 'bg-[#1a2128] hover:bg-stone-800 border-stone-700 text-stone-100',
      badgeLetter: 'bg-stone-800 text-amber-400 border-stone-700',
      hotkey: 'bg-stone-800 text-stone-400',
      footerBox: 'bg-[#181d22] border-t border-stone-800',
      shuffleBtn: 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700',
      nextPageBtn: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold',
      actionPrimary: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md',
      actionPrimaryIcon: 'text-stone-950',
      actionSecondary: 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700',
      audioBtn: 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700',
      audioIcon: 'text-amber-400',
      pillActive: 'bg-amber-500 text-stone-950 font-bold',
      pillDefault: 'hover:bg-stone-700 text-stone-200',
      blankTabActive: 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs font-bold',
      blankTabDefault: 'bg-stone-800/80 border border-stone-700 text-stone-300',
      contextPill: 'bg-stone-800 text-amber-400',
      contextBlankHighlight: 'text-amber-400 bg-stone-800 border-b-2 border-amber-500',
    },
    'classic-white': {
      aside: 'bg-[#fcfcfc] text-stone-900 border-2 border-stone-300 shadow-xl',
      headerBorder: 'border-b border-stone-200',
      navBox: 'bg-white border border-stone-300 text-stone-900 shadow-2xs',
      navBtn: 'hover:bg-stone-900 hover:text-white text-stone-900',
      accentBtn: 'bg-stone-900 hover:bg-stone-800 text-white',
      accentIcon: 'text-stone-200',
      secondaryBtn: 'bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 shadow-xs',
      secondaryIcon: 'text-stone-900',
      badgeActive: 'bg-stone-900 text-white border-stone-950 font-bold',
      badgeDefault: 'bg-stone-100 text-stone-700 border-stone-300',
      portionBanner: 'bg-stone-100 border border-stone-200',
      portionTitle: 'text-stone-900',
      cardDefault: 'bg-white hover:bg-stone-50 border-stone-200 text-stone-900',
      badgeLetter: 'bg-stone-200 text-stone-900 border-stone-300',
      hotkey: 'bg-stone-100 text-stone-700',
      footerBox: 'bg-stone-100 border-t border-stone-200',
      shuffleBtn: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300',
      nextPageBtn: 'bg-stone-900 hover:bg-stone-800 text-white',
      actionPrimary: 'bg-stone-900 hover:bg-stone-800 text-white shadow-md',
      actionPrimaryIcon: 'text-stone-300',
      actionSecondary: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300',
      audioBtn: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300',
      audioIcon: 'text-stone-900',
      pillActive: 'bg-stone-900 text-white font-bold',
      pillDefault: 'hover:bg-stone-200 text-stone-900',
      blankTabActive: 'bg-stone-900 text-white border-stone-950 shadow-xs font-bold',
      blankTabDefault: 'bg-stone-100 border border-stone-300 text-stone-800',
      contextPill: 'bg-stone-100 text-stone-800',
      contextBlankHighlight: 'text-stone-900 bg-stone-100 border-b-2 border-stone-900',
    },
  }[theme || 'moonstone'];

  return (
    <aside 
      id="tablet-side-carousel" 
      className={`w-full h-full flex flex-col justify-between rounded-2xl ${st.aside} p-2.5 sm:p-3 md:p-3.5 overflow-hidden select-none min-h-0`}
    >
      {/* Top Header: Navigation & Stats Cockpit */}
      <div className={`flex flex-col gap-1.5 ${st.headerBorder} pb-2 flex-shrink-0`}>
        
        {/* Row 1: Page Stepper, Range Indicator & Surah Jump */}
        <div className="flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
          {/* Page Navigator */}
          <div className={`flex items-center gap-1 ${st.navBox} p-1 rounded-xl shadow-2xs`}>
            {/* RTL Quran Navigation: Back/Left arrow advances forward to Next Page */}
            <button
              id="side-next-page-btn"
              onClick={onNextPage}
              disabled={currentPageNumber >= 604}
              className={`p-1 rounded-lg ${st.navBtn} disabled:opacity-30 transition-colors cursor-pointer`}
              title="Next Quran Page (Advance forward in RTL)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              id="side-page-picker-btn"
              onClick={onOpenPagePicker}
              className="px-2 py-0.5 text-xs font-bold font-sans hover:underline cursor-pointer"
              title="Click to jump to any page or define range"
            >
              {pageViewMode === 'double' && secondaryPageNumber ? (
                <span>Pages {currentPageNumber}–{secondaryPageNumber} <span className="opacity-60 text-[10px]">/ 604</span></span>
              ) : (
                <span>Page {currentPageNumber} <span className="opacity-60 text-[10px]">/ 604</span></span>
              )}
            </button>

            {/* Right arrow returns backward to Previous Page */}
            <button
              id="side-prev-page-btn"
              onClick={onPreviousPage}
              disabled={currentPageNumber <= 1}
              className={`p-1 rounded-lg ${st.navBtn} disabled:opacity-30 transition-colors cursor-pointer`}
              title="Previous Quran Page (Return toward Page 1)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Top Actions: Range Tag & Surah Picker */}
          <div className="flex items-center gap-1.5">
            {activeRange?.enabled ? (
              <button
                id="side-range-badge-btn"
                onClick={onOpenRangePicker}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl ${st.accentBtn} text-[11px] font-bold shadow-xs cursor-pointer transition-all`}
                title={`Testing Range: Page ${activeRange.startPage} to ${activeRange.endPage}. Click to modify.`}
              >
                <Target className={`w-3 h-3 ${st.accentIcon}`} />
                <span>p.{activeRange.startPage}–{activeRange.endPage}</span>
              </button>
            ) : (
              <button
                id="side-define-range-btn"
                onClick={onOpenRangePicker}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl ${st.secondaryBtn} text-[11px] font-bold cursor-pointer transition-all`}
                title="Define a start & end page range to test sequentially"
              >
                <Target className={`w-3 h-3 ${st.secondaryIcon}`} />
                <span>Range</span>
              </button>
            )}

            {/* Surah Name Button */}
            <button
              id="side-surah-btn"
              onClick={onOpenSurahPicker}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${st.accentBtn} font-bold text-xs shadow-sm transition-all cursor-pointer truncate max-w-[130px]`}
              title="Choose Surah (1-114)"
            >
              <BookOpen className={`w-3.5 h-3.5 ${st.accentIcon} flex-shrink-0`} />
              <span className="truncate">{currentSurah.englishName}</span>
            </button>

            {/* Home Dashboard Trigger */}
            {onNavigateHome && (
              <button
                id="side-home-btn"
                onClick={() => {
                  triggerHaptic('light');
                  onNavigateHome();
                }}
                className={`p-1 px-2 rounded-xl ${st.secondaryBtn} transition-all cursor-pointer flex items-center gap-1 active:scale-95`}
                title="Return to Home Dashboard & Goals"
              >
                <Home className={`w-3.5 h-3.5 ${st.secondaryIcon}`} />
                <span className="text-[10px] font-bold font-sans">Home</span>
              </button>
            )}

            {/* Social Leagues Trigger */}
            {onNavigateLeagues && (
              <button
                id="side-leagues-btn"
                onClick={() => {
                  triggerHaptic('light');
                  onNavigateLeagues();
                }}
                className={`p-1 px-2 rounded-xl ${st.secondaryBtn} transition-all cursor-pointer flex items-center gap-1 active:scale-95`}
                title="Open Social Leagues & Leaderboards"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FFC64F]" />
                <span className="text-[10px] font-bold font-sans">Leagues</span>
              </button>
            )}

            {/* Settings Fullscreen Modal Trigger */}
            {onOpenSettings && (
              <button
                id="side-open-settings-btn"
                onClick={onOpenSettings}
                className={`p-1 px-2 rounded-xl ${st.secondaryBtn} transition-all cursor-pointer flex items-center gap-1`}
                title="Open Settings & Mode Controls"
              >
                <Settings className={`w-3.5 h-3.5 ${st.secondaryIcon}`} />
                <span className="text-[10px] font-bold font-sans">Settings</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Streaks & Auto-Advance Toggle */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" style={{ animationDuration: '2s' }} />
              <span>{streak} Streak</span>
            </span>
            <span className="text-[11px] text-stone-500">
              (Best: {bestStreak})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto Audio Play Toggle */}
            {onToggleAutoPlayAudio && (
              <button
                id="side-toggle-audio-btn"
                onClick={onToggleAutoPlayAudio}
                className={`p-1 px-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                  autoPlayAudio
                    ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                    : 'bg-amber-100/70 text-amber-950 dark:text-amber-200 border-amber-900/20 hover:bg-amber-200'
                }`}
                title={autoPlayAudio ? 'Auto-Audio Recitation is ON. Click to mute automatic playback.' : 'Auto-Audio Recitation is OFF (Silent Mode). Click to enable.'}
              >
                {autoPlayAudio ? (
                  <Volume2 className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                )}
                <span className="text-[10px] font-sans font-bold">{autoPlayAudio ? 'Audio: ON' : 'Audio: OFF'}</span>
              </button>
            )}

            {/* Auto-Advance Toggle */}
            <button
              id="side-auto-advance-toggle-btn"
              onClick={onToggleAutoAdvance}
              className={`p-1 px-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                autoAdvance 
                  ? 'bg-amber-800 text-white border-amber-800 shadow-xs' 
                  : 'bg-amber-100/70 text-amber-950 dark:text-amber-200 border-amber-900/20 hover:bg-amber-200'
              }`}
              title="Auto-Advance: Automatically goes to next page & tests you when page is complete"
            >
              <Zap className={`w-3.5 h-3.5 ${autoAdvance ? 'text-amber-300 fill-amber-300' : 'text-amber-700'}`} />
              <span className="text-[10px] font-sans font-bold">Auto-Next: {autoAdvance ? 'ON' : 'OFF'}</span>
            </button>

            {/* Translation toggle */}
            <button
              id="side-toggle-trans-btn"
              onClick={() => setShowTranslations(!showTranslations)}
              className={`p-1 px-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                showTranslations 
                  ? 'bg-amber-800 text-white border-amber-800' 
                  : 'bg-amber-100/70 text-amber-950 dark:text-amber-200 border-amber-900/20 hover:bg-amber-200'
              }`}
              title="Toggle English meanings"
            >
              {showTranslations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-sans font-bold">EN</span>
            </button>
          </div>
        </div>

        {/* Row 3: Blank Count Selector (Choose number of blanks per page) */}
        <div className="flex items-center justify-between pt-1 border-t border-amber-900/10 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5 text-amber-700" />
              <span>Blanks per Page:</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-amber-900/10 dark:bg-amber-950/40 p-0.5 rounded-lg">
            {(['paced', 1, 2, 3, 'all'] as const).map((cnt) => {
              const isSelected = blankCountChoice === cnt;
              return (
                <button
                  key={`cnt_${cnt}`}
                  id={`blank-count-btn-${cnt}`}
                  onClick={() => onChangeBlankCountChoice(cnt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-0.5 ${
                    isSelected
                      ? cnt === 'paced'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-amber-800 text-white shadow-xs'
                      : 'text-amber-950 dark:text-amber-200 hover:bg-amber-800/20'
                  }`}
                  title={
                    cnt === 'paced'
                      ? 'Paced Mode: 2-4 checkpoints spaced intentionally across the page to avoid overwhelm'
                      : cnt === 'all'
                      ? 'Hide every ayah on this page as blanks'
                      : `Set ${cnt} blanks on this page`
                  }
                >
                  {cnt === 'paced' ? '⚡ Paced' : cnt === 'all' ? 'All' : cnt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Multi-Blank Step Tabs (Click to jump to any blank) */}
        {totalBlanks > 1 && (
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar" id="multi-blank-tabs">
            <span className="text-[10px] font-bold opacity-60 flex-shrink-0">
              {blankCountChoice === 'paced' ? 'Checkpoints' : 'Blanks'} ({answeredCount}/{totalBlanks}):
            </span>
            <div className="flex items-center gap-1 flex-1">
              {blankTargets.map((target, idx) => {
                const isActive = idx === activeBlankIndex;
                let btnStyle = st.blankTabDefault;
                if (target.isAnswered) {
                  btnStyle = target.isCorrect
                    ? "bg-emerald-600 text-white border-emerald-700 font-bold"
                    : "bg-rose-600 text-white border-rose-700 font-bold";
                } else if (isActive) {
                  btnStyle = st.blankTabActive;
                }

                return (
                  <button
                    key={target.id}
                    id={`blank-step-tab-${idx}`}
                    onClick={() => {
                      triggerHaptic('light');
                      onSelectBlankIndex(idx);
                    }}
                    className={`flex-1 min-w-[28px] py-0.5 px-1 rounded-md text-[11px] font-sans border transition-all cursor-pointer flex items-center justify-center gap-0.5 ${btnStyle}`}
                    title={`Blank (${idx + 1}) - Ayah ${target.ayahNumberInSurah}${target.subAyahPart ? ` (Part ${target.subAyahPart.partIndex}/${target.subAyahPart.totalParts}: ${target.subAyahPart.label})` : ''}`}
                  >
                    <span>({idx + 1})</span>
                    {target.isAnswered && (
                      <span className="text-[9px]">
                        {target.isCorrect ? '✓' : '✗'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Center Zone: Active Challenge Options with Reliable Desktop Scrolling */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 my-1 overflow-y-auto overflow-x-hidden pr-1.5 custom-scrollbar flex flex-col justify-start"
      >
        
        {/* Page Complete Celebration & Auto-Advance Countdown Banner */}
        {isPageAllCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-amber-500/10 to-emerald-600/15 border-2 border-emerald-600/40 text-center flex flex-col items-center justify-center gap-2.5 my-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-emerald-50 flex items-center justify-center shadow-md">
              <CheckCheck className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-display font-black text-base text-emerald-950 dark:text-emerald-100 tracking-wide">
                PAGE {currentPageNumber} COMPLETED!
              </h4>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 font-sans mt-0.5">
                Solved {correctCount} of {totalBlanks} blanks correctly ({Math.round((correctCount / totalBlanks) * 100)}%)
              </p>
            </div>

            {/* Auto-Advance countdown or manual next page action */}
            {autoAdvance && !isCountdownPaused && countdown !== null ? (
              <div className="w-full max-w-xs flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                    <span>Auto-advancing to Page {currentPageNumber + 1}...</span>
                  </span>
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black animate-pulse">
                    {countdown}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-emerald-950/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-600"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                  />
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={onNextPage}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Advance Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsCountdownPaused(true)}
                    className="py-2 px-3 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Pause auto-advance to review current page"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Stay</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-xs flex flex-col gap-2 mt-1">
                <button
                  onClick={onNextPage}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-amber-900 hover:from-emerald-600 text-emerald-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                >
                  <span>Test Next Page (Page {currentPageNumber + 1})</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={onNextQuestion}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-950 dark:text-amber-200 text-xs font-semibold border border-amber-900/15 cursor-pointer hover:bg-amber-200"
                  >
                    Shuffle New Blanks
                  </button>
                  <button
                    onClick={onResetPageBlanks}
                    className="py-1.5 px-2.5 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-950 dark:text-amber-200 text-xs font-semibold border border-amber-900/15 cursor-pointer hover:bg-amber-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2 w-full justify-start pb-3">
            {/* Challenge Header / Context Banner */}
            <div className="mb-1 flex-shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 font-display flex items-center gap-1">
                    {activeTarget?.isAnswered ? (
                      'RESULT VERIFICATION'
                    ) : (
                      <>
                        <span>BLANK</span>
                        <span className="px-1.5 py-0.2 border-b-2 border-red-600 font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-t">
                          ({activeBlankIndex + 1})
                        </span>
                        <span className="text-stone-500 font-normal">OF {totalBlanks}</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeTarget?.pacingCheckpoint && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1">
                      <span>⚡ {activeTarget.pacingCheckpoint.zone}</span>
                      <span className="opacity-70 font-mono">({activeTarget.pacingCheckpoint.current}/{activeTarget.pacingCheckpoint.total})</span>
                    </span>
                  )}
                  {difficulty === 'hafiz' && (
                    <span className="text-[9px] font-bold text-red-900 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded border border-red-300/60 dark:border-red-800">
                      Hafiz Mutashabihat
                    </span>
                  )}
                  {activeTarget && (
                    <span className={`text-[10px] font-bold ${st.contextPill} px-1.5 py-0.5 rounded-md flex items-center gap-1`}>
                      <span>Ayah {activeTarget.ayahNumberInSurah}</span>
                      {activeTarget.subAyahPart && (
                        <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${st.accentBtn}`}>
                          Part {activeTarget.subAyahPart.partIndex}/{activeTarget.subAyahPart.totalParts} ({activeTarget.subAyahPart.label})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Section Portion context if portion challenge */}
              {activeTarget?.hiddenType === 'portion' && (
                <div className={`p-2 rounded-xl ${st.portionBanner} mb-1.5 text-right shadow-xs`} dir="rtl">
                  {activeTarget.portionSection === 'start' || (!activeTarget.visiblePrefix && activeTarget.visibleSuffix) ? (
                    <>
                      <span className={`text-[10px] font-sans font-bold ${st.portionTitle} block mb-0.5`}>
                        ✦ بِدَايَةُ الآيَةِ {activeTarget.subAyahPart?.label ? `(${activeTarget.subAyahPart.label})` : '(Beginning Section)'}:
                      </span>
                      <span className="font-quran text-sm sm:text-base font-bold leading-relaxed">
                        <span className="text-red-600 dark:text-red-400 font-extrabold px-1 bg-red-100/80 dark:bg-red-950/50 rounded">[ ... ؟؟؟ ]</span> {activeTarget.visibleSuffix}
                      </span>
                    </>
                  ) : activeTarget.portionSection === 'middle' || (activeTarget.visiblePrefix && activeTarget.visibleSuffix) ? (
                    <>
                      <span className={`text-[10px] font-sans font-bold ${st.portionTitle} block mb-0.5`}>
                        ✦ وَسَطُ الآيَةِ {activeTarget.subAyahPart?.label ? `(${activeTarget.subAyahPart.label})` : '(Middle Section)'}:
                      </span>
                      <span className="font-quran text-sm sm:text-base font-bold leading-relaxed">
                        {activeTarget.visiblePrefix} <span className="text-red-600 dark:text-red-400 font-extrabold px-1 bg-red-100/80 dark:bg-red-950/50 rounded">[ ... ؟؟؟ ]</span> {activeTarget.visibleSuffix}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={`text-[10px] font-sans font-bold ${st.portionTitle} block mb-0.5`}>
                        ✦ خَاتِمَةُ الآيَةِ {activeTarget.subAyahPart?.label ? `(${activeTarget.subAyahPart.label})` : '(Ending Clause)'}:
                      </span>
                      <span className="font-quran text-sm sm:text-base font-bold leading-relaxed">
                        {activeTarget.visiblePrefix} <span className="text-red-600 dark:text-red-400 font-extrabold px-1 bg-red-100/80 dark:bg-red-950/50 rounded">[ ... ؟؟؟ ]</span>
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Options List (Vertical Stack) */}
            {!activeTarget ? (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-xs opacity-70">
                Generating blanks for Page {currentPageNumber}...
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                {options.map((option, idx) => {
                  const isSelected = Boolean(
                    (activeTarget?.selectedOption?.id === option.id) || 
                    (selectedOption?.id === option.id && activeTarget?.isAnswered)
                  );
                  const optionLetter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
                  const hotkeyNumber = `${idx + 1}`;

                  let cardStyle = st.cardDefault;
                  let badgeStyle = st.badgeLetter;

                  if (activeTarget?.isAnswered) {
                    if (option.isCorrect) {
                      cardStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 ring-2 ring-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-md";
                      badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                    } else if (isSelected && !option.isCorrect) {
                      cardStyle = "bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-400/40 text-rose-950 dark:text-rose-100";
                      badgeStyle = "bg-rose-600 text-white border-rose-600";
                    } else {
                      cardStyle = "opacity-40 bg-stone-100 dark:bg-stone-900/50 border-stone-300 text-stone-500";
                    }
                  }

                  return (
                    <motion.button
                      key={option.id}
                      id={`side-option-card-${idx}`}
                      onClick={() => !activeTarget?.isAnswered && onSelectOption(option)}
                      disabled={activeTarget?.isAnswered}
                      whileHover={!activeTarget?.isAnswered ? { scale: 1.008, translateY: -1 } : {}}
                      whileTap={!activeTarget?.isAnswered ? { scale: 0.992 } : {}}
                      className={`relative w-full text-right p-2.5 sm:p-3 rounded-xl border-2 transition-all flex flex-col gap-1 cursor-pointer select-text shadow-xs flex-shrink-0 ${cardStyle}`}
                    >
                      {/* Top Row: Option Badge & Hotkey Indicator */}
                      <div className="flex items-center justify-between w-full" dir="ltr">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-xs font-bold font-sans border ${badgeStyle}`}>
                            {optionLetter}
                          </span>
                          {!activeTarget?.isAnswered && (
                            <span className="hidden sm:inline-block text-[9px] font-mono text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-900 px-1 py-0.2 rounded border border-stone-200 dark:border-stone-800">
                              key {optionLetter}/{hotkeyNumber}
                            </span>
                          )}
                        </div>

                        {activeTarget?.isAnswered && option.isCorrect && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Correct Continuation</span>
                          </span>
                        )}

                        {activeTarget?.isAnswered && isSelected && !option.isCorrect && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-300">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>

                      {/* Arabic Verse Option Text */}
                      <div 
                        className="w-full font-quran text-base sm:text-lg md:text-xl font-bold leading-relaxed text-right my-0.5" 
                        dir="rtl"
                      >
                        {stripTajweedMarkers(option.text)}
                      </div>

                      {/* English Translation if enabled */}
                      {showTranslations && option.translation && (
                        <div className="text-[11px] font-sans text-stone-600 dark:text-stone-300 text-left line-clamp-2 border-t border-amber-900/10 pt-1 mt-0.5" dir="ltr">
                          {option.translation}
                        </div>
                      )}

                      {/* Mutashabih explanation when answered */}
                      {activeTarget?.isAnswered && option.explanation && (
                        <div className="text-[10px] font-sans font-medium text-amber-900/80 dark:text-amber-300/80 text-left border-t border-dashed border-amber-900/15 pt-1 mt-0.5 flex items-center gap-1" dir="ltr">
                          <span className="opacity-60">ℹ️</span>
                          <span>{option.explanation}</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Answer Feedback Banner */}
            <AnimatePresence>
              {activeTarget?.isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-2.5 rounded-xl border mt-1 flex flex-col gap-1.5 flex-shrink-0 ${
                    activeTarget.isCorrect 
                      ? 'bg-emerald-100/90 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100' 
                      : 'bg-rose-100/90 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      {activeTarget.isCorrect ? '✨ الممتاز! MashaAllah! Correct!' : '⚠️ Incorrect - Review Verse'}
                    </span>
                    {activeTarget.fullAyah?.audio && (
                      <button
                        id="play-ayah-audio-feedback-btn"
                        onClick={() => onPlayAudio?.(activeTarget.fullAyah.audio)}
                        className="p-1 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-700 flex items-center gap-1 text-[10px] font-semibold cursor-pointer shadow-sm"
                        title="Listen to authentic recitation by Sheikh Mishary Rashid Alafasy"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] opacity-80 leading-tight">
                    {activeTarget.isCorrect 
                      ? `Completed Blank ${activeBlankIndex + 1} (Ayah ${activeTarget.ayahNumberInSurah} of ${currentSurah.englishName}). Press Space/Enter to continue.`
                      : `Authentic text is shown highlighted on the Mushaf page.`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Bottom Action Footer: Next Question / Next Page / Difficulty */}
      <div className={`flex flex-col gap-1.5 ${st.footerBox} p-2.5 sm:p-3 flex-shrink-0`}>
        
        {/* Next Question / Next Blank Action Buttons */}
        <div className="flex items-center gap-2">
          {totalBlanks > 1 && !isPageAllCompleted ? (
            <button
              id="side-next-blank-tab-btn"
              onClick={() => {
                const nextUnanswered = blankTargets.findIndex((b, i) => i > activeBlankIndex && !b.isAnswered);
                if (nextUnanswered !== -1) {
                  onSelectBlankIndex(nextUnanswered);
                } else {
                  const firstUnanswered = blankTargets.findIndex(b => !b.isAnswered);
                  if (firstUnanswered !== -1) {
                    onSelectBlankIndex(firstUnanswered);
                  } else {
                    onSelectBlankIndex((activeBlankIndex + 1) % totalBlanks);
                  }
                }
              }}
              className={`flex-1 py-2 px-3 rounded-xl ${st.actionPrimary} font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
            >
              <span>{activeTarget?.isAnswered ? 'Next Blank' : 'Next Blank Step'}</span>
              <span className="hidden sm:inline text-[10px] opacity-70 font-mono flex items-center gap-0.5">
                <CornerDownLeft className="w-3 h-3" /> Space
              </span>
              <ArrowRight className={`w-4 h-4 ${st.actionPrimaryIcon}`} />
            </button>
          ) : (
            <button
              id="side-next-challenge-btn"
              onClick={onNextQuestion}
              className={`flex-1 py-2 px-3 rounded-xl ${st.actionPrimary} font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
            >
              <Shuffle className={`w-4 h-4 ${st.actionPrimaryIcon}`} />
              <span>Shuffle New Blanks</span>
            </button>
          )}

          {activeTarget?.fullAyah?.audio && (
            <button
              id="side-listen-audio-btn"
              onClick={() => onPlayAudio?.(activeTarget.fullAyah.audio)}
              className={`p-2 rounded-xl ${st.audioBtn} transition-colors cursor-pointer`}
              title="Listen to ayah recitation"
            >
              <Volume2 className={`w-4 h-4 ${st.audioIcon}`} />
            </button>
          )}

          <button
            id="side-reset-page-blanks-btn"
            onClick={onResetPageBlanks}
            className={`p-2 rounded-xl ${st.actionSecondary} transition-colors cursor-pointer`}
            title="Reset answers on this page"
          >
            <RotateCcw className={`w-4 h-4 ${st.audioIcon}`} />
          </button>
        </div>

        {/* Difficulty & Mode Selector Pills */}
        <div className="flex items-center justify-between text-[11px] font-bold pt-0.5 opacity-90">
          <div className="flex items-center gap-1">
            <span className="opacity-70 text-[10px]">Mode:</span>
            <button
              onClick={() => onChangeChallengeType('full-ayah')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                challengeType === 'full-ayah' ? st.pillActive : st.pillDefault
              }`}
            >
              Full
            </button>
            <button
              onClick={() => onChangeChallengeType('portion-ayah')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                challengeType === 'portion-ayah' ? st.pillActive : st.pillDefault
              }`}
            >
              Portion
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="opacity-70 text-[10px]">Level:</span>
            <button
              onClick={() => onChangeDifficulty('easy')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                difficulty === 'easy' ? st.pillActive : st.pillDefault
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => onChangeDifficulty('medium')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                difficulty === 'medium' ? st.pillActive : st.pillDefault
              }`}
            >
              Med
            </button>
            <button
              onClick={() => onChangeDifficulty('hafiz')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                difficulty === 'hafiz' ? st.pillActive : st.pillDefault
              }`}
            >
              Hafiz
            </button>
          </div>
        </div>

      </div>

    </aside>
  );
};

