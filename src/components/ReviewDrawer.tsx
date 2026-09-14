import React from 'react';
import { GameStats } from '../types';
import { BookMarked, X, Trash2, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onClearMistakes: () => void;
  onPlayAudio?: (audioUrl?: string) => void;
  onSelectSurahToPractice?: (surahNumber: number) => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  onClearMistakes,
  onPlayAudio,
  onSelectSurahToPractice,
}) => {
  if (!isOpen) return null;

  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
        
        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md h-full bg-amber-50 border-l-2 border-amber-800/30 shadow-2xl flex flex-col text-stone-800"
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amber-900/20 bg-gradient-to-r from-amber-200/50 via-amber-100 to-amber-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-800 text-amber-100 flex items-center justify-center">
                <BookMarked className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-amber-950 font-display">MEMORIZATION STATS</h3>
                <p className="text-xs text-amber-900/70">Review items & performance</p>
              </div>
            </div>

            <button
              id="close-review-drawer-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-amber-200/50 hover:bg-amber-300/80 text-amber-950 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="p-4 grid grid-cols-3 gap-2.5 border-b border-amber-900/15 bg-amber-100/30">
            <div className="p-3 rounded-xl bg-white border border-amber-900/15 text-center">
              <div className="text-xl font-bold text-amber-900">{stats.totalAnswered}</div>
              <div className="text-[10px] text-stone-500 font-semibold uppercase">Verses Tested</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-900/15 text-center">
              <div className="text-xl font-bold text-emerald-700">{accuracy}%</div>
              <div className="text-[10px] text-stone-500 font-semibold uppercase">Accuracy</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-900/15 text-center">
              <div className="text-xl font-bold text-amber-600">{stats.bestStreak}</div>
              <div className="text-[10px] text-stone-500 font-semibold uppercase">Best Streak</div>
            </div>
          </div>

          {/* Review List of Mistakes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Verses To Review ({stats.mistakeAyahs.length})
              </h4>
              {stats.mistakeAyahs.length > 0 && (
                <button
                  id="clear-mistakes-btn"
                  onClick={onClearMistakes}
                  className="flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {stats.mistakeAyahs.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-stone-700">Masha'Allah! Clean Slate</p>
                <p className="text-xs text-stone-500 mt-1">Any verses you miss during tests will appear here for focused review.</p>
              </div>
            ) : (
              stats.mistakeAyahs.map((item, idx) => (
                <div
                  key={`mistake_${idx}`}
                  className="p-3 rounded-xl bg-white border border-amber-900/20 shadow-xs flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                    <span>{item.surahName} [Ayah {item.ayahNumber}]</span>
                    {onSelectSurahToPractice && (
                      <button
                        onClick={() => {
                          onSelectSurahToPractice(item.surahNumber);
                          onClose();
                        }}
                        className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                      >
                        Practice Surah →
                      </button>
                    )}
                  </div>

                  <p className="font-quran text-lg text-right text-stone-900 leading-relaxed" dir="rtl">
                    {item.text}
                  </p>

                  <p className="text-xs text-stone-600 italic">
                    "{item.translation}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-amber-100/40 border-t border-amber-900/15 text-center text-xs text-amber-900/70">
            Keep reviewing daily to solidify your Quranic memorization!
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
