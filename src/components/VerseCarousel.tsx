import React, { useState, useEffect, useRef } from 'react';
import { BlankTarget, CarouselOption } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Volume2, Sparkles, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VerseCarouselProps {
  blankTarget: BlankTarget;
  onSelectOption: (option: CarouselOption) => void;
  selectedOptionId?: string;
  isAnswered: boolean;
  onPlayAudio?: (audioUrl?: string) => void;
  onNextQuestion?: () => void;
}

export const VerseCarousel: React.FC<VerseCarouselProps> = ({
  blankTarget,
  onSelectOption,
  selectedOptionId,
  isAnswered,
  onPlayAudio,
  onNextQuestion
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const options = blankTarget.options;

  // Reset active index on new question
  useEffect(() => {
    setActiveIndex(0);
  }, [blankTarget.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        // Carousel in RTL or LTR: Next/Prev
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < options.length && !isAnswered) {
          onSelectOption(options[idx]);
          setActiveIndex(idx);
        }
      } else if (e.key === 'Enter' && !isAnswered) {
        onSelectOption(options[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, options, isAnswered, onSelectOption]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
  };

  const activeOption = options[activeIndex] || options[0];

  return (
    <div id="verse-carousel-dock" className="w-full max-w-4xl mx-auto mt-4 px-2 sm:px-4 select-none">
      
      {/* Carousel Header / Prompt */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
          <h3 className="text-sm sm:text-base font-bold text-amber-950 font-display tracking-wide">
            {isAnswered ? 'VERIFICATION & INSIGHT' : 'SELECT THE MISSING VERSE'}
          </h3>
        </div>

        {/* Action / Helper Controls */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-carousel-translation-btn"
            onClick={() => setShowTranslations(!showTranslations)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-900/80 bg-amber-200/50 hover:bg-amber-300/60 border border-amber-800/20 transition-colors cursor-pointer"
            title="Toggle English meanings on cards"
          >
            {showTranslations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showTranslations ? 'Hide Meaning' : 'Show Meaning'}</span>
          </button>
        </div>
      </div>

      {/* Main Mini Carousel Visual Stage */}
      <div className="relative rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900 to-stone-950 p-4 sm:p-6 shadow-2xl border-2 border-amber-600/40 text-stone-100 overflow-hidden">
        
        {/* Ornate Background Arabesque Motif Watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <svg className="w-96 h-96 fill-amber-300" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <polygon points="50,5 90,50 50,95 10,50" fill="none" stroke="currentColor" strokeWidth="2" />
            <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Carousel Navigation Chevron Left */}
        <button
          id="carousel-prev-btn"
          onClick={handlePrev}
          aria-label="Previous Option"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carousel Navigation Chevron Right */}
        <button
          id="carousel-next-btn"
          onClick={handleNext}
          aria-label="Next Option"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Card Stage Container */}
        <div 
          ref={carouselContainerRef}
          className="relative min-h-[170px] sm:min-h-[190px] flex items-center justify-center px-8 sm:px-14"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${blankTarget.id}_opt_${activeIndex}`}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full flex flex-col items-center text-center"
            >
              
              {/* Option Index Badge & Source Reference */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400/50 text-amber-300 tracking-wide font-sans">
                  OPTION {activeIndex + 1} OF {options.length}
                </span>

                {isAnswered && (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                    activeOption.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {activeOption.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{activeOption.isCorrect ? 'Correct Ayah' : 'Distractor'}</span>
                  </span>
                )}
              </div>

              {/* Arabic Verse Option Typography */}
              <div className="w-full my-2 px-2" dir="rtl">
                <p className="font-quran text-2xl sm:text-3xl md:text-4xl text-amber-100 font-semibold leading-relaxed tracking-normal select-text">
                  {activeOption.text}
                </p>
              </div>

              {/* Optional English Translation */}
              {showTranslations && activeOption.translation && (
                <div className="mt-2 mb-1 px-4 max-w-xl text-xs sm:text-sm text-stone-300 italic font-sans" dir="ltr">
                  "{activeOption.translation}"
                </div>
              )}

              {/* Explanation note when answered */}
              {isAnswered && activeOption.explanation && (
                <div className="mt-2 text-xs text-amber-200/80 font-sans flex items-center gap-1 justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeOption.explanation}</span>
                </div>
              )}

              {/* Card Action Bar */}
              <div className="flex items-center gap-3 mt-4">
                
                {/* Audio Listen Preview Button */}
                {activeOption.audio && (
                  <button
                    id={`preview-audio-opt-${activeIndex}`}
                    onClick={() => onPlayAudio?.(activeOption.audio)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Listen to recitation"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Recite</span>
                  </button>
                )}

                {/* Select Verse Button */}
                {!isAnswered ? (
                  <button
                    id={`select-verse-btn-${activeIndex}`}
                    onClick={() => onSelectOption(activeOption)}
                    className="flex items-center gap-2 px-5 sm:px-7 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25 cursor-pointer font-arabic"
                  >
                    <span>اخْتَر هَٰذِهِ الآيَة</span>
                    <span>✓</span>
                  </button>
                ) : (
                  <button
                    id="carousel-next-round-btn"
                    onClick={onNextQuestion}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/40 cursor-pointer"
                  >
                    <span>Next Verse Challenge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots and Quick Select Tabs */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-2 border-t border-amber-500/20">
          {options.map((opt, idx) => {
            const isCurrent = idx === activeIndex;
            const isSelected = selectedOptionId === opt.id;

            return (
              <button
                key={`dot_${idx}`}
                id={`carousel-indicator-${idx}`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to option ${idx + 1}`}
                className={`transition-all duration-200 cursor-pointer rounded-full flex items-center justify-center ${
                  isCurrent
                    ? 'w-8 h-3.5 bg-amber-400 shadow-md shadow-amber-400/50'
                    : isAnswered && opt.isCorrect
                    ? 'w-3.5 h-3.5 bg-emerald-400'
                    : 'w-3 h-3 bg-stone-700 hover:bg-stone-500'
                }`}
              >
                {isCurrent && (
                  <span className="text-[9px] font-extrabold text-stone-950 leading-none">
                    {idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Mini Keyboard Hint Bar */}
      <div className="flex items-center justify-between text-[11px] text-amber-900/70 mt-2 px-3 font-sans">
        <span>Use <b>← / →</b> arrow keys to browse options</span>
        <span>Press <b>1-{options.length}</b> or <b>Enter</b> to submit</span>
      </div>

    </div>
  );
};
