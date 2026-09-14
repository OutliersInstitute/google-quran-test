import React, { useState, useEffect, useRef } from 'react';
import { BlankTarget, CarouselOption, Surah, DifficultyLevel } from '../types';
import { 
  Settings, CheckCircle2, XCircle, ArrowRight, Eye, EyeOff, 
  Sparkles, CheckCheck, Play, Pause, ChevronLeft, ChevronRight, Volume2
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
}) => {
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
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
    const scrollLeft = track.scrollLeft;
    const cardWidth = track.clientWidth * 0.75;
    if (cardWidth > 0) {
      const cardIdx = Math.round(scrollLeft / cardWidth);
      setActiveCarouselCardIndex(Math.max(0, Math.min(options.length - 1, cardIdx)));
    }
  };

  // Scroll to card index
  const scrollToCard = (index: number) => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const cardWidth = track.clientWidth * 0.75;
    track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    setActiveCarouselCardIndex(index);
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

  // Section label in Arabic and English for Hafiz context
  const portionLabel = activeTarget?.portionSection === 'start'
    ? 'بِدَايَةُ الآيَةِ • Beginning'
    : activeTarget?.portionSection === 'middle'
    ? 'وَسَطُ الآيَةِ • Middle'
    : activeTarget?.portionSection === 'end'
    ? 'خَاتِمَةُ الآيَةِ • Ending'
    : 'Portion';

  return (
    <div 
      id="mobile-bottom-carousel" 
      className="w-full flex flex-col bg-[#fcf9f2] dark:bg-[#181c20] border-t-2 border-amber-900/30 dark:border-amber-700/40 shadow-2xl rounded-t-2xl overflow-hidden flex-shrink-0 z-30 select-none"
    >
      {/* 1. Sleek Top Bar: Blank Stepper + Ayah Ref + Quick Controls */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-amber-950/5 dark:bg-stone-900/80 border-b border-amber-900/15 flex-shrink-0 text-xs">
        
        {/* Left: Blank Pills + Ayah Reference */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {blankTargets.map((target, idx) => {
            const isActive = idx === activeBlankIndex;
            let btnClass = "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700";

            if (target.isAnswered) {
              if (target.isCorrect) {
                btnClass = isActive 
                  ? "bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs" 
                  : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 font-bold";
              } else {
                btnClass = isActive 
                  ? "bg-rose-600 text-white border-rose-700 font-bold shadow-xs" 
                  : "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300 font-bold";
              }
            } else if (isActive) {
              btnClass = "bg-amber-800 text-white border-amber-900 shadow-xs font-bold";
            }

            return (
              <button
                key={target.id}
                id={`mobile-blank-tab-${idx}`}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectBlankIndex(idx);
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-sans border transition-all cursor-pointer flex items-center gap-0.5 whitespace-nowrap ${btnClass}`}
                title={`Blank ${idx + 1}`}
              >
                <span>({idx + 1})</span>
                {target.isAnswered && (
                  target.isCorrect ? <CheckCircle2 className="w-3 h-3 text-white dark:text-emerald-300" /> : <XCircle className="w-3 h-3 text-white dark:text-rose-300" />
                )}
              </button>
            );
          })}

          {activeTarget && (
            <span className="text-[11px] font-sans font-bold text-amber-950 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/40 px-2 py-0.5 rounded-md whitespace-nowrap">
              Ayah {activeTarget.ayahNumberInSurah} <span className="text-[10px] font-normal opacity-80">({portionLabel})</span>
            </span>
          )}
        </div>

        {/* Right: Quick Page Navigation & Tools */}
        <div className="flex items-center gap-1 flex-shrink-0">
          
          {/* Quick Page Flip buttons (RTL Quran order: Left/back arrow advances to Next Page, Right arrow goes to Previous Page) */}
          <div className="flex items-center rounded-lg bg-amber-900/10 dark:bg-stone-800 p-0.5 border border-amber-900/20 text-[11px] font-bold">
            <button
              onClick={onNextPage}
              disabled={currentPageNumber >= 604}
              className="p-1 text-amber-900 dark:text-amber-200 hover:bg-amber-900/10 rounded disabled:opacity-30 cursor-pointer"
              title="Next Page (Advance in RTL)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[10px] font-sans text-amber-950 dark:text-amber-100">
              P.{currentPageNumber}
            </span>
            <button
              onClick={onPreviousPage}
              disabled={currentPageNumber <= 1}
              className="p-1 text-amber-900 dark:text-amber-200 hover:bg-amber-900/10 rounded disabled:opacity-30 cursor-pointer"
              title="Previous Page (Return toward Page 1)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Play Button */}
          {activeTarget?.fullAyah?.audio && (
            <button
              onClick={() => onPlayAudio?.(activeTarget.fullAyah.audio)}
              className="p-1 px-1.5 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 border border-amber-900/20 text-xs font-medium cursor-pointer"
              title="Listen to recitation"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Translation Toggle */}
          <button
            id="mobile-toggle-trans-btn"
            onClick={() => setShowTranslations(!showTranslations)}
            className={`p-1 px-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-0.5 ${
              showTranslations 
                ? 'bg-amber-800 text-white border-amber-800' 
                : 'bg-amber-100/70 dark:bg-stone-800 text-amber-950 dark:text-amber-200 border-amber-900/20'
            }`}
            title="Toggle English Translation"
          >
            {showTranslations ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span className="text-[10px] font-sans font-bold">EN</span>
          </button>

          {/* Settings Trigger Icon (matching the sketch rosette/flower) */}
          <button
            id="mobile-open-settings-btn"
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-700 shadow-xs cursor-pointer flex items-center justify-center transition-transform active:scale-95"
            title="Settings & Modes"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Main Horizontal Carousel Stage (as sketched: horizontal cards side-by-side) */}
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
          /* Horizontal Cards Carousel (The Sketch Layout) */
          <div className="relative w-full flex items-center">
            
            {/* Left Carousel Navigation Peek Button */}
            {activeCarouselCardIndex > 0 && (
              <button
                onClick={() => scrollToCard(activeCarouselCardIndex - 1)}
                className="absolute left-1 z-10 w-6 h-6 rounded-full bg-amber-950/70 text-white flex items-center justify-center shadow-md cursor-pointer backdrop-blur-xs transition-transform active:scale-90"
                title="Previous Option"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Horizontal Track with scroll snap */}
            <div 
              ref={carouselTrackRef}
              onScroll={handleScroll}
              className="w-full flex flex-row gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-3 py-1 items-stretch"
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
                    id={`mobile-option-card-${idx}`}
                    onClick={() => !activeTarget?.isAnswered && onSelectOption(option)}
                    disabled={activeTarget?.isAnswered}
                    className={`relative w-[72vw] sm:w-[270px] max-w-[290px] min-w-[220px] flex-shrink-0 snap-center text-right p-2.5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer select-none active:scale-98 ${cardStyle}`}
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

                    {/* Arabic Verse Option Text (Clean concise portion, fitting perfectly in card!) */}
                    <div 
                      className="font-quran text-base sm:text-lg font-bold leading-relaxed text-right w-full py-0.5 truncate"
                      dir="rtl"
                      title={option.text}
                    >
                      {option.text}
                    </div>

                    {/* English translation if enabled */}
                    {showTranslations && option.translation && (
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

            {/* Right Carousel Navigation Peek Button */}
            {activeCarouselCardIndex < options.length - 1 && (
              <button
                onClick={() => scrollToCard(activeCarouselCardIndex + 1)}
                className="absolute right-1 z-10 w-6 h-6 rounded-full bg-amber-950/70 text-white flex items-center justify-center shadow-md cursor-pointer backdrop-blur-xs transition-transform active:scale-90"
                title="Next Option"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

          </div>
        )}
      </div>

      {/* 3. Bottom Carousel Footer: Carousel Indicators + Advance Action Button */}
      <div className="flex items-center justify-between px-3 py-1 bg-amber-950/5 dark:bg-stone-900/70 border-t border-amber-900/15 flex-shrink-0">
        
        {/* Card Dots Indicator */}
        <div className="flex items-center gap-1.5">
          {options.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic('light');
                scrollToCard(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === activeCarouselCardIndex 
                  ? 'w-4 bg-amber-800 dark:bg-amber-400' 
                  : 'bg-stone-300 dark:bg-stone-600 hover:bg-amber-600'
              }`}
              title={`Option ${['A', 'B', 'C', 'D'][idx]}`}
            />
          ))}
          <span className="text-[10px] font-sans text-stone-500 dark:text-stone-400 ml-1">
            {activeCarouselCardIndex + 1}/{options.length}
          </span>
        </div>

        {/* Action Button: Next Blank or Next Page */}
        {activeTarget?.isAnswered && (
          <button
            id="mobile-advance-blank-btn"
            onClick={handleAdvance}
            className="py-1 px-3.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>{activeBlankIndex < totalBlanks - 1 ? 'Next Blank' : 'Next Page'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        )}

      </div>

    </div>
  );
};
