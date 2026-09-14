import React, { useState, useEffect, useRef } from 'react';
import { BlankTarget, CarouselOption, ChallengeType, DifficultyLevel, Surah, PageRangeConfig, PageViewMode } from '../types';
import { 
  Sparkles, CheckCircle2, XCircle, Volume2, VolumeX, ArrowRight, 
  Shuffle, Eye, EyeOff, BookOpen, Flame, Award, ChevronLeft, ChevronRight, RotateCcw,
  CheckCheck, ListFilter, ArrowLeft, Target, Zap, Pause, Play, CornerDownLeft, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toArabicDigits } from '../services/quranApi';
import { triggerHaptic } from '../utils/haptics';

interface SideVerseCarouselProps {
  blankTargets: BlankTarget[];
  activeBlankIndex: number;
  onSelectBlankIndex: (index: number) => void;
  blankCountChoice: number | 'all';
  onChangeBlankCountChoice: (count: number | 'all') => void;
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
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            onNextPage();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPageAllCompleted, autoAdvance, isCountdownPaused, onNextPage, currentPageNumber]);

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

  return (
    <aside 
      id="tablet-side-carousel" 
      className="w-full h-full flex flex-col justify-between rounded-2xl bg-[#fdfbf7] dark:bg-[#1a1e22] border-2 border-amber-900/20 shadow-xl p-2.5 sm:p-3 md:p-3.5 overflow-hidden select-none min-h-0"
    >
      {/* Top Header: Navigation & Stats Cockpit */}
      <div className="flex flex-col gap-1.5 border-b border-amber-900/15 pb-2 flex-shrink-0">
        
        {/* Row 1: Page Stepper, Range Indicator & Surah Jump */}
        <div className="flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
          {/* Page Navigator */}
          <div className="flex items-center gap-1 bg-amber-900/10 dark:bg-amber-950/40 p-1 rounded-xl border border-amber-900/20">
            {/* RTL Quran Navigation: Back/Left arrow advances forward to Next Page */}
            <button
              id="side-next-page-btn"
              onClick={onNextPage}
              disabled={currentPageNumber >= 604}
              className="p-1 rounded-lg hover:bg-amber-800 hover:text-white disabled:opacity-30 text-amber-950 dark:text-amber-200 transition-colors cursor-pointer"
              title="Next Quran Page (Advance forward in RTL)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              id="side-page-picker-btn"
              onClick={onOpenPagePicker}
              className="px-2 py-0.5 text-xs font-bold font-sans text-amber-950 dark:text-amber-100 hover:underline cursor-pointer"
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
              className="p-1 rounded-lg hover:bg-amber-800 hover:text-white disabled:opacity-30 text-amber-950 dark:text-amber-200 transition-colors cursor-pointer"
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
                className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-50 text-[11px] font-bold shadow-xs cursor-pointer transition-all"
                title={`Testing Range: Page ${activeRange.startPage} to ${activeRange.endPage}. Click to modify.`}
              >
                <Target className="w-3 h-3 text-emerald-300" />
                <span>p.{activeRange.startPage}–{activeRange.endPage}</span>
              </button>
            ) : (
              <button
                id="side-define-range-btn"
                onClick={onOpenRangePicker}
                className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 text-amber-950 dark:text-amber-200 text-[11px] font-bold border border-amber-900/20 shadow-2xs cursor-pointer transition-all"
                title="Define a start & end page range to test sequentially"
              >
                <Target className="w-3 h-3 text-amber-800 dark:text-amber-300" />
                <span>Range</span>
              </button>
            )}

            {/* Surah Name Button */}
            <button
              id="side-surah-btn"
              onClick={onOpenSurahPicker}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs shadow-sm transition-all cursor-pointer truncate max-w-[130px]"
              title="Choose Surah (1-114)"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span className="truncate">{currentSurah.englishName}</span>
            </button>

            {/* Settings Fullscreen Modal Trigger */}
            {onOpenSettings && (
              <button
                id="side-open-settings-btn"
                onClick={onOpenSettings}
                className="p-1 px-2 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-200 border border-amber-900/20 shadow-xs transition-all cursor-pointer flex items-center gap-1"
                title="Open Settings & Mode Controls"
              >
                <Settings className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
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
            {([1, 2, 3, 5, 'all'] as const).map((cnt) => {
              const isSelected = blankCountChoice === cnt;
              return (
                <button
                  key={`cnt_${cnt}`}
                  id={`blank-count-btn-${cnt}`}
                  onClick={() => onChangeBlankCountChoice(cnt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'text-amber-950 dark:text-amber-200 hover:bg-amber-800/20'
                  }`}
                  title={cnt === 'all' ? 'Hide every ayah on this page as blanks' : `Set ${cnt} blanks on this page`}
                >
                  {cnt === 'all' ? 'All' : cnt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Multi-Blank Step Tabs (Click to jump to any blank) */}
        {totalBlanks > 1 && (
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar" id="multi-blank-tabs">
            <span className="text-[10px] font-bold text-stone-500 flex-shrink-0">
              Blanks ({answeredCount}/{totalBlanks}):
            </span>
            <div className="flex items-center gap-1 flex-1">
              {blankTargets.map((target, idx) => {
                const isActive = idx === activeBlankIndex;
                let btnStyle = "bg-amber-100 dark:bg-stone-800 border-amber-900/20 text-amber-900 dark:text-amber-200";
                if (target.isAnswered) {
                  btnStyle = target.isCorrect
                    ? "bg-emerald-600 text-white border-emerald-700 font-bold"
                    : "bg-rose-600 text-white border-rose-700 font-bold";
                } else if (isActive) {
                  btnStyle = "bg-red-600 text-white border-red-700 font-bold shadow-xs";
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
                    title={`Blank (${idx + 1}) - Ayah ${target.ayahNumberInSurah}`}
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
                  {difficulty === 'hafiz' && (
                    <span className="text-[9px] font-bold text-red-900 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded border border-red-300/60 dark:border-red-800">
                      Hafiz Mutashabihat
                    </span>
                  )}
                  {activeTarget && (
                    <span className="text-[10px] font-bold text-amber-900/80 dark:text-amber-300/80 bg-amber-200/50 px-1.5 py-0.5 rounded-md">
                      Ayah {activeTarget.ayahNumberInSurah}
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Section Portion context if portion challenge */}
              {activeTarget?.hiddenType === 'portion' && (
                <div className="p-2 rounded-xl bg-amber-100/70 dark:bg-stone-800/90 border border-amber-900/20 mb-1.5 text-right shadow-xs" dir="rtl">
                  {activeTarget.portionSection === 'start' || (!activeTarget.visiblePrefix && activeTarget.visibleSuffix) ? (
                    <>
                      <span className="text-[10px] font-sans font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                        ✦ بِدَايَةُ الآيَةِ (Beginning Section):
                      </span>
                      <span className="font-quran text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                        <span className="text-red-600 dark:text-red-400 font-extrabold px-1 bg-red-100/80 dark:bg-red-950/50 rounded">[ ... ؟؟؟ ]</span> {activeTarget.visibleSuffix}
                      </span>
                    </>
                  ) : activeTarget.portionSection === 'middle' || (activeTarget.visiblePrefix && activeTarget.visibleSuffix) ? (
                    <>
                      <span className="text-[10px] font-sans font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                        ✦ وَسَطُ الآيَةِ (Middle Section):
                      </span>
                      <span className="font-quran text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                        {activeTarget.visiblePrefix} <span className="text-red-600 dark:text-red-400 font-extrabold px-1 bg-red-100/80 dark:bg-red-950/50 rounded">[ ... ؟؟؟ ]</span> {activeTarget.visibleSuffix}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-sans font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                        ✦ خَاتِمَةُ الآيَةِ (Ending Clause):
                      </span>
                      <span className="font-quran text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                        {activeTarget.visiblePrefix} <span className="text-red-600 dark:text-red-400 font-extrabold px-1 bg-red-100/80 dark:bg-red-950/50 rounded">[ ... ؟؟؟ ]</span>
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Options List (Vertical Stack) */}
            {!activeTarget ? (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-amber-900/70">
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

                  let cardStyle = "bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700/80 border-amber-900/20 text-stone-900 dark:text-stone-100";
                  let badgeStyle = "bg-amber-900/10 text-amber-950 border-amber-900/20";

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
                        {option.text}
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
      <div className="flex flex-col gap-1.5 border-t border-amber-900/15 pt-2 flex-shrink-0">
        
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
              className="flex-1 py-2 px-3 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{activeTarget?.isAnswered ? 'Next Blank' : 'Next Blank Step'}</span>
              <span className="hidden sm:inline text-[10px] opacity-70 font-mono flex items-center gap-0.5">
                <CornerDownLeft className="w-3 h-3" /> Space
              </span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          ) : (
            <button
              id="side-next-challenge-btn"
              onClick={onNextQuestion}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Shuffle className="w-4 h-4 text-amber-300" />
              <span>Shuffle New Blanks</span>
            </button>
          )}

          {activeTarget?.fullAyah?.audio && (
            <button
              id="side-listen-audio-btn"
              onClick={() => onPlayAudio?.(activeTarget.fullAyah.audio)}
              className="p-2 rounded-xl bg-amber-200/70 hover:bg-amber-300 text-amber-950 border border-amber-800/30 transition-colors cursor-pointer"
              title="Listen to ayah recitation"
            >
              <Volume2 className="w-4 h-4 text-amber-900" />
            </button>
          )}

          <button
            id="side-reset-page-blanks-btn"
            onClick={onResetPageBlanks}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-900/20 transition-colors cursor-pointer"
            title="Reset answers on this page"
          >
            <RotateCcw className="w-4 h-4 text-amber-900" />
          </button>
        </div>

        {/* Difficulty & Mode Selector Pills */}
        <div className="flex items-center justify-between text-[11px] text-amber-950 dark:text-amber-200 font-bold pt-0.5">
          <div className="flex items-center gap-1">
            <span className="opacity-70 text-[10px]">Mode:</span>
            <button
              onClick={() => onChangeChallengeType('full-ayah')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                challengeType === 'full-ayah' ? 'bg-amber-800 text-white' : 'hover:bg-amber-900/10'
              }`}
            >
              Full
            </button>
            <button
              onClick={() => onChangeChallengeType('portion-ayah')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                challengeType === 'portion-ayah' ? 'bg-amber-800 text-white' : 'hover:bg-amber-900/10'
              }`}
            >
              Portion
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="opacity-70 text-[10px]">Level:</span>
            <button
              onClick={() => onChangeDifficulty('easy')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                difficulty === 'easy' ? 'bg-amber-800 text-white' : 'hover:bg-amber-900/10'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => onChangeDifficulty('medium')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                difficulty === 'medium' ? 'bg-amber-800 text-white' : 'hover:bg-amber-900/10'
              }`}
            >
              Med
            </button>
            <button
              onClick={() => onChangeDifficulty('hafiz')}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                difficulty === 'hafiz' ? 'bg-amber-800 text-white' : 'hover:bg-amber-900/10'
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

