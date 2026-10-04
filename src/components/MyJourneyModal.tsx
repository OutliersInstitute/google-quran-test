import React, { useState } from 'react';
import { 
  X, Play, Sliders, Target, BookOpen, Sparkles, ArrowRight, Check, Compass, ChevronRight, Layers, Flame
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
  const [selectedCategory, setSelectedCategory] = useState<'juz' | 'surah' | 'quota'>('juz');

  if (!isOpen) return null;

  const isMoonstone = theme === 'moonstone';

  const juzPresets = [
    { title: 'Juz 30 (Amma)', subtitle: 'p. 582 - 604 • 23 pages', config: { enabled: true, mode: 'juz' as const, selectedJuz: 30, title: 'Juz 30 (Amma)', startPage: 582, endPage: 604 } },
    { title: 'Juz 29 (Tabarak)', subtitle: 'p. 562 - 581 • 20 pages', config: { enabled: true, mode: 'juz' as const, selectedJuz: 29, title: 'Juz 29 (Tabarak)', startPage: 562, endPage: 581 } },
    { title: 'Juz 1 (Al-Fatihah - Al-Baqarah)', subtitle: 'p. 1 - 21 • 21 pages', config: { enabled: true, mode: 'juz' as const, selectedJuz: 1, title: 'Juz 1', startPage: 1, endPage: 21 } },
  ];

  const surahPresets = [
    { title: 'Surah Al-Mulk', subtitle: 'Surah #67 • p. 562 - 564', config: { enabled: true, mode: 'surah' as const, selectedSurah: 67, surahName: 'Al-Mulk', title: 'Surah Al-Mulk (p.562-564)', startPage: 562, endPage: 564 } },
    { title: 'Surah Al-Kahf', subtitle: 'Surah #18 • p. 293 - 304', config: { enabled: true, mode: 'surah' as const, selectedSurah: 18, surahName: 'Al-Kahf', title: 'Surah Al-Kahf (p.293-304)', startPage: 293, endPage: 304 } },
    { title: 'Surah Ya-Sin', subtitle: 'Surah #36 • p. 440 - 445', config: { enabled: true, mode: 'surah' as const, selectedSurah: 36, surahName: 'Ya-Sin', title: 'Surah Ya-Sin (p.440-445)', startPage: 440, endPage: 445 } },
  ];

  const quotaPresets = [
    { title: 'Daily 3 Pages Quota', subtitle: 'Light daily retention testing', config: { enabled: true, mode: 'pages-count' as const, targetPagesCount: 3, title: 'Daily 3 Pages Quota', startPage: 1, endPage: 604 } },
    { title: 'Daily 5 Pages Quota', subtitle: 'Standard daily Hifz pace', config: { enabled: true, mode: 'pages-count' as const, targetPagesCount: 5, title: 'Daily 5 Pages Quota', startPage: 1, endPage: 604 } },
    { title: 'Daily 10 Pages (Half Juz)', subtitle: 'Intensive scholar revision', config: { enabled: true, mode: 'pages-count' as const, targetPagesCount: 10, title: 'Daily 10 Pages Quota', startPage: 1, endPage: 604 } },
  ];

  const currentPresets = selectedCategory === 'juz' ? juzPresets : selectedCategory === 'surah' ? surahPresets : quotaPresets;

  const targetStartPage = activeTarget.startPage || currentPageNumber;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isMoonstone 
            ? 'bg-white text-[#20373B] border-[#519CAB]/30' 
            : 'bg-[#faf7f0] dark:bg-[#161b20] text-stone-900 dark:text-stone-100 border-amber-900/20 dark:border-stone-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 sm:px-6 py-3.5 border-b ${
          isMoonstone 
            ? 'bg-white border-[#519CAB]/20' 
            : 'border-amber-900/10 dark:border-stone-800 bg-[#f4eee0] dark:bg-[#12161a]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
              isMoonstone ? 'bg-[#519CAB] text-white' : 'bg-amber-800 text-amber-100'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold">My Memorization Journey</h2>
              <p className="text-xs opacity-75">Your active target & fast goal switcher</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Active Target Hero Card (Clean & Focused like HomeScreen) */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 shadow-sm ${
            isMoonstone 
              ? 'bg-white border-2 border-[#519CAB]/25' 
              : 'bg-white dark:bg-stone-900/60 border-amber-900/15 dark:border-stone-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isMoonstone ? 'text-[#519CAB]' : 'text-amber-800 dark:text-amber-400'
              }`}>
                <Target className="w-4 h-4" />
                <span>Active Target</span>
              </span>
              {goalSummary.isComplete ? (
                <span className="px-2 py-0.5 rounded-full bg-[#FFC64F] text-[#20373B] font-extrabold text-[10px] shadow-2xs">
                  🎉 Goal Completed!
                </span>
              ) : (
                <span className="text-xs font-mono font-bold opacity-75">
                  Page {currentPageNumber} of 604
                </span>
              )}
            </div>

            <div className="font-display font-extrabold text-xl sm:text-2xl leading-tight">
              {activeTarget.title}
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="opacity-80">Progress: <strong className="font-mono">{goalSummary.formattedLabel}</strong></span>
                <span className="font-mono font-bold text-[#519CAB]">{goalSummary.percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isMoonstone 
                      ? 'bg-gradient-to-r from-[#519CAB] via-[#519CAB] to-[#FFC64F]' 
                      : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700'
                  }`}
                  style={{ width: `${Math.max(goalSummary.percent, 4)}%` }}
                />
              </div>
            </div>

            {/* Quick Continue Practice CTA */}
            <button
              onClick={() => {
                triggerHaptic('celebrate');
                onClose();
                onStartPractice(targetStartPage);
              }}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isMoonstone 
                  ? 'bg-[#519CAB] hover:bg-[#438795] text-white shadow-[#519CAB]/20' 
                  : 'bg-amber-800 hover:bg-amber-700 text-amber-50'
              }`}
            >
              <Play className="w-4 h-4 fill-current text-[#FFC64F]" />
              <span>Continue Testing</span>
              <span className="opacity-75 font-normal text-xs">• Page {targetStartPage}</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </div>

          {/* Clean Goal Switcher (Categorized & Intuitive) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5 font-display">
                <Sparkles className={`w-3.5 h-3.5 ${isMoonstone ? 'text-[#519CAB]' : 'text-amber-600'}`} />
                <span>Switch Goal Target</span>
              </span>

              {/* Custom Goal button */}
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onClose();
                  onOpenDailyTarget();
                }}
                className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isMoonstone ? 'text-[#519CAB] hover:underline' : 'text-amber-800 dark:text-amber-400 hover:underline'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom Target</span>
              </button>
            </div>

            {/* Category Segment Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedCategory('juz')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                  selectedCategory === 'juz'
                    ? (isMoonstone ? 'bg-[#519CAB] text-white shadow-2xs' : 'bg-amber-800 text-white shadow-2xs')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Juz Portions
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('surah')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                  selectedCategory === 'surah'
                    ? (isMoonstone ? 'bg-[#519CAB] text-white shadow-2xs' : 'bg-amber-800 text-white shadow-2xs')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Popular Surahs
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('quota')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                  selectedCategory === 'quota'
                    ? (isMoonstone ? 'bg-[#519CAB] text-white shadow-2xs' : 'bg-amber-800 text-white shadow-2xs')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Daily Quotas
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              {currentPresets.map((preset, idx) => {
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
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive 
                        ? (isMoonstone ? 'bg-[#519CAB] text-white border-[#519CAB] shadow-sm' : 'bg-amber-800 text-amber-50 border-amber-800 shadow-sm')
                        : (isMoonstone ? 'bg-white border-[#519CAB]/20 hover:border-[#519CAB]/50 hover:bg-stone-50' : 'bg-white/60 dark:bg-stone-900/40 border-amber-900/10 dark:border-stone-800 hover:border-amber-700/40')
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{preset.title}</div>
                      <div className={`text-[11px] mt-0.5 ${isActive ? 'opacity-85' : 'opacity-60'}`}>
                        {preset.subtitle}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isActive ? (
                        <span className="flex items-center gap-1 font-bold text-xs">
                          <Check className="w-4 h-4" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className={`text-xs font-semibold opacity-70 ${isMoonstone ? 'text-[#519CAB]' : 'text-amber-800'}`}>
                          Select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Jump Bar */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
            isMoonstone ? 'bg-stone-50 border-[#519CAB]/20' : 'bg-black/5 dark:bg-white/5 border-black/5'
          }`}>
            <span className="opacity-75 font-medium">Or open picker directly:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSurahPicker();
                }}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  isMoonstone 
                    ? 'bg-white hover:bg-stone-100 text-[#20373B] border border-[#519CAB]/25' 
                    : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-black/10'
                }`}
              >
                Surah Index
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenPagePicker();
                }}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  isMoonstone 
                    ? 'bg-white hover:bg-stone-100 text-[#20373B] border border-[#519CAB]/25' 
                    : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-black/10'
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

