import React from 'react';
import { Award, CheckCircle2, RotateCcw, ArrowRight, BookOpen, Sparkles, X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRangeConfig, RangeSessionStats } from '../types';

interface RangeCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  rangeConfig: PageRangeConfig | null;
  rangeStats: RangeSessionStats;
  onRestartRange: () => void;
  onOpenRangePicker: () => void;
  onContinueNextPage: () => void;
}

export const RangeCompleteModal: React.FC<RangeCompleteModalProps> = ({
  isOpen,
  onClose,
  rangeConfig,
  rangeStats,
  onRestartRange,
  onOpenRangePicker,
  onContinueNextPage,
}) => {
  if (!isOpen || !rangeConfig) return null;

  const totalPages = rangeConfig.endPage - rangeConfig.startPage + 1;
  const accuracy = rangeStats.totalBlanksInSession > 0
    ? Math.round((rangeStats.correctBlanksInSession / rangeStats.totalBlanksInSession) * 100)
    : 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md rounded-2xl bg-[#fdfbf7] dark:bg-stone-900 border-2 border-amber-800/50 shadow-2xl overflow-hidden text-stone-800 dark:text-stone-100"
        >
          {/* Header Banner with Islamic Arch & Celebration */}
          <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-amber-50 p-6 text-center relative flex flex-col items-center">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-900/60 hover:bg-amber-800 text-amber-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center mb-3 shadow-lg ring-4 ring-amber-400/20">
              <Award className="w-8 h-8 text-amber-300 animate-bounce" />
            </div>

            <h3 className="font-display font-black text-xl text-amber-100 tracking-wide mb-1">
              RANGE TEST COMPLETED!
            </h3>
            <p className="text-xs text-amber-200/80 font-sans max-w-xs">
              MashaAllah! You have successfully tested every page in this memorization range.
            </p>
          </div>

          {/* Session Overview Stats */}
          <div className="p-5 flex flex-col gap-4">
            <div className="bg-amber-100/60 dark:bg-stone-800/80 p-3.5 rounded-xl border border-amber-900/15 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-900/80 dark:text-amber-300/80">Completed Range</span>
                <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100 font-display">
                  {rangeConfig.title || `Pages ${rangeConfig.startPage} – ${rangeConfig.endPage}`}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-950/60 px-2 py-1 rounded-lg">
                  {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
                </span>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-display font-black text-emerald-700 dark:text-emerald-300">
                  {accuracy}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                  Range Accuracy
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-800/20 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-display font-black text-amber-900 dark:text-amber-200">
                  {rangeStats.correctBlanksInSession} / {rangeStats.totalBlanksInSession}
                </span>
                <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                  Blanks Solved
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onRestartRange();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>Repeat This Range (Page {rangeConfig.startPage})</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenRangePicker();
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-100 font-bold text-xs border border-amber-900/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" />
                  <span>Choose New Range</span>
                </button>

                <button
                  onClick={() => {
                    onContinueNextPage();
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-100 font-bold text-xs border border-amber-900/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continue Next (p.{rangeConfig.endPage + 1})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
