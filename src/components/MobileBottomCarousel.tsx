import React, { useState, useEffect, useRef } from 'react';
import { BlankTarget, CarouselOption, Surah, DifficultyLevel, MushafTheme } from '../types';
import { 
  Settings, CheckCircle2, XCircle, ArrowRight,
  Sparkles, CheckCheck, Play, Pause, ChevronLeft, ChevronRight, Home, Trophy
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
  onNavigateHome?: () => void;
  onNavigateLeagues?: () => void;
  onOpenReview?: () => void;
  mistakesCount?: number;
  showTranslation?: boolean;
  theme?: MushafTheme;
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
  onNavigateHome,
  onNavigateLeagues,
  showTranslation = false,
  theme = 'moonstone',
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

  const t = {
    moonstone: {
      container: 'bg-white text-[#20373B] border-t-2 border-[#519CAB]/30 shadow-2xl',
      topBar: 'bg-white border-b border-[#519CAB]/15 text-[#20373B]',
      topBarLabel: 'text-[#519CAB]',
      blankDefault: 'bg-stone-50 text-[#20373B] border-[#519CAB]/20',
      blankActive: 'bg-[#519CAB] text-white border-[#519CAB] font-bold shadow-xs ring-1 ring-[#519CAB]/40',
      navToggleBg: 'bg-black/5 dark:bg-white/5 border-[#519CAB]/20',
      navToggleText: 'text-[#20373B]',
      navIconBtn: 'bg-black/5 hover:bg-black/10 text-[#20373B] border border-[#519CAB]/20',
      settingsBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white border-[#519CAB]',
      contextBar: 'bg-black/5 text-[#20373B] border-b border-[#519CAB]/10',
      cardDefault: 'bg-white text-[#20373B] border-[#519CAB]/25 shadow-xs hover:border-[#519CAB]/60',
      badgeDefault: 'bg-[#519CAB]/10 text-[#519CAB] border-[#519CAB]/30',
      tapPrompt: 'text-[#519CAB]/80',
      footer: 'bg-white border-t border-[#519CAB]/15 text-[#20373B]',
      prevBtn: 'bg-white text-[#20373B] border-[#519CAB]/20 hover:bg-stone-50',
      pillsBg: 'bg-black/5 border border-[#519CAB]/20',
      pillDefault: 'text-[#20373B] hover:bg-[#519CAB]/15',
      pillActive: 'bg-[#519CAB] text-white font-bold shadow-xs',
      advanceBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white font-bold',
      advanceIcon: 'text-[#FFC64F]',
      nextBtn: 'bg-[#519CAB] hover:bg-[#438795] text-white border-[#519CAB]',
      carouselNavBtn: 'bg-[#519CAB] text-white border border-[#438795] shadow-lg hover:bg-[#438795]',
    },
    parchment: {
      container: 'bg-[#fcf9f2] dark:bg-[#181c20] text-stone-900 dark:text-stone-100 border-t-2 border-amber-900/30 dark:border-amber-700/40 shadow-2xl',
      topBar: 'bg-amber-950/5 dark:bg-stone-900/80 border-b border-amber-900/15 text-stone-900 dark:text-stone-100',
      topBarLabel: 'text-amber-900/70 dark:text-amber-300/70',
      blankDefault: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700',
      blankActive: 'bg-amber-800 text-white border-amber-900 font-bold shadow-xs ring-1 ring-amber-500/40',
      navToggleBg: 'bg-amber-900/10 dark:bg-stone-800 border-amber-900/20',
      navToggleText: 'text-amber-950 dark:text-amber-100',
      navIconBtn: 'bg-amber-900/15 hover:bg-amber-900/25 text-amber-950 dark:text-amber-100 border border-amber-900/20',
      settingsBtn: 'bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-700',
      contextBar: 'bg-amber-900/5 dark:bg-stone-900/40 text-amber-950 dark:text-amber-200 border-b border-amber-900/10',
      cardDefault: 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-amber-900/25 shadow-sm hover:border-amber-700/40',
      badgeDefault: 'bg-amber-900/10 text-amber-950 dark:text-amber-200 border-amber-900/20',
      tapPrompt: 'text-amber-900/60 dark:text-amber-300/60',
      footer: 'bg-amber-950/5 dark:bg-stone-900/90 border-t border-amber-900/15 text-stone-900 dark:text-stone-100',
      prevBtn: 'bg-white dark:bg-stone-800 text-amber-950 dark:text-amber-100 border-amber-900/20 hover:bg-amber-50 dark:hover:bg-stone-700',
      pillsBg: 'bg-amber-900/10 dark:bg-stone-800/90 border border-amber-900/15',
      pillDefault: 'text-amber-950 dark:text-amber-200 hover:bg-amber-900/20',
      pillActive: 'bg-amber-800 text-white font-bold shadow-xs',
      advanceBtn: 'bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 text-white font-bold',
      advanceIcon: 'text-amber-300',
      nextBtn: 'bg-amber-800 hover:bg-amber-700 text-amber-50 border-amber-900',
      carouselNavBtn: 'bg-amber-900/90 dark:bg-stone-800/95 text-amber-100 border border-amber-700/50 shadow-lg hover:bg-amber-800',
    },
    emerald: {
      container: 'bg-[#f3f7f4] text-[#0f281e] border-t-2 border-emerald-900/30 shadow-2xl',
      topBar: 'bg-emerald-950/5 border-b border-emerald-900/15 text-[#0f281e]',
      topBarLabel: 'text-emerald-900/80',
      blankDefault: 'bg-stone-100 text-stone-700 border-stone-300',
      blankActive: 'bg-emerald-800 text-white border-emerald-900 font-bold shadow-xs ring-1 ring-emerald-500/40',
      navToggleBg: 'bg-emerald-900/10 border-emerald-900/20',
      navToggleText: 'text-emerald-950',
      navIconBtn: 'bg-emerald-900/15 hover:bg-emerald-900/25 text-emerald-950 border border-emerald-900/20',
      settingsBtn: 'bg-emerald-800 hover:bg-emerald-700 text-emerald-50 border border-emerald-700',
      contextBar: 'bg-emerald-950/5 text-emerald-950 border-b border-emerald-900/10',
      cardDefault: 'bg-white text-[#0f281e] border-emerald-900/20 shadow-sm hover:border-emerald-700/50',
      badgeDefault: 'bg-emerald-900/10 text-emerald-950 border-emerald-900/20',
      tapPrompt: 'text-emerald-900/60',
      footer: 'bg-emerald-950/5 border-t border-emerald-900/15 text-[#0f281e]',
      prevBtn: 'bg-white text-emerald-950 border-emerald-900/20 hover:bg-emerald-50',
      pillsBg: 'bg-emerald-900/10 border border-emerald-900/15',
      pillDefault: 'text-emerald-950 hover:bg-emerald-900/20',
      pillActive: 'bg-emerald-800 text-white font-bold shadow-xs',
      advanceBtn: 'bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 text-white font-bold',
      advanceIcon: 'text-emerald-200',
      nextBtn: 'bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-900',
      carouselNavBtn: 'bg-emerald-800 text-white border border-emerald-700 shadow-lg hover:bg-emerald-700',
    },
    midnight: {
      container: 'bg-[#14181c] text-[#f1ece1] border-t-2 border-stone-700 shadow-2xl',
      topBar: 'bg-[#181d22] border-b border-stone-800 text-[#f1ece1]',
      topBarLabel: 'text-amber-400/80',
      blankDefault: 'bg-stone-800 text-stone-300 border-stone-700',
      blankActive: 'bg-amber-500 text-stone-950 border-amber-600 font-bold shadow-xs ring-1 ring-amber-400',
      navToggleBg: 'bg-stone-800 border-stone-700',
      navToggleText: 'text-amber-400',
      navIconBtn: 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700',
      settingsBtn: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold border-amber-500',
      contextBar: 'bg-stone-800/80 text-amber-200 border-b border-stone-700',
      cardDefault: 'bg-[#1a2128] text-stone-100 border-stone-700 shadow-sm hover:border-amber-400/50',
      badgeDefault: 'bg-stone-800 text-amber-400 border-stone-700',
      tapPrompt: 'text-amber-400/60',
      footer: 'bg-[#181d22] border-t border-stone-800 text-[#f1ece1]',
      prevBtn: 'bg-stone-800 text-amber-400 border-stone-700 hover:bg-stone-700',
      pillsBg: 'bg-stone-800/90 border border-stone-700',
      pillDefault: 'text-amber-400 hover:bg-stone-700',
      pillActive: 'bg-amber-500 text-stone-950 font-bold shadow-xs',
      advanceBtn: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold',
      advanceIcon: 'text-stone-950',
      nextBtn: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold border-amber-500',
      carouselNavBtn: 'bg-stone-800 text-amber-400 border border-stone-700 shadow-lg hover:bg-stone-700',
    },
    'classic-white': {
      container: 'bg-[#f8f9fa] text-stone-900 border-t-2 border-stone-300 shadow-2xl',
      topBar: 'bg-stone-100 border-b border-stone-200 text-stone-900',
      topBarLabel: 'text-stone-700',
      blankDefault: 'bg-white text-stone-700 border-stone-300',
      blankActive: 'bg-stone-900 text-white border-stone-950 font-bold shadow-xs ring-1 ring-stone-500',
      navToggleBg: 'bg-stone-200 border-stone-300',
      navToggleText: 'text-stone-900',
      navIconBtn: 'bg-stone-200 hover:bg-stone-300 text-stone-900 border border-stone-300',
      settingsBtn: 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900',
      contextBar: 'bg-stone-200/60 text-stone-900 border-b border-stone-300',
      cardDefault: 'bg-white text-stone-900 border-stone-200 shadow-sm hover:border-stone-400',
      badgeDefault: 'bg-stone-200 text-stone-900 border-stone-300',
      tapPrompt: 'text-stone-500',
      footer: 'bg-stone-100 border-t border-stone-200 text-stone-900',
      prevBtn: 'bg-white text-stone-900 border-stone-300 hover:bg-stone-50',
      pillsBg: 'bg-stone-200 border border-stone-300',
      pillDefault: 'text-stone-900 hover:bg-stone-300',
      pillActive: 'bg-stone-900 text-white font-bold shadow-xs',
      advanceBtn: 'bg-stone-900 hover:bg-stone-800 text-white font-bold',
      advanceIcon: 'text-stone-300',
      nextBtn: 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900',
      carouselNavBtn: 'bg-stone-900 text-white border border-stone-800 shadow-lg hover:bg-stone-800',
    },
  }[theme];

  return (
    <div 
      id="mobile-bottom-carousel" 
      className={`w-full flex flex-col ${t.container} rounded-t-2xl overflow-hidden flex-shrink-0 z-30 select-none`}
    >
      {/* 1. Sleek Top Bar: Blank Stepper + Page Numbers Toggle (Clean, zero overlap) */}
      <div className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 ${t.topBar} flex-shrink-0 text-xs gap-2`}>
        
        {/* Left: Blank Options Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
          <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${t.topBarLabel} flex-shrink-0`}>
            Blanks:
          </span>
          {blankTargets.map((target, idx) => {
            const isActive = idx === activeBlankIndex;
            let btnClass = t.blankDefault;

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
              btnClass = t.blankActive;
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
                title={`Blank ${idx + 1} - Ayah ${target.ayahNumberInSurah}${target.subAyahPart ? ` (Part ${target.subAyahPart.partIndex}/${target.subAyahPart.totalParts}: ${target.subAyahPart.label})` : ''}`}
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
          <div className={`flex items-center rounded-xl ${t.navToggleBg} p-0.5 border text-xs font-bold shadow-2xs`}>
            <button
              id="mobile-next-page-header-btn"
              onClick={onNextPage}
              disabled={currentPageNumber >= 604}
              className={`p-1 px-1.5 ${t.navToggleText} opacity-80 hover:opacity-100 rounded-lg disabled:opacity-30 cursor-pointer transition-colors`}
              title="Next Page (Advance in RTL)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className={`px-1.5 text-[11px] font-sans font-bold ${t.navToggleText} whitespace-nowrap`}>
              P.{currentPageNumber}
            </span>
            <button
              id="mobile-prev-page-header-btn"
              onClick={onPreviousPage}
              disabled={currentPageNumber <= 1}
              className={`p-1 px-1.5 ${t.navToggleText} opacity-80 hover:opacity-100 rounded-lg disabled:opacity-30 cursor-pointer transition-colors`}
              title="Previous Page (Return toward Page 1)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Home Dashboard Trigger Icon */}
          {onNavigateHome && (
            <button
              id="mobile-home-btn"
              onClick={() => {
                triggerHaptic('light');
                onNavigateHome();
              }}
              className={`p-1.5 rounded-xl ${t.navIconBtn} shadow-xs cursor-pointer flex items-center justify-center transition-transform active:scale-95 flex-shrink-0`}
              title="Return to Home Dashboard & Goals"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Social Leagues Trigger Icon */}
          {onNavigateLeagues && (
            <button
              id="mobile-leagues-btn"
              onClick={() => {
                triggerHaptic('light');
                onNavigateLeagues();
              }}
              className={`p-1.5 rounded-xl ${t.navIconBtn} shadow-xs cursor-pointer flex items-center justify-center transition-transform active:scale-95 flex-shrink-0`}
              title="Open Social Leagues & Leaderboards"
            >
              <Trophy className="w-3.5 h-3.5 text-[#FFC64F]" />
            </button>
          )}

          {/* Settings Trigger Icon */}
          <button
            id="mobile-open-settings-btn"
            onClick={onOpenSettings}
            className={`p-1.5 rounded-xl ${t.settingsBtn} shadow-xs cursor-pointer flex items-center justify-center transition-transform active:scale-95 flex-shrink-0`}
            title="Settings & Modes"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Active Verse & Sub-part Context Tag */}
      {activeTarget && !isPageAllCompleted && (
        <div className={`flex items-center justify-between px-3 py-0.5 text-[10px] font-sans font-bold ${t.contextBar}`}>
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            {activeTarget.pacingCheckpoint ? (
              <span className="flex items-center gap-1 font-bold">
                <span>⚡ Checkpoint {activeTarget.pacingCheckpoint.current}/{activeTarget.pacingCheckpoint.total}</span>
                <span className="opacity-70">({activeTarget.pacingCheckpoint.zone})</span>
              </span>
            ) : (
              <span>Blank ({activeBlankIndex + 1}/{totalBlanks})</span>
            )}
            {activeTarget.subAyahPart && (
              <span className={`text-[9px] font-bold ${t.blankActive} px-1.5 py-0.2 rounded-md flex-shrink-0`}>
                Part {activeTarget.subAyahPart.partIndex}/{activeTarget.subAyahPart.totalParts} ({activeTarget.subAyahPart.label})
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold opacity-80 flex-shrink-0">
            Ayah {activeTarget.ayahNumberInSurah}
          </span>
        </div>
      )}

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
                className={`absolute left-1.5 z-20 w-9 h-9 rounded-full ${t.carouselNavBtn} flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-xs transition-all active:scale-90`}
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

                let cardStyle = t.cardDefault;
                let badgeStyle = t.badgeDefault;

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
                        <span className={`text-[10px] font-sans ${t.tapPrompt}`}>
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
                className={`absolute right-1.5 z-20 w-9 h-9 rounded-full ${t.carouselNavBtn} flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-xs transition-all active:scale-90`}
                title="Next Option"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

          </div>
        )}
      </div>

      {/* 3. Bottom Carousel Footer: Ergonomic Thumb Controls for Reachable Option Navigation */}
      <div className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 ${t.footer} flex-shrink-0 gap-2`}>
        
        {/* Left Thumb Action: Previous Option Button */}
        <button
          id="mobile-carousel-prev-btn"
          onClick={() => scrollToCard(Math.max(0, activeCarouselCardIndex - 1))}
          disabled={activeCarouselCardIndex === 0}
          className={`min-h-[38px] px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border shadow-2xs active:scale-95 disabled:opacity-25 disabled:pointer-events-none ${t.prevBtn}`}
          title="Previous Option"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Prev</span>
        </button>

        {/* Center: Interactive Option Letter Jump Buttons (A, B, C, D) */}
        <div className={`flex items-center gap-1 ${t.pillsBg} p-1 rounded-xl`}>
          {options.map((opt, idx) => {
            const isCardActive = idx === activeCarouselCardIndex;
            const letter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
            let pillClass = t.pillDefault;
            
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
                pillClass = t.pillActive;
              }
            } else if (isCardActive) {
              pillClass = t.pillActive;
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
            className={`min-h-[38px] px-3.5 rounded-xl ${t.advanceBtn} text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95`}
          >
            <span>{activeBlankIndex < totalBlanks - 1 ? 'Next Blank' : 'Next Page'}</span>
            <ArrowRight className={`w-4 h-4 ${t.advanceIcon} stroke-[2.5]`} />
          </button>
        ) : (
          <button
            id="mobile-carousel-next-btn"
            onClick={() => scrollToCard(Math.min(options.length - 1, activeCarouselCardIndex + 1))}
            disabled={activeCarouselCardIndex >= options.length - 1}
            className={`min-h-[38px] px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border shadow-2xs active:scale-95 disabled:opacity-25 disabled:pointer-events-none ${t.nextBtn}`}
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
