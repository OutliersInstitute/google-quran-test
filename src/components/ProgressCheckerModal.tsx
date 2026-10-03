import React, { useState } from 'react';
import { 
  X, Flame, BookOpen, TrendingUp, CheckCircle2, Calendar, 
  BarChart3, ShieldAlert, Check, ChevronRight, Layers, Award, ArrowRight
} from 'lucide-react';
import { 
  DailyProgressData, DailyHistoryRecord, MemorizationHistoryStats, 
  MushafTheme 
} from '../types';
import { JUZ_PAGE_DEFINITIONS } from '../data/surahList';
import { getHistoryStats } from '../utils/dailyGoalEngine';
import { triggerHaptic } from '../utils/haptics';

interface ProgressCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyProgress: DailyProgressData;
  historyRecords: DailyHistoryRecord[];
  mistakesCount: number;
  onOpenReview: () => void;
  onStartPractice: (page?: number) => void;
  theme: MushafTheme;
}

export const ProgressCheckerModal: React.FC<ProgressCheckerModalProps> = ({
  isOpen,
  onClose,
  dailyProgress,
  historyRecords,
  mistakesCount,
  onOpenReview,
  onStartPractice,
  theme,
}) => {
  const [viewTab, setViewTab] = useState<'timeline' | 'juz' | 'mistakes'>('timeline');
  const [historyViewMode, setHistoryViewMode] = useState<'chart' | 'logs'>('chart');
  const [selectedJuzFilter, setSelectedJuzFilter] = useState<'all' | 'tested'>('all');

  if (!isOpen) return null;

  const isMoonstone = theme === 'moonstone';

  const historyStats: MemorizationHistoryStats = getHistoryStats(historyRecords, dailyProgress);
  const quranTotalPages = 604;
  const masteredPct = Math.round((historyStats.totalCompletedPages / quranTotalPages) * 100);

  // Success rate
  const recentRecords = historyStats.historyRecords.slice(-14);
  const targetMetCount = recentRecords.filter(r => r.targetMet || r.pagesCompleted >= 2).length;
  const successRate = recentRecords.length > 0 
    ? Math.round((targetMetCount / recentRecords.length) * 100) 
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
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
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">Progress Checker</h2>
              <p className="text-xs opacity-75">Your retention statistics, daily streaks, and activity breakdown</p>
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

        {/* Top 4 KPI Metrics */}
        <div className={`p-4 sm:p-6 pb-2 border-b grid grid-cols-2 sm:grid-cols-4 gap-2.5 ${
          isMoonstone ? 'border-[#519CAB]/15' : 'border-amber-900/10 dark:border-stone-800'
        }`}>
          <div className={`p-3 rounded-2xl border text-center ${
            isMoonstone ? 'bg-white border-[#519CAB]/20 shadow-xs' : 'bg-white dark:bg-stone-900/50 border-amber-900/10 dark:border-stone-800'
          }`}>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Active Streak</span>
            <div className="font-mono text-xl font-black text-[#20373B] flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 text-[#FFC64F] fill-[#FFC64F] animate-bounce" style={{ animationDuration: '2s' }} />
              <span>{dailyProgress.currentStreakDays}d</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border text-center ${
            isMoonstone ? 'bg-white border-[#519CAB]/20 shadow-xs' : 'bg-white dark:bg-stone-900/50 border-amber-900/10 dark:border-stone-800'
          }`}>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Pages Mastered</span>
            <div className={`font-mono text-xl font-black mt-0.5 ${isMoonstone ? 'text-[#519CAB]' : 'text-amber-800 dark:text-amber-400'}`}>
              {historyStats.totalCompletedPages} <span className="text-xs font-normal opacity-60">/ 604</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border text-center ${
            isMoonstone ? 'bg-white border-[#519CAB]/20 shadow-xs' : 'bg-white dark:bg-stone-900/50 border-amber-900/10 dark:border-stone-800'
          }`}>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Accuracy</span>
            <div className={`font-mono text-xl font-black mt-0.5 ${isMoonstone ? 'text-[#519CAB]' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {historyStats.overallAccuracy}%
            </div>
          </div>

          <div className={`p-3 rounded-2xl border text-center ${
            isMoonstone ? 'bg-white border-[#519CAB]/20 shadow-xs' : 'bg-white dark:bg-stone-900/50 border-amber-900/10 dark:border-stone-800'
          }`}>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Goal Success</span>
            <div className={`font-mono text-xl font-black mt-0.5 ${isMoonstone ? 'text-[#519CAB]' : 'text-blue-600 dark:text-blue-400'}`}>
              {successRate}%
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className={`px-6 pt-3 flex items-center gap-2 border-b text-xs font-bold ${
          isMoonstone ? 'border-[#519CAB]/15' : 'border-amber-900/10 dark:border-stone-800'
        }`}>
          <button
            onClick={() => {
              triggerHaptic('light');
              setViewTab('timeline');
            }}
            className={`pb-2.5 px-2 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              viewTab === 'timeline'
                ? (isMoonstone ? 'border-[#519CAB] text-[#519CAB]' : 'border-amber-800 text-amber-800 dark:text-amber-400')
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>14-Day Activity History</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setViewTab('juz');
            }}
            className={`pb-2.5 px-2 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              viewTab === 'juz'
                ? (isMoonstone ? 'border-[#519CAB] text-[#519CAB]' : 'border-amber-800 text-amber-800 dark:text-amber-400')
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>30 Juz Mastery ({masteredPct}%)</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setViewTab('mistakes');
            }}
            className={`pb-2.5 px-2 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              viewTab === 'mistakes'
                ? (isMoonstone ? 'border-[#519CAB] text-[#519CAB]' : 'border-amber-800 text-amber-800 dark:text-amber-400')
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mistakes Bank ({mistakesCount})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: 14-Day Timeline & Detailed Logs */}
          {viewTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {historyViewMode === 'chart' ? '14-Day Activity Heatmap' : 'Detailed Session Logs'}
                </span>
                
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
                  <button
                    onClick={() => setHistoryViewMode('chart')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      historyViewMode === 'chart' ? 'bg-amber-800 text-white shadow-xs' : 'opacity-70'
                    }`}
                  >
                    Heatmap
                  </button>
                  <button
                    onClick={() => setHistoryViewMode('logs')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      historyViewMode === 'logs' ? 'bg-amber-800 text-white shadow-xs' : 'opacity-70'
                    }`}
                  >
                    Logs Table
                  </button>
                </div>
              </div>

              {historyViewMode === 'chart' ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/50 border border-amber-900/10 dark:border-stone-800 space-y-3">
                  <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                    {historyStats.historyRecords.slice(-14).map((rec) => {
                      const dayLabel = new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short' });
                      const dateNum = new Date(rec.date).getDate();
                      const isToday = rec.date === dailyProgress.date;

                      return (
                        <div
                          key={rec.date}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 text-center transition-all ${
                            isToday 
                              ? 'ring-2 ring-amber-600 bg-amber-500/10 border-amber-600/40' 
                              : 'bg-black/5 dark:bg-white/5 border-transparent'
                          }`}
                        >
                          <span className="text-[10px] opacity-60 font-sans">{dayLabel}</span>
                          <span className="text-xs font-bold font-mono tabular-nums">{dateNum}</span>
                          
                          <div className="w-full h-8 flex items-end justify-center py-0.5">
                            <div 
                              className={`w-full max-w-[14px] rounded-sm transition-all ${
                                rec.targetMet 
                                  ? 'bg-emerald-600 shadow-xs' 
                                  : rec.pagesCompleted > 0 
                                    ? 'bg-amber-600/70' 
                                    : 'bg-stone-300 dark:bg-stone-700 h-1'
                              }`}
                              style={{
                                height: rec.pagesCompleted > 0 ? `${Math.min(100, Math.max(25, rec.pagesCompleted * 24))}%` : '4px'
                              }}
                            />
                          </div>

                          <span className="text-[9px] font-mono tabular-nums opacity-75">
                            {rec.pagesCompleted > 0 ? `${rec.pagesCompleted}p` : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] opacity-70 pt-2 border-t border-amber-900/10">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                      <span>Target Met</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                      <span>In Progress</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-700 inline-block" />
                      <span>Rest</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-900/10 dark:border-stone-800 bg-white dark:bg-stone-900/50 overflow-x-auto p-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10 opacity-70">
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Goal Title</th>
                        <th className="py-2 px-3 text-center">Pages</th>
                        <th className="py-2 px-3 text-center">Blanks</th>
                        <th className="py-2 px-3 text-center">Accuracy</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {[...historyStats.historyRecords].reverse().map((rec) => (
                        <tr key={rec.date}>
                          <td className="py-2 px-3 font-mono font-medium">{rec.date}</td>
                          <td className="py-2 px-3 font-semibold">{rec.targetTitle || 'Daily Testing'}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-amber-800 dark:text-amber-400">{rec.pagesCompleted}</td>
                          <td className="py-2 px-3 text-center font-mono">{rec.blanksAnswered}</td>
                          <td className="py-2 px-3 text-center font-mono">{rec.blanksAnswered > 0 ? `${Math.round((rec.blanksCorrect / rec.blanksAnswered) * 100)}%` : '—'}</td>
                          <td className="py-2 px-3 text-right">
                            {rec.targetMet ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">Met ✓</span>
                            ) : (
                              <span className="opacity-60 text-[10px]">Logged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 30 Juz Mastery Breakdown */}
          {viewTab === 'juz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  All 30 Juz Retention Breakdown
                </span>
                
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
                  <button
                    onClick={() => setSelectedJuzFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedJuzFilter === 'all' ? 'bg-amber-800 text-white shadow-xs' : 'opacity-70'
                    }`}
                  >
                    All 30 Juz
                  </button>
                  <button
                    onClick={() => setSelectedJuzFilter('tested')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedJuzFilter === 'tested' ? 'bg-amber-800 text-white shadow-xs' : 'opacity-70'
                    }`}
                  >
                    Practiced Only
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[480px] overflow-y-auto p-1">
                {JUZ_PAGE_DEFINITIONS.filter(j => {
                  if (selectedJuzFilter === 'tested') {
                    return dailyProgress.completedPages.some(p => p >= j.startPage && p <= j.endPage);
                  }
                  return true;
                }).map((j) => {
                  const totalJuzPages = j.endPage - j.startPage + 1;
                  const completedInJuz = dailyProgress.completedPages.filter(p => p >= j.startPage && p <= j.endPage).length;
                  const pct = Math.round((completedInJuz / totalJuzPages) * 100);

                  return (
                    <div 
                      key={j.juz}
                      className="p-3 rounded-2xl bg-white dark:bg-stone-900/50 border border-amber-900/10 dark:border-stone-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-900 dark:text-amber-300">
                          Juz {j.juz} • {j.name}
                        </span>
                        <span className="font-mono text-[10px] opacity-75">
                          p.{j.startPage}-{j.endPage}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="opacity-70">{completedInJuz}/{totalJuzPages} pages</span>
                          <span className="font-mono font-bold">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-700 rounded-full"
                            style={{ width: `${Math.max(pct, completedInJuz > 0 ? 10 : 0)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          triggerHaptic('medium');
                          onClose();
                          onStartPractice(j.startPage);
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-amber-800 hover:text-white transition-all text-xs font-semibold cursor-pointer text-center"
                      >
                        Practice Juz {j.juz}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Mistakes Bank */}
          {viewTab === 'mistakes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/50 border border-amber-900/10 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Retention & Mistake Bank</span>
                  </span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                    {mistakesCount} flagged verses
                  </span>
                </div>
                
                <p className="text-xs opacity-75 leading-relaxed">
                  Verses where you selected distractors during testing are automatically saved here for periodic revision.
                </p>

                {mistakesCount > 0 ? (
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onClose();
                      onOpenReview();
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Open Mistake Review Bank</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Clean Record! No mistakes currently flagged.</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
