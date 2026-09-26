import React from 'react';
import { Target, Trophy, Flame, ChevronRight, Sparkles } from 'lucide-react';
import { GoalProgressSummary, MushafTheme } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface MushafGoalProgressBarProps {
  summary: GoalProgressSummary;
  theme: MushafTheme;
  pageNumber?: number;
  secondaryPageNumber?: number | null;
  onOpenDailyTarget?: () => void;
  className?: string;
}

export const MushafGoalProgressBar: React.FC<MushafGoalProgressBarProps> = ({
  summary,
  theme,
  pageNumber,
  secondaryPageNumber,
  onOpenDailyTarget,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    if (onOpenDailyTarget) {
      onOpenDailyTarget();
    }
  };

  // Theme-specific styles
  const styles = {
    parchment: {
      barBg: 'bg-amber-900/10 dark:bg-amber-950/30',
      fillGradient: 'from-amber-600 via-amber-500 to-amber-700',
      completedGradient: 'from-emerald-600 via-amber-500 to-emerald-600',
      textPrimary: 'text-amber-950 dark:text-amber-100',
      textMuted: 'text-amber-900/70 dark:text-amber-300/70',
      border: 'border-amber-900/15 dark:border-amber-700/20',
      badgeBg: 'bg-amber-800/10 dark:bg-amber-700/20',
      markerColor: 'bg-amber-800 dark:bg-amber-400',
      glow: 'shadow-[0_0_8px_rgba(180,83,9,0.25)]',
    },
    emerald: {
      barBg: 'bg-emerald-950/10 dark:bg-emerald-950/40',
      fillGradient: 'from-emerald-700 via-emerald-500 to-teal-600',
      completedGradient: 'from-emerald-500 via-teal-400 to-amber-400',
      textPrimary: 'text-emerald-950 dark:text-emerald-100',
      textMuted: 'text-emerald-900/70 dark:text-emerald-300/70',
      border: 'border-emerald-800/15 dark:border-emerald-600/25',
      badgeBg: 'bg-emerald-800/10 dark:bg-emerald-700/20',
      markerColor: 'bg-emerald-700 dark:bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(5,150,105,0.25)]',
    },
    midnight: {
      barBg: 'bg-stone-800/60',
      fillGradient: 'from-amber-500 via-yellow-400 to-amber-600',
      completedGradient: 'from-amber-400 via-yellow-300 to-emerald-400',
      textPrimary: 'text-amber-200',
      textMuted: 'text-amber-300/70',
      border: 'border-amber-400/20',
      badgeBg: 'bg-amber-400/10',
      markerColor: 'bg-amber-400',
      glow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]',
    },
    'classic-white': {
      barBg: 'bg-stone-200/70',
      fillGradient: 'from-stone-700 via-stone-800 to-stone-900',
      completedGradient: 'from-emerald-700 via-stone-800 to-emerald-700',
      textPrimary: 'text-stone-900',
      textMuted: 'text-stone-600',
      border: 'border-stone-300',
      badgeBg: 'bg-stone-200',
      markerColor: 'bg-stone-900',
      glow: 'shadow-xs',
    },
  }[theme];

  const {
    percent,
    current,
    target,
    title,
    formattedLabel,
    isComplete,
    spreadPositionText,
    relativePositionPercent,
    isOnTargetPage,
  } = summary;

  // Clamped percentage
  const displayPercent = Math.max(0, Math.min(100, percent));

  return (
    <div
      id="mushaf-daily-goal-bar"
      onClick={handleClick}
      className={`group w-full select-none cursor-pointer flex flex-col gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 sm:py-1 mb-1 sm:mb-1.5 rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99] border ${styles.border} ${styles.badgeBg} ${className}`}
      title="Click to customize daily memorization target (Juz, Pages, Surahs, Quota)"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {/* Top Label & Details Row */}
      <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] leading-tight">
        {/* Left: Goal Title & Spread Status */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1 truncate">
          <span className="flex-shrink-0 flex items-center justify-center">
            {isComplete ? (
              <Trophy className="w-3 h-3 text-amber-500 animate-bounce" />
            ) : (
              <Target className="w-3 h-3 text-amber-700 dark:text-amber-400 group-hover:rotate-45 transition-transform" />
            )}
          </span>

          <span className={`font-bold font-sans truncate ${styles.textPrimary}`}>
            {title}
          </span>

          {spreadPositionText && (
            <span className={`hidden xs:inline text-[9px] sm:text-[10px] opacity-75 font-sans truncate ${styles.textMuted}`}>
              • {spreadPositionText}
            </span>
          )}
        </div>

        {/* Right: Progress Ratio & Percentage */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
          <span className={`font-semibold font-mono text-[9px] sm:text-[10px] ${styles.textMuted}`}>
            {formattedLabel}
          </span>

          <span
            className={`px-1.5 py-0.2 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold font-sans flex items-center gap-0.5 ${
              isComplete
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-amber-500/20 text-amber-900 dark:text-amber-200'
            }`}
          >
            {isComplete ? (
              <>
                <Sparkles className="w-2.5 h-2.5" />
                <span>100%</span>
              </>
            ) : (
              `${displayPercent}%`
            )}
          </span>

          <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-current" />
        </div>
      </div>

      {/* Visual Progress Track */}
      <div className={`relative w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${styles.barBg}`}>
        {/* Fill bar */}
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
            isComplete ? styles.completedGradient : styles.fillGradient
          } ${styles.glow}`}
          style={{ width: `${Math.max(displayPercent, isComplete ? 100 : 3)}%` }}
        />

        {/* Animated subtle shimmer highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] pointer-events-none" />

        {/* Spread marker indicator showing current page position inside the target range */}
        {isOnTargetPage && relativePositionPercent > 0 && !isComplete && (
          <div
            className={`absolute top-0 bottom-0 w-1 rounded-full ${styles.markerColor} shadow-xs ring-1 ring-white/60 pointer-events-none transition-all duration-500`}
            style={{ left: `calc(${Math.min(98, Math.max(2, relativePositionPercent))}% - 2px)` }}
            title={`Current spread position in target: ${relativePositionPercent}%`}
          />
        )}
      </div>
    </div>
  );
};
