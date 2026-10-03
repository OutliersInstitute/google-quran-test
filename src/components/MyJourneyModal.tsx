import React from 'react';
import { 
  X, Play, Sliders, Target, BookOpen, Sparkles, ArrowRight, Check, Compass
} from 'lucide-react';
import { DailyTargetConfig, GoalProgressSummary, MushafTheme } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface MyJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTarget: DailyTargetConfig;
  goalSummary: GoalProgressSummary;
  currentPageNumber: number;
  onStartPractice: (page?: number) => void;
  onOpenDailyTarget: () => void;
  onSaveTarget?: (newTarget: DailyTargetConfig) => void;
  onOpenSurahPicker: () => void;
  onOpenPagePicker: () => void;
  theme: MushafTheme;
}

export const MyJourneyModal: React.FC<MyJourneyModalProps> = ({
  isOpen,
  onClose,
  activeTarget,
  goalSummary,
  currentPageNumber,
  onStartPractice,
  onOpenDailyTarget,
  onSaveTarget,
  onOpenSurahPicker,
  onOpenPagePicker,
  theme,
}) => {
  if (!isOpen) return null;

  const isMoonstone = theme === 'moonstone';

  const quickPresets = [
    { title: 'Juz 30 (Amma)', config: { enabled: true, mode: 'juz' as const, selectedJuz: 30, title: 'Juz 30 (Amma)', startPage: 582, endPage: 604 } },
    { title: 'Juz 29 (Tabarak)', config: { enabled: true, mode: 'juz' as const, selectedJuz: 29, title: 'Juz 29 (Tabarak)', startPage: 562, endPage: 581 } },
    { title: 'Surah Al-Mulk', config: { enabled: true, mode: 'surah' as const, selectedSurah: 67, surahName: 'Al-Mulk', title: 'Surah Al-Mulk (p.562-564)', startPage: 562, endPage: 564 } },
    { title: 'Surah Al-Kahf', config: { enabled: true, mode: 'surah' as const, selectedSurah: 18, surahName: 'Al-Kahf', title: 'Surah Al-Kahf (p.293-304)', startPage: 293, endPage: 304 } },
    { title: 'Daily 3 Pages Quota', config: { enabled: true, mode: 'pages-count' as const, targetPagesCount: 3, title: 'Daily 3 Pages Quota', startPage: 1, endPage: 604 } },
    { title: 'Daily 5 Pages Quota', config: { enabled: true, mode: 'pages-count' as const, targetPagesCount: 5, title: 'Daily 5 Pages Quota', startPage: 1, endPage: 604 } },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isMoonstone 
            ? 'bg-[#edf6f9] text-[#20373B] border-[#519CAB]/30' 
            : 'bg-[#faf7f0] dark:bg-[#161b20] text-stone-900 dark:text-stone-100 border-amber-900/20 dark:border-stone-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isMoonstone 
            ? 'bg-white/80 border-[#519CAB]/20' 
            : 'border-amber-900/10 dark:border-stone-800 bg-[#f4eee0] dark:bg-[#12161a]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              isMoonstone ? 'bg-[#519CAB] text-[#FFC64F]' : 'bg-amber-800 text-amber-100'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">My Memorization Journey</h2>
              <p className="text-xs opacity-75">Continue testing or update your Hifz target</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Active Target Banner */}
          <div className={`p-5 rounded-2xl border space-y-3 shadow-xs ${
            isMoonstone 
              ? 'bg-white border-[#519CAB]/25' 
              : 'bg-white dark:bg-stone-900/60 border-amber-900/15 dark:border-stone-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isMoonstone ? 'text-[#519CAB]' : 'text-amber-800 dark:text-amber-400'
              }`}>
                <Target className="w-4 h-4" />
                <span>Current Active Target</span>
              </span>
              {goalSummary.isComplete && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFC64F] text-[#20373B] font-extrabold text-[10px] shadow-2xs">
                  🎉 Target Reached!
                </span>
              )}
            </div>

            <div className="font-display font-extrabold text-xl sm:text-2xl text-[#20373B]">
              {activeTarget.title}
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Progress: <strong className="font-mono">{goalSummary.formattedLabel}</strong></span>
                <span className="font-mono font-bold text-[#519CAB]">{goalSummary.percent}%</span>
              </div>
              <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isMoonstone 
                      ? 'bg-gradient-to-r from-[#519CAB] via-[#519CAB] to-[#FFC64F]' 
                      : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700'
                  }`}
                  style={{ width: `${Math.max(goalSummary.percent, 5)}%` }}
                />
              </div>
            </div>

            {/* Target Description */}
            <p className="text-xs opacity-75 leading-relaxed pt-1">
              {goalSummary.spreadPositionText 
                ? `Currently focusing on ${goalSummary.spreadPositionText}. Blanks auto-advance across standard 15-line Medina Mushaf pages.`
                : 'Memorize and test your retention with blank-verse challenges on Medina Mushaf pages.'}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                triggerHaptic('celebrate');
                onClose();
                onStartPractice(activeTarget.startPage || currentPageNumber);
              }}
              className={`py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isMoonstone 
                  ? 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-[#519CAB]/20' 
                  : 'bg-amber-800 hover:bg-amber-700 text-amber-50'
              }`}
            >
              <Play className="w-4 h-4 fill-current text-[#FFC64F]" />
              <span>Continue Testing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                triggerHaptic('medium');
                onClose();
                onOpenDailyTarget();
              }}
              className={`py-3.5 px-5 rounded-2xl border-2 font-bold text-sm shadow-xs active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isMoonstone 
                  ? 'border-[#519CAB]/30 hover:border-[#519CAB] bg-white text-[#20373B]' 
                  : 'border-amber-900/20 dark:border-stone-700 hover:border-amber-700 bg-white/70 dark:bg-stone-900/50'
              }`}
            >
              <Sliders className={`w-4 h-4 ${isMoonstone ? 'text-[#519CAB]' : 'text-amber-800 dark:text-amber-400'}`} />
              <span>Change Target Goal</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className={`space-y-2.5 pt-2 border-t ${isMoonstone ? 'border-[#519CAB]/20' : 'border-amber-900/10 dark:border-stone-800'}`}>
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isMoonstone ? 'text-[#519CAB]' : 'text-amber-800 dark:text-amber-400'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 ${isMoonstone ? 'text-[#FFC64F]' : 'text-amber-600'}`} />
              <span>One-Tap Target Presets:</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickPresets.map((preset, idx) => {
                const isActive = activeTarget.title === preset.config.title;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      triggerHaptic('medium');
                      if (onSaveTarget) {
                        onSaveTarget(preset.config);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                      isActive 
                        ? (isMoonstone ? 'bg-[#519CAB] text-white border-[#519CAB] shadow-xs' : 'bg-amber-800 text-amber-50 border-amber-800 shadow-xs')
                        : (isMoonstone ? 'bg-white border-[#519CAB]/20 hover:border-[#519CAB]' : 'bg-white/60 dark:bg-stone-900/40 border-amber-900/10 dark:border-stone-800 hover:border-amber-700/40')
                    }`}
                  >
                    <span className="truncate">{preset.title}</span>
                    {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fast Navigation Jump */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
            isMoonstone ? 'bg-white/70 border-[#519CAB]/20' : 'bg-black/5 dark:bg-white/5 border-black/5'
          }`}>
            <span className="opacity-75 font-medium">Or jump directly to a specific place:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSurahPicker();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                  isMoonstone ? 'bg-[#C3E7F1]/50 hover:bg-[#C3E7F1] text-[#20373B]' : 'bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-300'
                }`}
              >
                Surah Index
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenPagePicker();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                  isMoonstone ? 'bg-[#C3E7F1]/50 hover:bg-[#C3E7F1] text-[#20373B]' : 'bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-300'
                }`}
              >
                Page Picker
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
