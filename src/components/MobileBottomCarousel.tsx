import React, { useState, useEffect, useRef } from 'react';
import { BlankTarget, CarouselOption, Surah, DifficultyLevel } from '../types';
import { 
  Settings, CheckCircle2, XCircle, ArrowRight,
  Sparkles, CheckCheck, Play, Pause, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

interface MobileBottomCarouselProps {
  blankTargets: BlankTarget[];
  activeBlankIndex: number;
  onSelectBlankIndex: (index: number) => void;
  selectedOption: CarouselOption | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelectOption: (option: CarouselOption) => void;
  onNextQuestion: () => void;
  onResetPageBlanks: () => void;
  onPlayAudio?: (audioUrl?: string) => void;
  currentSurah: Surah;
  currentPageNumber: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  difficulty: DifficultyLevel;
  onOpenSettings: () => void;
  onOpenReview?: () => void;
  mistakesCount?: number;
  showTranslation?: boolean;
}

export const MobileBottomCarousel: React.FC<MobileBottomCarouselProps> = ({
  blankTargets,
  activeBlankIndex,
  onSelectBlankIndex,
  selectedOption,
  onSelectOption,
  onPlayAudio,
  currentSurah,
  currentPageNumber,
  onNextPage,
  onPreviousPage,
  autoAdvance,
  onOpenSettings,
  showTranslation = false,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownPaused, setIsCountdownPaused] = useState<boolean>(false);
  const [activeCarouselCardIndex, setActiveCarouselCardIndex] = useState<number>(0);
  
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const activeTarget: BlankTarget | null = blankTargets[activeBlankIndex] || blankTargets[0] || null;
  const options = activeTarget?.options || [];

  const totalBlanks = blankTargets.length;
  const answeredCount = blankTargets.filter(b => b.isAnswered).length;
  const correctCount = blankTargets.filter(b => b.isCorrect).length;
  const isPageAllCompleted = totalBlanks > 0 && answeredCount === totalBlanks;

  // Reset carousel scroll when switching blanks or pages
  useEffect(() => {
    if (carouselTrackRef.current) {
      carouselTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setActiveCarouselCardIndex(0);
    }
  }, [activeBlankIndex, currentPageNumber]);

  // Track active visible card on horizontal scroll
  const handleScroll = () => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const cards = track.querySelectorAll('[data-option-card]');
    if (cards.length > 0) {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIdx = 0;
      let minDistance = Infinity;
      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - trackCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setActiveCarouselCardIndex(closestIdx);
    } else {
      const scrollLeft = track.scrollLeft;
      const cardWidth = track.clientWidth * 0.75;
      if (cardWidth > 0) {
        const cardIdx = Math.round(scrollLeft / cardWidth);
        setActiveCarouselCardIndex(Math.max(0, Math.min(options.length - 1, cardIdx)));
      }
    }
  };

  // Scroll to card index with smooth centering
  const scrollToCard = (index: number) => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const cards = track.querySelectorAll('[data-option-card]');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveCarouselCardIndex(index);
      triggerHaptic('light');
    } else {
      const cardWidth = track.clientWidth * 0.75;
      track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      setActiveCarouselCardIndex(index);
    }
  };

  // Auto-advance countdown on page completion
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPageAllCompleted && autoAdvance && !isCountdownPaused) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer!);
            onNextPage();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isPageAllCompleted) {
      setCountdown(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPageAllCompleted, autoAdvance, isCountdownPaused, onNextPage]);

  // Haptic feedback on completing all blanks on mobile
  useEffect(() => {
    if (isPageAllCompleted) {
      triggerHaptic('celebrate');
    }
  }, [isPageAllCompleted]);

  // Next blank or next page action handler
  const handleAdvance = () => {
    triggerHaptic('light');
    if (isPageAllCompleted) {
      onNextPage();
    } else {
      const nextUnansweredIdx = blankTargets.findIndex((b, i) => i > activeBlankIndex && !b.isAnswered);
      if (nextUnansweredIdx !== -1) {
        onSelectBlankIndex(nextUnansweredIdx);
      } else if (activeBlankIndex < totalBlanks - 1) {
        onSelectBlankIndex(activeBlankIndex + 1);
      } else {
        const firstUnanswered = blankTargets.findIndex(b => !b.isAnswered);
        if (firstUnanswered !== -1) {
          onSelectBlankIndex(firstUnanswered);
        } else {
          onNextPage();
        }
      }
    }
  };

  return (
    <div 
      id="mobile-bottom-carousel" 
      className="w-full flex flex-col bg-[#fcf9f2] dark:bg-[#181c20] border-t-2 border-amber-900/30 dark:border-amber-700/40 shadow-2xl rounded-t-2xl overflow-hidden flex-shrink-0 z-30 select-none"
    >
      {/* 1. Sleek Top Bar: Blank Stepper + Page Numbers Toggle (Clean, zero overlap) */}
      <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 bg-amber-950/5 dark:bg-stone-900/80 border-b border-amber-900/15 flex-shrink-0 text-xs gap-2">
        
        {/* Left: Blank Options Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900/70 dark:text-amber-300/70 flex-shrink-0">
            Blanks:
          </span>
          {blankTargets.map((target, idx) => {
            const isActive = idx === activeBlankIndex;
            let btnClass = "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700";

            if (target.isAnswered) {
              if (target.isCorrect) {
                btnClass = isActive 
                  ? "bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs ring-1 ring-emerald-400" 
                  : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 font-bold";
              } else {
                btnClass = isActive 
                  ? "bg-rose-600 text-white border-rose-700 font-bold shadow-xs ring-1 ring-rose-400" 
                  : "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300 font-bold";
              }
            } else if (isActive) {
              btnClass = "bg-amber-800 text-white border-amber-900 shadow-xs font-bold ring-1 ring-amber-500/40";
            }

            return (
              <button
                key={target.id}
                id={`mobile-blank-tab-${idx}`}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectBlankIndex(idx);
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-sans border transition-all cursor-pointer flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 ${btnClass}`}
                title={`Blank ${idx + 1}`}
              >
                <span>({idx + 1})</span>
                {target.isAnswered && (
                  target.isCorrect ? <CheckCircle2 className="w-3 h-3 text-white dark:text-emerald-300" /> : <XCircle className="w-3 h-3 text-white dark:text-rose-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Page Numbers Toggle & Settings */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          
          {/* Quick Page Navigation Toggle */}
          <div className="flex items-center rounded-xl bg-amber-900/10 dark:bg-stone-800 p-0.5 border border-amber-900/20 text-xs font-bold shadow-2xs">
            <button
              id="mobile-next-page-header-btn"
              onClick={onNextPage}
              disabled={currentPageNumber >= 604}
              className="p-1 px-1.5 text-amber-900 dark:text-amber-200 hover:bg-amber-900/10 rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
              title="Next Page (Advance in RTL)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-sans font-bold text-amber-950 dark:text-amber-100 whitespace-nowrap">
              P.{currentPageNumber}
            </span>
            <button
              id="mobile-prev-page-header-btn"
              onClick={onPreviousPage}
              disabled={currentPageNumber <= 1}
              className="p-1 px-1.5 text-amber-900 dark:text-amber-200 hover:bg-amber-900/10 rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
              title="Previous Page (Return toward Page 1)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Settings Trigger Icon */}
          <button
            id="mobile-open-settings-btn"
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-700 shadow-xs cursor-pointer flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
            title="Settings & Modes"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Main Horizontal Carousel Stage with Prominent Side Navigation Arrows */}
      <div className="relative w-full py-2 px-1 flex flex-col justify-center min-h-[110px] max-h-[135px] overflow-hidden">
        {!activeTarget ? (
          <div className="p-4 text-center text-xs text-amber-900/70 dark:text-amber-300/70">
            Generating blank options for Page {currentPageNumber}...
          </div>
        ) : isPageAllCompleted ? (
          /* Page Completed Banner */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-3 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white shadow-md flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <CheckCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm font-display tracking-wide">
                  PAGE {currentPageNumber} COMPLETED!
                </h4>
                <p className="text-[11px] text-emerald-100">
                  Score: <strong className="text-white font-bold">{correctCount}/{totalBlanks}</strong> correct
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="mobile-next-page-celebrate-btn"
                onClick={onNextPage}
                className="py-1.5 px-3 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <span>Next P.{currentPageNumber + 1}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
              </button>

              {countdown !== null && (
                <button
                  onClick={() => setIsCountdownPaused(!isCountdownPaused)}
                  className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-200 border border-emerald-400/30 text-[10px] flex items-center gap-0.5"
                  title={isCountdownPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
                >
                  {isCountdownPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{countdown}s</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Horizontal Cards Carousel with Prominent Navigation Buttons */
          <div className="relative w-full flex items-center">
            
            {/* Prominent Left Carousel Navigation Button */}
            {activeCarouselCardIndex > 0 && (
              <button
                onClick={() => scrollToCard(activeCarouselCardIndex - 1)}
                className="absolute left-1.5 z-20 w-9 h-9 rounded-full bg-amber-900/90 dark:bg-stone-800/95 text-amber-100 flex items-center justify-center shadow-lg border border-amber-700/50 cursor-pointer backdrop-blur-xs transition-all active:scale-90 hover:bg-amber-800"
                title="Previous Option"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Horizontal Track with scroll snap */}
            <div 
              ref={carouselTrackRef}
              onScroll={handleScroll}
              className="w-full flex flex-row gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-1 items-stretch"
            >
              {options.map((option, idx) => {
                const isSelected = Boolean(
                  (activeTarget?.selectedOption?.id === option.id) || 
                  (selectedOption?.id === option.id && activeTarget?.isAnswered)
                );
                const optionLetter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;

                let cardStyle = "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-amber-900/25 shadow-sm";
                let badgeStyle = "bg-amber-900/10 text-amber-950 dark:text-amber-200 border-amber-900/20";

                if (activeTarget?.isAnswered) {
                  if (option.isCorrect) {
                    cardStyle = "bg-emerald-50 dark:bg-emerald-950/90 border-2 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-md";
                    badgeStyle = "bg-emerald-600 text-white border-emerald-700";
                  } else if (isSelected && !option.isCorrect) {
                    cardStyle = "bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-600 text-rose-950 dark:text-rose-100 shadow-md";
                    badgeStyle = "bg-rose-600 text-white border-rose-700";
                  } else {
                    cardStyle = "bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-400 opacity-50";
                    badgeStyle = "bg-stone-200 text-stone-600 border-stone-300";
                  }
                }

                return (
                  <button
                    key={option.id}
                    data-option-card="true"
                    id={`mobile-option-card-${idx}`}
                    onClick={() => !activeTarget?.isAnswered && onSelectOption(option)}
                    disabled={activeTarget?.isAnswered}
                    className={`relative w-[74vw] sm:w-[280px] max-w-[300px] min-w-[220px] flex-shrink-0 snap-center text-right p-2.5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer select-none active:scale-98 ${cardStyle}`}
                  >
                    {/* Top Row: Option Badge & Status Indicator */}
                    <div className="flex items-center justify-between w-full mb-1" dir="ltr">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold font-sans border ${badgeStyle}`}>
                        {optionLetter}
                      </span>

                      {activeTarget?.isAnswered && option.isCorrect && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      )}

                      {activeTarget?.isAnswered && isSelected && !option.isCorrect && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </span>
                      )}

                      {!activeTarget?.isAnswered && (
                        <span className="text-[10px] font-sans text-amber-900/60 dark:text-amber-300/60">
                          Tap to select
                        </span>
                      )}
                    </div>

                    {/* Arabic Verse Option Text */}
                    <div 
                      className="font-quran text-base sm:text-lg font-bold leading-relaxed text-right w-full py-0.5 truncate"
                      dir="rtl"
                      title={option.text}
                    >
                      {option.text}
                    </div>

                    {/* English translation if enabled in Settings */}
                    {showTranslation && option.translation && (
                      <div className="text-[10px] font-sans text-stone-600 dark:text-stone-300 text-left line-clamp-1 border-t border-amber-900/10 pt-0.5 mt-0.5" dir="ltr">
                        {option.translation}
                      </div>
                    )}

                    {/* Mutashabih explanation if answered */}
                    {activeTarget?.isAnswered && option.explanation && (
                      <div className="text-[9px] font-sans font-medium text-amber-950/80 dark:text-amber-200/80 text-left line-clamp-1 border-t border-dashed border-amber-900/15 pt-0.5 mt-0.5" dir="ltr">
                        ℹ️ {option.explanation}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prominent Right Carousel Navigation Button */}
            {activeCarouselCardIndex < options.length - 1 && (
              <button
                onClick={() => scrollToCard(activeCarouselCardIndex + 1)}
                className="absolute right-1.5 z-20 w-9 h-9 rounded-full bg-amber-900/90 dark:bg-stone-800/95 text-amber-100 flex items-center justify-center shadow-lg border border-amber-700/50 cursor-pointer backdrop-blur-xs transition-all active:scale-90 hover:bg-amber-800"
                title="Next Option"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

          </div>
        )}
      </div>

      {/* 3. Bottom Carousel Footer: Ergonomic Thumb Controls for Reachable Option Navigation */}
      <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 bg-amber-950/5 dark:bg-stone-900/90 border-t border-amber-900/15 flex-shrink-0 gap-2">
        
        {/* Left Thumb Action: Previous Option Button */}
        <button
          id="mobile-carousel-prev-btn"
          onClick={() => scrollToCard(Math.max(0, activeCarouselCardIndex - 1))}
          disabled={activeCarouselCardIndex === 0}
          className="min-h-[38px] px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border shadow-2xs active:scale-95 disabled:opacity-25 disabled:pointer-events-none bg-white dark:bg-stone-800 text-amber-950 dark:text-amber-100 border-amber-900/20 hover:bg-amber-50 dark:hover:bg-stone-700"
          title="Previous Option"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Prev</span>
        </button>

        {/* Center: Interactive Option Letter Jump Buttons (A, B, C, D) */}
        <div className="flex items-center gap-1 bg-amber-900/10 dark:bg-stone-800/90 p-1 rounded-xl border border-amber-900/15">
          {options.map((opt, idx) => {
            const isCardActive = idx === activeCarouselCardIndex;
            const letter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
            let pillClass = "bg-transparent text-amber-950 dark:text-amber-200 hover:bg-amber-900/20";
            
            if (activeTarget?.isAnswered) {
              if (opt.isCorrect) {
                pillClass = isCardActive 
                  ? "bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-400" 
                  : "bg-emerald-600/80 text-white font-bold";
              } else if (activeTarget.selectedOption?.id === opt.id) {
                pillClass = isCardActive 
                  ? "bg-rose-600 text-white font-black shadow-xs ring-2 ring-rose-400" 
                  : "bg-rose-600/80 text-white font-bold";
              } else if (isCardActive) {
                pillClass = "bg-amber-800 text-white font-bold shadow-xs";
              }
            } else if (isCardActive) {
              pillClass = "bg-amber-800 text-white font-bold shadow-xs";
            }

            return (
              <button
                key={opt.id}
                id={`mobile-quick-option-${idx}`}
                onClick={() => scrollToCard(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center active:scale-90 ${pillClass}`}
                title={`Jump to Option ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Right Thumb Action: Next Option OR Next Blank if Answered */}
        {activeTarget?.isAnswered ? (
          <button
            id="mobile-advance-blank-btn"
            onClick={handleAdvance}
            className="min-h-[38px] px-3.5 rounded-xl bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>{activeBlankIndex < totalBlanks - 1 ? 'Next Blank' : 'Next Page'}</span>
            <ArrowRight className="w-4 h-4 text-amber-300 stroke-[2.5]" />
          </button>
        ) : (
          <button
            id="mobile-carousel-next-btn"
            onClick={() => scrollToCard(Math.min(options.length - 1, activeCarouselCardIndex + 1))}
            disabled={activeCarouselCardIndex >= options.length - 1}
            className="min-h-[38px] px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border shadow-2xs active:scale-95 disabled:opacity-25 disabled:pointer-events-none bg-amber-800 hover:bg-amber-700 text-amber-50 border-amber-900"
            title="Next Option"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

      </div>

    </div>
  );
};
