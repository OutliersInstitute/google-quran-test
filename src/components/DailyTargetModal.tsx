import React, { useState } from 'react';
import { 
  Target, X, BookOpen, Layers, Sparkles, CheckCircle2, Flame, 
  RotateCcw, ArrowRight, Search, Trophy, Check, Compass, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JUZ_PAGE_DEFINITIONS, SURAH_METADATA_LIST, getSurahPageRange } from '../data/surahList';
import { DailyProgressData, DailyTargetConfig, DailyTargetMode, GoalProgressSummary } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface DailyTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTarget: DailyTargetConfig;
  onSaveTarget: (target: DailyTargetConfig) => void;
  dailyProgress: DailyProgressData;
  goalSummary: GoalProgressSummary;
  currentPageNumber: number;
  onJumpToPage: (pageNumber: number) => void;
  onResetTodayProgress: () => void;
}

export const DailyTargetModal: React.FC<DailyTargetModalProps> = ({
  isOpen,
  onClose,
  activeTarget,
  onSaveTarget,
  dailyProgress,
  goalSummary,
  currentPageNumber,
  onJumpToPage,
  onResetTodayProgress,
}) => {
  const [activeTab, setActiveTab] = useState<DailyTargetMode>(activeTarget.mode || 'pages-range');

  // Juz selection state
  const [selectedJuz, setSelectedJuz] = useState<number>(activeTarget.selectedJuz || 12);

  // Surah search & selection state
  const [surahSearch, setSurahSearch] = useState<string>('');
  const [selectedSurah, setSelectedSurah] = useState<number>(activeTarget.selectedSurah || 12);

  // Custom pages range inputs
  const [startPageInput, setStartPageInput] = useState<number>(activeTarget.startPage || currentPageNumber);
  const [endPageInput, setEndPageInput] = useState<number>(
    activeTarget.endPage || Math.min(604, (activeTarget.startPage || currentPageNumber) + 9)
  );

  // Quota states
  const [quotaPages, setQuotaPages] = useState<number>(activeTarget.targetPagesCount || 5);
  const [quotaBlanks, setQuotaBlanks] = useState<number>(activeTarget.targetBlanksCount || 20);

  if (!isOpen) return null;

  // Apply Juz target
  const handleApplyJuz = (juzNum: number) => {
    triggerHaptic('medium');
    const def = JUZ_PAGE_DEFINITIONS.find(j => j.juz === juzNum);
    if (!def) return;
    const newTarget: DailyTargetConfig = {
      enabled: true,
      mode: 'juz',
      title: `Juz ${def.juz} (${def.name})`,
      selectedJuz: def.juz,
      juzName: def.name,
      startPage: def.startPage,
      endPage: def.endPage,
      targetPagesCount: def.endPage - def.startPage + 1,
    };
    onSaveTarget(newTarget);
    onClose();
  };

  // Apply Surah target
  const handleApplySurah = (surahNum: number) => {
    triggerHaptic('medium');
    const meta = SURAH_METADATA_LIST.find(s => s.number === surahNum);
    if (!meta) return;
    const range = getSurahPageRange(surahNum);
    const newTarget: DailyTargetConfig = {
      enabled: true,
      mode: 'surah',
      title: `Surah ${meta.englishName}`,
      selectedSurah: meta.number,
      surahName: meta.englishName,
      startPage: range.startPage,
      endPage: range.endPage,
      targetPagesCount: range.endPage - range.startPage + 1,
    };
    onSaveTarget(newTarget);
    onClose();
  };

  // Apply Custom Page Range
  const handleApplyCustomRange = () => {
    triggerHaptic('medium');
    const start = Math.max(1, Math.min(604, Number(startPageInput) || 1));
    const end = Math.max(start, Math.min(604, Number(endPageInput) || start));
    const newTarget: DailyTargetConfig = {
      enabled: true,
      mode: 'pages-range',
      title: `Pages ${start}–${end}`,
      startPage: start,
      endPage: end,
      targetPagesCount: end - start + 1,
    };
    onSaveTarget(newTarget);
    onClose();
  };

  // Apply Page Count Quota
  const handleApplyPageQuota = (count: number) => {
    triggerHaptic('medium');
    const newTarget: DailyTargetConfig = {
      enabled: true,
      mode: 'pages-count',
      title: `Daily Goal: ${count} Pages`,
      targetPagesCount: count,
    };
    onSaveTarget(newTarget);
    onClose();
  };

  // Apply Blanks Count Quota
  const handleApplyBlanksQuota = (count: number) => {
    triggerHaptic('medium');
    const newTarget: DailyTargetConfig = {
      enabled: true,
      mode: 'blanks-count',
      title: `Daily Goal: ${count} Blanks`,
      targetBlanksCount: count,
    };
    onSaveTarget(newTarget);
    onClose();
  };

  // Start practicing active target immediately
  const handleJumpToGoalStart = () => {
    triggerHaptic('celebrate');
    if (activeTarget.startPage) {
      onJumpToPage(activeTarget.startPage);
    }
    onClose();
  };

  const filteredSurahs = SURAH_METADATA_LIST.filter(s => {
    if (!surahSearch.trim()) return true;
    const q = surahSearch.toLowerCase();
    return (
      s.number.toString().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q)
    );
  });

  const popularSurahs = [1, 2, 12, 18, 36, 55, 56, 67];

  return (
    <AnimatePresence>
      <div 
        id="daily-target-modal-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          id="daily-target-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl bg-amber-50 dark:bg-stone-900 border-2 border-amber-800/40 shadow-2xl flex flex-col overflow-hidden text-stone-800 dark:text-stone-100"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-amber-900/20 bg-amber-200/40 dark:bg-amber-950/60 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-sm shadow-sm">
                <Target className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-amber-950 dark:text-amber-100 font-display">
                  DAILY MEMORIZATION GOAL
                </h2>
                <p className="text-xs text-amber-900/70 dark:text-amber-300/70 font-sans">
                  Set daily targets by Juz, Surah, Page range, or daily quota
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-amber-200/50 hover:bg-amber-300/80 dark:bg-amber-900/40 dark:hover:bg-amber-800/60 text-amber-950 dark:text-amber-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Today's Streak & Live Progress Motivation Banner */}
          <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-900/10 via-amber-800/5 to-amber-900/10 dark:from-amber-950/40 dark:to-stone-900 border-b border-amber-900/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500" />
                <span>{dailyProgress.currentStreakDays} Day Streak</span>
              </div>

              <div>
                <div className="text-xs font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                  <span>Current: {goalSummary.title}</span>
                  {goalSummary.isComplete && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold">
                      Goal Met!
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-amber-900/70 dark:text-amber-300/70">
                  Today: {dailyProgress.completedPages.length} pages finished • {dailyProgress.blanksCompletedToday} blanks filled
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {activeTarget.startPage && (
                <button
                  onClick={handleJumpToGoalStart}
                  className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Jump to the starting page of this goal"
                >
                  <span>Start Goal (p.{activeTarget.startPage})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onResetTodayProgress();
                }}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Reset today's completed progress count"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center border-b border-amber-900/20 bg-amber-100/50 dark:bg-stone-800/80 px-2 pt-2 gap-1 overflow-x-auto flex-shrink-0">
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('juz');
              }}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'juz'
                  ? 'bg-amber-50 dark:bg-stone-900 text-amber-950 dark:text-amber-200 border-t-2 border-x-2 border-amber-800/40 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>By Juz (1–30)</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('surah');
              }}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'surah'
                  ? 'bg-amber-50 dark:bg-stone-900 text-amber-950 dark:text-amber-200 border-t-2 border-x-2 border-amber-800/40 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>By Surah (1–114)</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('pages-range');
              }}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pages-range'
                  ? 'bg-amber-50 dark:bg-stone-900 text-amber-950 dark:text-amber-200 border-t-2 border-x-2 border-amber-800/40 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Page Range</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('pages-count');
              }}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pages-count' || activeTab === 'blanks-count'
                  ? 'bg-amber-50 dark:bg-stone-900 text-amber-950 dark:text-amber-200 border-t-2 border-x-2 border-amber-800/40 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Daily Quota</span>
            </button>
          </div>

          {/* Modal Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-[300px]">
            {/* 1. JUZ GOAL TAB */}
            {activeTab === 'juz' && (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  Select a Juz to set as your memorization target. Each Juz contains ~20 Medina Mushaf pages:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {JUZ_PAGE_DEFINITIONS.map((j) => {
                    const isSelected = activeTarget.mode === 'juz' && activeTarget.selectedJuz === j.juz;
                    const pagesInThisJuz = j.endPage - j.startPage + 1;
                    const completedInThisJuz = dailyProgress.completedPages.filter(
                      p => p >= j.startPage && p <= j.endPage
                    ).length;
                    const pct = Math.round((completedInThisJuz / pagesInThisJuz) * 100);

                    return (
                      <button
                        key={j.juz}
                        onClick={() => handleApplyJuz(j.juz)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-500'
                            : 'bg-white dark:bg-stone-800/70 border-amber-900/15 hover:border-amber-700/40 hover:bg-amber-100/40 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-amber-950 text-amber-200' : 'bg-amber-900/10 text-amber-900 dark:text-amber-200'
                          }`}>
                            Juz {j.juz}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                        </div>

                        <div className="my-1.5">
                          <div className={`font-arabic text-sm font-bold truncate ${
                            isSelected ? 'text-amber-100' : 'text-stone-900 dark:text-stone-100'
                          }`}>
                            {j.name}
                          </div>
                          <div className={`text-[10px] ${
                            isSelected ? 'text-amber-200/80' : 'text-stone-500 dark:text-stone-400'
                          }`}>
                            p. {j.startPage}–{j.endPage} ({pagesInThisJuz} pgs)
                          </div>
                        </div>

                        {/* Progress mini bar */}
                        <div className="w-full mt-1">
                          <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-600'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-[9px] mt-0.5 opacity-70">
                            {completedInThisJuz > 0 ? `${completedInThisJuz}/${pagesInThisJuz} done` : `${pagesInThisJuz} pages`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SURAH GOAL TAB */}
            {activeTab === 'surah' && (
              <div className="flex flex-col gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={surahSearch}
                    onChange={(e) => setSurahSearch(e.target.value)}
                    placeholder="Search Surah by name, number, translation (e.g. Yusuf, Kahf, 18)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-amber-900/20 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600/50"
                  />
                  {surahSearch && (
                    <button
                      onClick={() => setSurahSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Popular Quick Surah Chips */}
                {!surahSearch && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-amber-950 dark:text-amber-200 flex-shrink-0 mr-1">
                      Quick Picks:
                    </span>
                    {popularSurahs.map((num) => {
                      const s = SURAH_METADATA_LIST.find(item => item.number === num);
                      if (!s) return null;
                      return (
                        <button
                          key={num}
                          onClick={() => handleApplySurah(num)}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-amber-800/10 hover:bg-amber-800/20 text-amber-950 dark:text-amber-100 border border-amber-900/15 flex-shrink-0 cursor-pointer transition-all active:scale-95"
                        >
                          {s.englishName}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Surah List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {filteredSurahs.map((s) => {
                    const range = getSurahPageRange(s.number);
                    const pagesInSurah = range.endPage - range.startPage + 1;
                    const isSelected = activeTarget.mode === 'surah' && activeTarget.selectedSurah === s.number;
                    const completedInSurah = dailyProgress.completedPages.filter(
                      p => p >= range.startPage && p <= range.endPage
                    ).length;
                    const pct = Math.round((completedInSurah / pagesInSurah) * 100);

                    return (
                      <button
                        key={s.number}
                        onClick={() => handleApplySurah(s.number)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-500'
                            : 'bg-white dark:bg-stone-800/70 border-amber-900/15 hover:border-amber-700/40 hover:bg-amber-100/40 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-amber-950 text-amber-200' : 'bg-amber-900/10 text-amber-900 dark:text-amber-200'
                          }`}>
                            {s.number}
                          </span>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate">
                              {s.englishName}
                            </div>
                            <div className={`text-[10px] ${
                              isSelected ? 'text-amber-200/80' : 'text-stone-500 dark:text-stone-400'
                            }`}>
                              p. {range.startPage}–{range.endPage} ({pagesInSurah} pgs)
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-arabic font-bold text-xs">
                            {s.name}
                          </div>
                          {isSelected && (
                            <span className="text-[9px] font-bold text-amber-300">
                              Active Goal
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. PAGE RANGE TAB */}
            {activeTab === 'pages-range' && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  Target a specific page spread or customized sequential page range (1 to 604):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-stone-800/70 border border-amber-900/15">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                      Start Page (1–604)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={604}
                      value={startPageInput}
                      onChange={(e) => setStartPageInput(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-900/30 font-mono font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                      End Page (1–604)
                    </label>
                    <input
                      type="number"
                      min={startPageInput}
                      max={604}
                      value={endPageInput}
                      onChange={(e) => setEndPageInput(parseInt(e.target.value, 10) || startPageInput)}
                      className="w-full px-3 py-2 rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-900/30 font-mono font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>

                {/* Range summary preview */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-100/60 dark:bg-stone-800 text-xs">
                  <span className="font-semibold text-amber-950 dark:text-amber-200">
                    Total Pages in Target:
                  </span>
                  <span className="font-mono font-bold text-sm text-amber-800 dark:text-amber-300">
                    {Math.max(1, endPageInput - startPageInput + 1)} Pages
                  </span>
                </div>

                {/* Quick Presets */}
                <div>
                  <div className="text-xs font-bold text-amber-950 dark:text-amber-200 mb-2">
                    Quick Presets around Current Page ({currentPageNumber}):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => {
                        setStartPageInput(currentPageNumber);
                        setEndPageInput(Math.min(604, currentPageNumber + 1));
                      }}
                      className="p-2 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 border border-amber-900/15 hover:border-amber-700/50 transition-colors text-left"
                    >
                      <div>Facing Spread</div>
                      <div className="text-[10px] text-stone-500 font-normal">2 pages</div>
                    </button>

                    <button
                      onClick={() => {
                        setStartPageInput(currentPageNumber);
                        setEndPageInput(Math.min(604, currentPageNumber + 4));
                      }}
                      className="p-2 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 border border-amber-900/15 hover:border-amber-700/50 transition-colors text-left"
                    >
                      <div>Quarter Hizb</div>
                      <div className="text-[10px] text-stone-500 font-normal">5 pages</div>
                    </button>

                    <button
                      onClick={() => {
                        setStartPageInput(currentPageNumber);
                        setEndPageInput(Math.min(604, currentPageNumber + 9));
                      }}
                      className="p-2 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 border border-amber-900/15 hover:border-amber-700/50 transition-colors text-left"
                    >
                      <div>Half Hizb</div>
                      <div className="text-[10px] text-stone-500 font-normal">10 pages</div>
                    </button>

                    <button
                      onClick={() => {
                        setStartPageInput(currentPageNumber);
                        setEndPageInput(Math.min(604, currentPageNumber + 19));
                      }}
                      className="p-2 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 border border-amber-900/15 hover:border-amber-700/50 transition-colors text-left"
                    >
                      <div>Full Juz Span</div>
                      <div className="text-[10px] text-stone-500 font-normal">20 pages</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleApplyCustomRange}
                  className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Target className="w-4 h-4 text-amber-300" />
                  <span>Set Pages {startPageInput}–{endPageInput} as Daily Goal</span>
                </button>
              </div>
            )}

            {/* 4. DAILY QUOTA TAB */}
            {(activeTab === 'pages-count' || activeTab === 'blanks-count') && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  Prefer a daily quota? Set a target number of pages or blanks to conquer each day:
                </div>

                {/* Pages per day quota */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800/70 border border-amber-900/15">
                  <div className="text-xs font-bold text-amber-950 dark:text-amber-200 mb-2 flex items-center justify-between">
                    <span>Target Pages Per Day</span>
                    <span className="text-[11px] text-stone-500">
                      Completed today: {dailyProgress.completedPages.length} pages
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10, 15, 20].map((num) => {
                      const isCurrent = activeTarget.mode === 'pages-count' && activeTarget.targetPagesCount === num;
                      return (
                        <button
                          key={num}
                          onClick={() => handleApplyPageQuota(num)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-800 text-white border-amber-900 shadow-sm ring-2 ring-amber-500'
                              : 'bg-amber-50/50 dark:bg-stone-900 border-amber-900/15 hover:border-amber-700/50 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {num} {num === 1 ? 'Page' : 'Pages'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Blanks per day quota */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800/70 border border-amber-900/15">
                  <div className="text-xs font-bold text-amber-950 dark:text-amber-200 mb-2 flex items-center justify-between">
                    <span>Target Blanks / Verses Per Day</span>
                    <span className="text-[11px] text-stone-500">
                      Completed today: {dailyProgress.blanksCompletedToday} blanks
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 30, 50].map((num) => {
                      const isCurrent = activeTarget.mode === 'blanks-count' && activeTarget.targetBlanksCount === num;
                      return (
                        <button
                          key={num}
                          onClick={() => handleApplyBlanksQuota(num)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-800 text-white border-amber-900 shadow-sm ring-2 ring-amber-500'
                              : 'bg-amber-50/50 dark:bg-stone-900 border-amber-900/15 hover:border-amber-700/50 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {num} Blanks
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-amber-900/20 bg-amber-100/40 dark:bg-stone-900 flex items-center justify-between flex-shrink-0 text-xs text-stone-500">
            <div>
              Active Goal: <strong className="text-stone-800 dark:text-stone-200">{activeTarget.title}</strong>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-300 dark:bg-stone-800 hover:bg-stone-400 dark:hover:bg-stone-700 font-bold text-stone-800 dark:text-stone-100 cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
