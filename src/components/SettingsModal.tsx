import React from 'react';
import { 
  X, Settings, Sparkles, Layers, Sliders, Volume2, VolumeX, Eye, EyeOff, 
  RotateCcw, Shuffle, BookOpen, Bookmark, HelpCircle, Check, ArrowRight, 
  Zap, Palette, ShieldAlert, Award, Compass, FileText, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChallengeType, DifficultyLevel, MushafTheme, PageViewMode, Surah, PageRangeConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Challenge Mode & Difficulty
  challengeType: ChallengeType;
  onChangeChallengeType: (type: ChallengeType) => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  // Page Layout (1 Page vs 2 Pages)
  pageViewMode: PageViewMode;
  onChangePageViewMode: (mode: PageViewMode) => void;
  isMobile?: boolean;
  // Blanks count per page
  blankCountChoice: number | 'all';
  onChangeBlankCountChoice: (count: number | 'all') => void;
  // Audio & Translation & Haptics
  autoPlayAudio: boolean;
  onToggleAutoPlayAudio: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  hapticsEnabled?: boolean;
  onToggleHaptics?: () => void;
  // Auto-advance
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  // Theme
  theme: MushafTheme;
  onChangeTheme: (theme: MushafTheme) => void;
  // Actions
  onShuffleNewBlanks: () => void;
  onResetPageBlanks: () => void;
  onOpenSurahPicker: () => void;
  onOpenPagePicker: () => void;
  onOpenReview: () => void;
  onOpenHowToPlay: () => void;
  // Stats & Info
  currentSurah: Surah;
  currentPageNumber: number;
  activeRange: PageRangeConfig | null;
  mistakesCount: number;
  totalAnswered: number;
  correctAnswers: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  challengeType,
  onChangeChallengeType,
  difficulty,
  onChangeDifficulty,
  pageViewMode,
  onChangePageViewMode,
  isMobile = false,
  blankCountChoice,
  onChangeBlankCountChoice,
  autoPlayAudio,
  onToggleAutoPlayAudio,
  showTranslation,
  onToggleTranslation,
  hapticsEnabled = true,
  onToggleHaptics,
  autoAdvance,
  onToggleAutoAdvance,
  theme,
  onChangeTheme,
  onShuffleNewBlanks,
  onResetPageBlanks,
  onOpenSurahPicker,
  onOpenPagePicker,
  onOpenReview,
  onOpenHowToPlay,
  currentSurah,
  currentPageNumber,
  activeRange,
  mistakesCount,
  totalAnswered,
  correctAnswers,
}) => {
  if (!isOpen) return null;

  const accuracyPct = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  return (
    <AnimatePresence>
      <div 
        id="settings-modal-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          id="settings-modal-content"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-[#fdfbf7] dark:bg-[#191c20] text-stone-900 dark:text-stone-100 sm:rounded-3xl shadow-2xl border sm:border-2 border-amber-900/25 flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-amber-900/15 bg-amber-900/5 dark:bg-stone-900/60 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-sm">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display tracking-wide text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                  MUSHAF SETTINGS & CONTROLS
                </h2>
                <p className="text-xs text-amber-900/70 dark:text-amber-300/70 font-sans">
                  Customize testing modes, difficulty, blanks & interface
                </p>
              </div>
            </div>

            <button
              id="close-settings-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              title="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 custom-scrollbar">
            
            {/* Current Context Pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-100/70 dark:bg-stone-800/80 border border-amber-900/15 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="font-bold text-amber-950 dark:text-amber-200">
                  Page {currentPageNumber} • {currentSurah.englishName} ({currentSurah.name})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { onClose(); onOpenPagePicker(); }}
                  className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer shadow-xs"
                >
                  Change Page
                </button>
                <button
                  onClick={() => { onClose(); onOpenSurahPicker(); }}
                  className="px-2.5 py-1 rounded-lg bg-amber-900/15 hover:bg-amber-900/25 text-amber-950 dark:text-amber-200 font-bold text-[11px] cursor-pointer"
                >
                  Surah List
                </button>
              </div>
            </div>

            {/* SECTION 1: Testing Mode */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  Challenge Mode
                </label>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isMobile ? 'Mobile: Portions (Carousel Fit)' : challengeType === 'full-ayah' ? 'Full Ayah testing' : 'Portion (Start / Middle / End)'}
                </span>
              </div>

              {isMobile && (
                <div className="p-2 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 border border-amber-900/20 text-[11px] text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Mobile Optimized:</strong> Verses are masked in concise 2-3 word portions to fit the bottom carousel cards as sketched.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="settings-mode-full-btn"
                  onClick={() => onChangeChallengeType('full-ayah')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    challengeType === 'full-ayah' && !isMobile
                      ? 'bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-600/30'
                      : 'bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:border-amber-700/40'
                  } ${isMobile ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">Complete Ayah</span>
                    {challengeType === 'full-ayah' && !isMobile && <Check className="w-4 h-4" />}
                  </div>
                  <p className={`text-[11px] leading-tight ${challengeType === 'full-ayah' && !isMobile ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                    Masks the entire verse. Ideal for tablet and desktop landscape memorization.
                  </p>
                </button>

                <button
                  id="settings-mode-portion-btn"
                  onClick={() => onChangeChallengeType('portion-ayah')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    challengeType === 'portion-ayah' || isMobile
                      ? 'bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-600/30'
                      : 'bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:border-amber-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">Portion Blanking</span>
                    {(challengeType === 'portion-ayah' || isMobile) && <Check className="w-4 h-4" />}
                  </div>
                  <p className={`text-[11px] leading-tight ${challengeType === 'portion-ayah' || isMobile ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                    Blanks dynamic beginning, middle, or ending clauses. Perfect for mobile bottom carousel.
                  </p>
                </button>
              </div>
            </div>

            {/* SECTION 2: Difficulty Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  Difficulty Level
                </label>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  {difficulty === 'easy' ? 'Easy (Distinct)' : difficulty === 'medium' ? 'Medium (Same Surah)' : 'Hafiz (Mutashabihat)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Easy */}
                <button
                  id="settings-diff-easy-btn"
                  onClick={() => onChangeDifficulty('easy')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    difficulty === 'easy'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:bg-emerald-50 dark:hover:bg-stone-700/70'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm">Easy</span>
                  <span className={`text-[10px] ${difficulty === 'easy' ? 'text-emerald-100' : 'text-stone-500'}`}>
                    Distinct Verses
                  </span>
                </button>

                {/* Medium */}
                <button
                  id="settings-diff-medium-btn"
                  onClick={() => onChangeDifficulty('medium')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    difficulty === 'medium'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-md'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:bg-amber-50 dark:hover:bg-stone-700/70'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm">Medium</span>
                  <span className={`text-[10px] ${difficulty === 'medium' ? 'text-amber-100' : 'text-stone-500'}`}>
                    Same-Surah Verses
                  </span>
                </button>

                {/* Hafiz Mutashabihat */}
                <button
                  id="settings-diff-hafiz-btn"
                  onClick={() => onChangeDifficulty('hafiz')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    difficulty === 'hafiz'
                      ? 'bg-red-800 text-white border-red-800 shadow-md ring-2 ring-red-600/30'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:bg-red-50 dark:hover:bg-stone-700/70'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm flex items-center gap-1">
                    <span>Hafiz</span> 👑
                  </span>
                  <span className={`text-[10px] font-medium ${difficulty === 'hafiz' ? 'text-red-100' : 'text-red-600 dark:text-red-400'}`}>
                    Mutashabihat
                  </span>
                </button>
              </div>
            </div>

            {/* SECTION 3: Page Display Layout (Desktop & Tablet) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  Page Display Layout (Desktop & Tablet)
                </label>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {pageViewMode === 'single' ? '1 Page Focused' : '2 Pages Spread'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1 Page Option */}
                <button
                  id="settings-layout-single-btn"
                  onClick={() => onChangePageViewMode('single')}
                  className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    pageViewMode === 'single'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-600/30'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:bg-amber-50 dark:hover:bg-stone-700/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>1 Page (Single Focused)</span>
                    </span>
                    {pageViewMode === 'single' && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <p className={`text-[11px] leading-snug ${pageViewMode === 'single' ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                    Single centered 15-line page with maximum font size.
                  </p>
                </button>

                {/* 2 Pages Option */}
                <button
                  id="settings-layout-double-btn"
                  onClick={() => onChangePageViewMode('double')}
                  className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    pageViewMode === 'double'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-600/30'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:bg-amber-50 dark:hover:bg-stone-700/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>2 Pages (Open Spread)</span>
                    </span>
                    {pageViewMode === 'double' && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <p className={`text-[11px] leading-snug ${pageViewMode === 'double' ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                    Two facing Medina pages side-by-side on wide screens.
                  </p>
                </button>
              </div>
            </div>

            {/* SECTION 4: Blanks Per Page */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                  <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  Blanks Per Page
                </label>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {blankCountChoice === 'all' ? 'All ayahs masked' : `${blankCountChoice} verse(s) per page`}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 'all'].map((opt) => {
                  const isSelected = blankCountChoice === opt;
                  return (
                    <button
                      key={String(opt)}
                      id={`settings-blanks-${opt}-btn`}
                      onClick={() => onChangeBlankCountChoice(opt as number | 'all')}
                      className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-900/15 hover:bg-amber-50'
                      }`}
                    >
                      {opt === 'all' ? 'ALL' : opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: Audio & Automation Toggles */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                <Sliders className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                Audio & Automation Preferences
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Auto Play Audio */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 dark:text-amber-200">
                      {autoPlayAudio ? <Volume2 className="w-4 h-4 text-amber-700 dark:text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">Ayah Recitation</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">Play audio on correct answer</div>
                    </div>
                  </div>
                  <button
                    id="settings-toggle-audio-btn"
                    onClick={onToggleAutoPlayAudio}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      autoPlayAudio ? 'bg-amber-800' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        autoPlayAudio ? 'transform translate-x-5' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* Auto Advance Page */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 dark:text-amber-200">
                      <Zap className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Auto-Advance Page</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">Proceed when page completed</div>
                    </div>
                  </div>
                  <button
                    id="settings-toggle-autoadvance-btn"
                    onClick={onToggleAutoAdvance}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      autoAdvance ? 'bg-amber-800' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        autoAdvance ? 'transform translate-x-5' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* English Meanings */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 dark:text-amber-200">
                      {showTranslation ? <Eye className="w-4 h-4 text-amber-700 dark:text-amber-400" /> : <EyeOff className="w-4 h-4 text-stone-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">English Meanings</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">Display Sahih Int. translation</div>
                    </div>
                  </div>
                  <button
                    id="settings-toggle-translation-btn"
                    onClick={onToggleTranslation}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      showTranslation ? 'bg-amber-800' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        showTranslation ? 'transform translate-x-5' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* Haptic Feedback (Vibration) */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 dark:text-amber-200">
                      <Smartphone className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Haptic Feedback</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">Vibrate on taps, page turns & answers</div>
                    </div>
                  </div>
                  <button
                    id="settings-toggle-haptics-btn"
                    onClick={onToggleHaptics}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      hapticsEnabled ? 'bg-amber-800' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                    title="Toggle Haptic Feedback"
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        hapticsEnabled ? 'transform translate-x-5' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* Review Mistakes Quick Access */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 dark:text-amber-200">
                      <Bookmark className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Mistake Bookmarks</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">{mistakesCount} verse(s) to review</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { onClose(); onOpenReview(); }}
                    className="px-2.5 py-1 rounded-lg bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-200 text-[11px] font-bold cursor-pointer"
                  >
                    Open
                  </button>
                </div>

                {/* How to Play Guide Quick Access */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 dark:text-amber-200">
                      <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">How to Play & Guide</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">Rules & memorization tips</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { onClose(); onOpenHowToPlay(); }}
                    className="px-2.5 py-1 rounded-lg bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-200 text-[11px] font-bold cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 5: Theme Appearance */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                <Palette className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                Mushaf Aesthetic & Color Scheme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Parchment */}
                <button
                  id="settings-theme-parchment-btn"
                  onClick={() => onChangeTheme('parchment')}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'parchment' ? 'border-amber-700 ring-2 ring-amber-600/30 bg-[#fcf9f2] text-stone-900' : 'border-amber-900/15 bg-[#fcf9f2] text-stone-800 hover:border-amber-700/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#fdfbf7] border border-amber-600/60 shadow-xs" />
                  <span className="text-[11px] font-bold">Parchment</span>
                </button>

                {/* Emerald */}
                <button
                  id="settings-theme-emerald-btn"
                  onClick={() => onChangeTheme('emerald')}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'emerald' ? 'border-emerald-700 ring-2 ring-emerald-600/30 bg-[#e8f5e9] text-emerald-950' : 'border-emerald-900/15 bg-[#e8f5e9] text-emerald-900 hover:border-emerald-700/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#e8f5e9] border border-emerald-600/60 shadow-xs" />
                  <span className="text-[11px] font-bold">Emerald</span>
                </button>

                {/* Midnight */}
                <button
                  id="settings-theme-midnight-btn"
                  onClick={() => onChangeTheme('midnight')}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'midnight' ? 'border-amber-500 ring-2 ring-amber-500/30 bg-[#1a1f24] text-amber-100' : 'border-stone-700 bg-[#1a1f24] text-stone-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#1a1f24] border border-amber-500/60 shadow-xs" />
                  <span className="text-[11px] font-bold">Midnight</span>
                </button>

                {/* Classic White */}
                <button
                  id="settings-theme-white-btn"
                  onClick={() => onChangeTheme('classic-white')}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'classic-white' ? 'border-stone-600 ring-2 ring-stone-400/30 bg-white text-stone-900' : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white border border-stone-400 shadow-xs" />
                  <span className="text-[11px] font-bold">White</span>
                </button>
              </div>
            </div>

            {/* SECTION 6: Session Actions (Shuffle & Reset) */}
            <div className="space-y-2 pt-1 border-t border-amber-900/10">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-display">
                <RotateCcw className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                Page Actions
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="settings-shuffle-blanks-btn"
                  onClick={() => { onShuffleNewBlanks(); onClose(); }}
                  className="p-3 rounded-2xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-900/15"
                >
                  <Shuffle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Shuffle New Blanks</span>
                </button>

                <button
                  id="settings-reset-blanks-btn"
                  onClick={() => { onResetPageBlanks(); onClose(); }}
                  className="p-3 rounded-2xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-900/15"
                >
                  <RotateCcw className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Retry Page Blanks</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Sticky Action Bar */}
          <div className="p-3 sm:p-4 border-t border-amber-900/15 bg-amber-900/5 dark:bg-stone-900/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-sans text-stone-600 dark:text-stone-400">
              <span>Overall Accuracy: <strong className="text-amber-900 dark:text-amber-300">{accuracyPct}%</strong></span>
              <span>•</span>
              <span>Answered: <strong className="text-amber-900 dark:text-amber-300">{totalAnswered}</strong></span>
            </div>

            <button
              id="settings-done-footer-btn"
              onClick={onClose}
              className="py-2 px-6 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Save & Apply</span>
              <Check className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
