import React, { useState } from 'react';
import { ChallengeType, DifficultyLevel, Surah } from '../types';
import { BookOpen, Flame, Shuffle, Award, ChevronLeft, ChevronRight, LayoutGrid, Columns, Sparkles } from 'lucide-react';

interface GameControlsProps {
  currentPageNumber: number;
  totalPages?: number;
  currentSurah: Surah;
  challengeType: ChallengeType;
  difficulty: DifficultyLevel;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  correctAnswers: number;
  isDualPageMode: boolean;
  onToggleDualPageMode: () => void;
  onOpenSurahPicker: () => void;
  onOpenPagePicker: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSelectPageNumber: (page: number) => void;
  onChangeChallengeType: (type: ChallengeType) => void;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  onNextRandomChallenge: () => void;
  onOpenReviewModal: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentPageNumber,
  totalPages = 604,
  currentSurah,
  challengeType,
  difficulty,
  streak,
  bestStreak,
  totalAnswered,
  correctAnswers,
  isDualPageMode,
  onToggleDualPageMode,
  onOpenSurahPicker,
  onOpenPagePicker,
  onPreviousPage,
  onNextPage,
  onSelectPageNumber,
  onChangeChallengeType,
  onChangeDifficulty,
  onNextRandomChallenge,
  onOpenReviewModal,
}) => {
  const [pageInputVal, setPageInputVal] = useState<string>(currentPageNumber.toString());
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 100;

  React.useEffect(() => {
    setPageInputVal(currentPageNumber.toString());
  }, [currentPageNumber]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInputVal, 10);
    if (!isNaN(p) && p >= 1 && p <= 604) {
      onSelectPageNumber(p);
    } else {
      setPageInputVal(currentPageNumber.toString());
    }
  };

  return (
    <div id="game-controls-bar" className="w-full max-w-4xl mx-auto mb-3 px-2 sm:px-4">
      <div className="flex flex-col gap-2 p-2.5 sm:p-3 rounded-2xl bg-amber-900/10 border border-amber-900/20 backdrop-blur-md">
        
        {/* Row 1: 15-Line Page Navigation & Jump Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/15 pb-2">
          
          {/* Page Navigator Stepper */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* RTL Quran Navigation: Left/back arrow advances to Next Page */}
            <button
              id="next-page-btn"
              onClick={onNextPage}
              disabled={currentPageNumber >= 604}
              className="p-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-800 disabled:opacity-40 text-amber-50 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Next Quran Page (Advance forward in RTL)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Next Page</span>
            </button>

            {/* Quick Page Jump Input */}
            <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
              <span className="text-xs font-bold text-amber-950">Page</span>
              <input
                type="number"
                min="1"
                max="604"
                value={pageInputVal}
                onChange={(e) => setPageInputVal(e.target.value)}
                onBlur={() => {
                  const p = parseInt(pageInputVal, 10);
                  if (p >= 1 && p <= 604) onSelectPageNumber(p);
                }}
                className="w-14 sm:w-16 px-1.5 py-1 text-center font-bold text-sm bg-white rounded-lg border border-amber-900/30 text-amber-950 focus:outline-amber-600 shadow-inner"
              />
              <span className="text-xs text-amber-900/70 font-semibold">/ 604</span>
            </form>

            {/* Right arrow returns to Previous Page */}
            <button
              id="prev-page-btn"
              onClick={onPreviousPage}
              disabled={currentPageNumber <= 1}
              className="p-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-800 disabled:opacity-40 text-amber-50 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Previous Quran Page (Return toward Page 1)"
            >
              <span className="hidden sm:inline">Prev Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Surah & Juz Jump Button */}
          <div className="flex items-center gap-2">
            <button
              id="open-surah-picker-btn"
              onClick={onOpenSurahPicker}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs shadow-sm transition-all cursor-pointer"
              title="Select Surah (1-114) or Juz (1-30)"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentSurah.englishName}</span>
            </button>

            {/* Dual Page View Toggle */}
            <button
              id="toggle-dual-page-btn"
              onClick={onToggleDualPageMode}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDualPageMode
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-200/60 hover:bg-amber-300/80 text-amber-950 border-amber-800/20'
              }`}
              title="Toggle Dual Side-by-Side Mushaf View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isDualPageMode ? 'Dual View' : 'Single Page'}</span>
            </button>
          </div>

        </div>

        {/* Row 2: Challenge Mode, Difficulty & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Challenge Type (Full vs Ending) */}
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-xl bg-amber-950/15 p-0.5 border border-amber-900/20 text-xs">
              <button
                id="mode-full-ayah-btn"
                onClick={() => onChangeChallengeType('full-ayah')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  challengeType === 'full-ayah'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-amber-900/80 hover:text-amber-950'
                }`}
              >
                Full Verse
              </button>
              <button
                id="mode-portion-ayah-btn"
                onClick={() => onChangeChallengeType('portion-ayah')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  challengeType === 'portion-ayah'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-amber-900/80 hover:text-amber-950'
                }`}
              >
                Ending Portion
              </button>
            </div>

            {/* Difficulty Level */}
            <div className="flex rounded-xl bg-amber-950/15 p-0.5 border border-amber-900/20 text-xs">
              <button
                id="diff-easy-btn"
                onClick={() => onChangeDifficulty('easy')}
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  difficulty === 'easy'
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-amber-900/80 hover:text-amber-950'
                }`}
              >
                Easy (3)
              </button>
              <button
                id="diff-medium-btn"
                onClick={() => onChangeDifficulty('medium')}
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  difficulty === 'medium'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-amber-900/80 hover:text-amber-950'
                }`}
              >
                Medium (4)
              </button>
              <button
                id="diff-hafiz-btn"
                onClick={() => onChangeDifficulty('hafiz')}
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  difficulty === 'hafiz'
                    ? 'bg-purple-700 text-white shadow-sm font-semibold'
                    : 'text-amber-900/80 hover:text-amber-950'
                }`}
              >
                Hafiz ★
              </button>
            </div>
          </div>

          {/* Right: Shuffle Blank on this page & Streak */}
          <div className="flex items-center gap-2">
            <button
              id="shuffle-blank-btn"
              onClick={onNextRandomChallenge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-300 text-amber-950 text-xs font-semibold border border-amber-800/20 transition-all cursor-pointer"
              title="Generate new missing blank on this page"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-800" />
              <span>Shuffle Blank</span>
            </button>

            {/* Streak Indicator */}
            <div 
              id="streak-badge"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/25 border border-amber-600/30 text-amber-950 font-bold text-xs shadow-sm"
            >
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-amber-600 fill-amber-500 animate-bounce' : 'text-amber-700/50'}`} />
              <span>Streak: {streak}</span>
            </div>

            {/* Accuracy Badge */}
            <button
              id="accuracy-btn"
              onClick={onOpenReviewModal}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 text-xs font-semibold border border-amber-900/20 cursor-pointer"
              title="Review mistakes & accuracy"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{accuracy}%</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
