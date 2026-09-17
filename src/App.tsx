/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BlankTarget, CarouselOption, ChallengeType, DifficultyLevel, GameStats, MushafTheme, QuranPageData, Surah, Ayah, PageRangeConfig, RangeSessionStats, PageViewMode, PageRenderMode, PageMarginConfig } from './types';
import { BUILT_IN_SURAHS } from './data/quranData';
import { fetchPage } from './services/quranApi';
import { createPageBlankTargets } from './utils/fifteenLineEngine';
import { FifteenLineMushafPage } from './components/FifteenLineMushafPage';
import { AuthenticMushafPage } from './components/AuthenticMushafPage';
import { SideVerseCarousel } from './components/SideVerseCarousel';
import { MobileBottomCarousel } from './components/MobileBottomCarousel';
import { SettingsModal } from './components/SettingsModal';
import { SurahPickerModal } from './components/SurahPickerModal';
import { PagePickerModal } from './components/PagePickerModal';
import { RangeCompleteModal } from './components/RangeCompleteModal';
import { ReviewDrawer } from './components/ReviewDrawer';
import { HowToPlayModal } from './components/HowToPlayModal';
import { AudioReciter } from './components/AudioReciter';
import { Loader2 } from 'lucide-react';
import { SURAH_METADATA_LIST } from './data/surahList';
import { triggerHaptic, getHapticsEnabled, setHapticsEnabled } from './utils/haptics';

const STATS_STORAGE_KEY = 'mushaf_15line_game_stats_v3';
const BLANK_COUNT_STORAGE_KEY = 'mushaf_blank_count_pref_v1';
const AUTO_ADVANCE_STORAGE_KEY = 'mushaf_auto_advance_v1';
const AUTO_ADVANCE_CORRECT_STORAGE_KEY = 'mushaf_auto_advance_correct_v1';
const AUTO_PLAY_AUDIO_STORAGE_KEY = 'mushaf_auto_play_audio_v1';
const PAGE_VIEW_MODE_STORAGE_KEY = 'mushaf_page_view_mode_v1';
const PAGE_RENDER_MODE_STORAGE_KEY = 'mushaf_page_render_mode_v1';
const PAGE_MARGINS_STORAGE_KEY = 'mushaf_page_margins_v1';

// Helper to determine facing spread page numbers in Medina Mushaf
export function getSpreadPageNumbers(pageNum: number, mode: PageViewMode): { rightPage: number; leftPage: number | null } {
  const bounded = Math.max(1, Math.min(604, pageNum));
  if (mode === 'single') {
    return { rightPage: bounded, leftPage: null };
  }
  // Opening page (Al-Fatihah)
  if (bounded === 1) {
    return { rightPage: 1, leftPage: 2 };
  }
  // Even pages on Right, Odd pages on Left in standard Arabic book opening
  const rightPage = bounded % 2 === 0 ? bounded : bounded - 1;
  const leftPage = rightPage + 1 <= 604 ? rightPage + 1 : null;
  return { rightPage, leftPage };
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<MushafTheme>('parchment');
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  // Page Render Mode (Authentic Printed Medina Mushaf Page Image vs Digital Text)
  const [pageRenderMode, setPageRenderMode] = useState<PageRenderMode>(() => {
    try {
      const saved = localStorage.getItem(PAGE_RENDER_MODE_STORAGE_KEY);
      if (saved === 'authentic-image' || saved === 'digital-text') return saved;
    } catch {
      // fallback
    }
    return 'digital-text'; // Digital text mode with full inline blanks on lines
  });

  const handleChangePageRenderMode = (mode: PageRenderMode) => {
    setPageRenderMode(mode);
    try {
      localStorage.setItem(PAGE_RENDER_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  // Page View Mode (1 Page vs 2 Pages spread for Desktop/Tablet)
  const [pageViewMode, setPageViewMode] = useState<PageViewMode>(() => {
    try {
      const saved = localStorage.getItem(PAGE_VIEW_MODE_STORAGE_KEY);
      if (saved === 'single' || saved === 'double') return saved;
    } catch {
      // fallback
    }
    return 'single';
  });

  // Page Margins (Adjustable spacing for Mushaf page)
  const [pageMargins, setPageMargins] = useState<PageMarginConfig>(() => {
    try {
      const saved = localStorage.getItem(PAGE_MARGINS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.horizontalPadding === 'number' && typeof parsed.verticalPadding === 'number') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return {
      preset: 'standard',
      horizontalPadding: 24,
      verticalPadding: 10,
    };
  });

  const handleChangePageMargins = (newMargins: PageMarginConfig) => {
    setPageMargins(newMargins);
    try {
      localStorage.setItem(PAGE_MARGINS_STORAGE_KEY, JSON.stringify(newMargins));
    } catch {
      // ignore
    }
  };

  // Auto-play ayah recitation audio upon completing a blank (Default to false / optional)
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTO_PLAY_AUDIO_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return false; // Default to false (silent mode) per user preference
  });

  // Page Navigation (1 to 604) - Default to Page 236 (Surah Yusuf page matching reference screenshot)
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(236);
  const [currentPageData, setCurrentPageData] = useState<QuranPageData | null>(null);
  const [secondaryPageData, setSecondaryPageData] = useState<QuranPageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  // Range Testing Configuration
  const [activeRange, setActiveRange] = useState<PageRangeConfig | null>(null);
  const [isRangeCompleteOpen, setIsRangeCompleteOpen] = useState<boolean>(false);
  const [rangeStats, setRangeStats] = useState<RangeSessionStats>({
    completedPagesCount: 0,
    totalBlanksInSession: 0,
    correctBlanksInSession: 0,
  });

  // Auto-Advance preference: automatically go to next page when current page is completed
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTO_ADVANCE_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return true; // default enabled for smooth memorization flow
  });

  // Auto-advance directly to the next ayah/blank upon selecting the right option
  const [autoAdvanceOnCorrect, setAutoAdvanceOnCorrect] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTO_ADVANCE_CORRECT_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return true; // default enabled for fluid memorization
  });

  const handleToggleAutoAdvanceOnCorrect = () => {
    setAutoAdvanceOnCorrect(prev => {
      const next = !prev;
      try {
        localStorage.setItem(AUTO_ADVANCE_CORRECT_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  // Blank count choice: 1, 2, 3, 5, 'all'
  const [blankCountChoice, setBlankCountChoice] = useState<number | 'all'>(() => {
    try {
      const saved = localStorage.getItem(BLANK_COUNT_STORAGE_KEY);
      if (saved === 'all') return 'all';
      if (saved) {
        const p = parseInt(saved, 10);
        if (!isNaN(p) && p >= 1) return p;
      }
    } catch {
      // fallback
    }
    return 3;
  });

  // Challenge settings
  const [challengeType, setChallengeType] = useState<ChallengeType>('full-ayah');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  // Multi-Blank target state & Active Blank
  const [blankTargets, setBlankTargets] = useState<BlankTarget[]>([]);
  const [activeBlankIndex, setActiveBlankIndex] = useState<number>(0);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSurahPickerOpen, setIsSurahPickerOpen] = useState<boolean>(false);
  const [isPagePickerOpen, setIsPagePickerOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  // Haptics preference state
  const [hapticsEnabled, setHapticsEnabledState] = useState<boolean>(() => getHapticsEnabled());

  const handleToggleHaptics = () => {
    const nextVal = !hapticsEnabled;
    setHapticsEnabled(nextVal);
    setHapticsEnabledState(nextVal);
    if (nextVal) {
      triggerHaptic('medium');
    }
  };

  // Audio Recitation
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const [playingAyah, setPlayingAyah] = useState<Ayah | null>(null);

  // Responsive mobile screen check (< 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(prev => {
        if (prev !== mobile) return mobile;
        return prev;
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved stats', e);
    }
    return {
      totalAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      surahsPracticed: [12],
      pagesPracticed: [236],
      mistakeAyahs: []
    };
  });

  // Save stats on update
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }
  }, [stats]);

  // Save page view mode
  useEffect(() => {
    try {
      localStorage.setItem(PAGE_VIEW_MODE_STORAGE_KEY, pageViewMode);
    } catch (e) {
      console.warn('Failed to save page view mode', e);
    }
  }, [pageViewMode]);

  // Save blank count preference
  useEffect(() => {
    try {
      localStorage.setItem(BLANK_COUNT_STORAGE_KEY, String(blankCountChoice));
    } catch (e) {
      console.warn('Failed to save blank count pref', e);
    }
  }, [blankCountChoice]);

  // Save auto-advance preference
  useEffect(() => {
    try {
      localStorage.setItem(AUTO_ADVANCE_STORAGE_KEY, String(autoAdvance));
    } catch (e) {
      console.warn('Failed to save auto advance pref', e);
    }
  }, [autoAdvance]);

  // Save auto-play audio preference
  useEffect(() => {
    try {
      localStorage.setItem(AUTO_PLAY_AUDIO_STORAGE_KEY, String(autoPlayAudio));
    } catch (e) {
      console.warn('Failed to save auto play audio pref', e);
    }
  }, [autoPlayAudio]);

  // Helper to generate blank targets across pages
  const generateBlanksForPages = useCallback((
    rightData: QuranPageData,
    leftData: QuranPageData | null,
    countPref: number | 'all',
    cType: ChallengeType,
    diff: DifficultyLevel,
    mobileOnlyPortion: boolean = isMobile
  ) => {
    // If on mobile, force portion-ayah challenge so only portions of the ayah are hidden to fit the carousel cards
    const effectiveChallengeType: ChallengeType = mobileOnlyPortion ? 'portion-ayah' : cType;

    if (leftData && leftData.ayahs.length > 0) {
      // In double page mode, distribute blanks cleanly across both facing pages
      const countPerSide = countPref === 'all' 
        ? 'all' 
        : Math.max(1, Math.ceil((typeof countPref === 'number' ? countPref : 2) / 2));
      
      const rightCount = countPerSide === 'all' ? rightData.ayahs.length : countPerSide;
      const leftCount = countPerSide === 'all' ? leftData.ayahs.length : countPerSide;

      const rightTargets = createPageBlankTargets(
        rightData.ayahs,
        rightData.primarySurah,
        rightCount,
        effectiveChallengeType,
        diff,
        rightData.pageNumber,
        1
      );

      const leftTargets = createPageBlankTargets(
        leftData.ayahs,
        leftData.primarySurah,
        leftCount,
        effectiveChallengeType,
        diff,
        leftData.pageNumber,
        rightTargets.length + 1
      );

      return [...rightTargets, ...leftTargets];
    } else {
      const totalAyahs = rightData.ayahs.length;
      const count = countPref === 'all' ? totalAyahs : Math.min(countPref, totalAyahs);
      return createPageBlankTargets(
        rightData.ayahs,
        rightData.primarySurah,
        count,
        effectiveChallengeType,
        diff,
        rightData.pageNumber,
        1
      );
    }
  }, [isMobile]);

  // Load 15-line Quran page (and facing page if in double page mode)
  const loadPage = useCallback(async (pageNum: number, modeOverride?: PageViewMode) => {
    setIsLoadingPage(true);
    try {
      const mode = modeOverride || pageViewMode;
      const bounded = Math.max(1, Math.min(604, pageNum));
      const { rightPage, leftPage } = getSpreadPageNumbers(bounded, mode);

      // Fetch right page
      const rightData = await fetchPage(rightPage);
      setCurrentPageData(rightData);
      setCurrentPageNumber(bounded);

      // Fetch left page if in 2-page mode
      let leftData: QuranPageData | null = null;
      if (mode === 'double' && leftPage) {
        leftData = await fetchPage(leftPage);
        setSecondaryPageData(leftData);
      } else {
        setSecondaryPageData(null);
      }

      // Generate blank challenges across the loaded spread
      if (rightData && rightData.ayahs.length > 0) {
        const targets = generateBlanksForPages(rightData, leftData, blankCountChoice, challengeType, difficulty, isMobile);
        setBlankTargets(targets);
        setActiveBlankIndex(0);
      } else {
        setBlankTargets([]);
        setActiveBlankIndex(0);
      }

      // Record surah & page practiced in statistics
      if (rightData?.primarySurah?.number) {
        setStats(prev => {
          const sPracticed = prev.surahsPracticed.includes(rightData.primarySurah.number)
            ? prev.surahsPracticed
            : [...prev.surahsPracticed, rightData.primarySurah.number];
          const newPages = [rightPage];
          if (leftPage && mode === 'double') newPages.push(leftPage);
          const pPracticed = Array.from(new Set([...(prev.pagesPracticed || []), ...newPages]));
          return { ...prev, surahsPracticed: sPracticed, pagesPracticed: pPracticed };
        });
      }
    } catch (error) {
      console.error('Error loading page', error);
    } finally {
      setIsLoadingPage(false);
    }
  }, [pageViewMode, blankCountChoice, challengeType, difficulty, isMobile, generateBlanksForPages]);

  // Re-generate blanks when screen layout mode switches (e.g. mobile vs desktop)
  useEffect(() => {
    if (currentPageData && currentPageData.ayahs.length > 0) {
      const targets = generateBlanksForPages(currentPageData, secondaryPageData, blankCountChoice, challengeType, difficulty, isMobile);
      setBlankTargets(targets);
      setActiveBlankIndex(0);
    }
  }, [isMobile, generateBlanksForPages]);

  // Initial load - Page 236
  useEffect(() => {
    loadPage(236);
  }, []);

  // Handle Range & Spread Next Page Navigation
  const handleNextPage = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    triggerHaptic('pageFlip');
    const step = pageViewMode === 'double' ? 2 : 1;
    if (activeRange?.enabled) {
      if (currentPageNumber >= activeRange.endPage) {
        // We reached the end of the range!
        setIsRangeCompleteOpen(true);
        triggerHaptic('celebrate');
        return;
      }
    }

    if (currentPageNumber + step <= 604) {
      loadPage(currentPageNumber + step);
    } else if (currentPageNumber < 604) {
      loadPage(604);
    }
  }, [activeRange, currentPageNumber, pageViewMode, loadPage]);

  // Handle Previous Page Navigation
  const handlePreviousPage = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    triggerHaptic('pageFlip');
    const step = pageViewMode === 'double' ? 2 : 1;
    if (currentPageNumber - step >= 1) {
      loadPage(currentPageNumber - step);
    } else if (currentPageNumber > 1) {
      loadPage(1);
    }
  }, [currentPageNumber, pageViewMode, loadPage]);

  // Toggle Page View Mode (1 Page vs 2 Pages)
  const handleChangePageViewMode = (newMode: PageViewMode) => {
    triggerHaptic('light');
    setPageViewMode(newMode);
    loadPage(currentPageNumber, newMode);
  };

  // Range setting handler
  const handleSetRange = (range: PageRangeConfig | null) => {
    triggerHaptic('medium');
    setActiveRange(range);
    if (range?.enabled) {
      setRangeStats({
        completedPagesCount: 0,
        totalBlanksInSession: 0,
        correctBlanksInSession: 0,
      });
      loadPage(range.startPage);
    }
  };

  // Restart range from start
  const handleRestartRange = () => {
    triggerHaptic('medium');
    if (activeRange?.enabled) {
      setRangeStats({
        completedPagesCount: 0,
        totalBlanksInSession: 0,
        correctBlanksInSession: 0,
      });
      loadPage(activeRange.startPage);
    }
  };

  // Jump to Surah starting page
  const handleSelectSurahNumber = async (surahNumber: number) => {
    triggerHaptic('medium');
    try {
      const surahMeta = SURAH_METADATA_LIST.find(s => s.number === surahNumber);
      const startPage = surahMeta?.page || 1;
      await loadPage(startPage);
    } catch (e) {
      console.error('Failed to jump to surah', e);
    }
  };

  // Change blank count choice (1, 2, 3, 5, 'all')
  const handleChangeBlankCountChoice = (count: number | 'all') => {
    triggerHaptic('light');
    setBlankCountChoice(count);
    if (currentPageData && currentPageData.ayahs.length > 0) {
      const targets = generateBlanksForPages(currentPageData, secondaryPageData, count, challengeType, difficulty, isMobile);
      setBlankTargets(targets);
      setActiveBlankIndex(0);
    }
  };

  // Generate fresh random blanks on current page / spread
  const handleShuffleNewBlanks = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    triggerHaptic('medium');
    if (!currentPageData || currentPageData.ayahs.length === 0) return;
    const targets = generateBlanksForPages(currentPageData, secondaryPageData, blankCountChoice, challengeType, difficulty, isMobile);
    setBlankTargets(targets);
    setActiveBlankIndex(0);
  };

  // Reset answer states on current blanks so user can test again
  const handleResetPageBlanks = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    triggerHaptic('medium');
    setBlankTargets(prev => prev.map(t => ({
      ...t,
      isAnswered: false,
      isCorrect: false,
      userSelectedOptionId: undefined,
      selectedOption: undefined
    })));
  };

  // Handle clicking directly on a blank on the 15-line Mushaf page
  const handleSelectBlankById = (blankId: string) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    triggerHaptic('light');
    const idx = blankTargets.findIndex(t => t.id === blankId);
    if (idx !== -1) {
      setActiveBlankIndex(idx);
    }
  };

  // Handle selecting blank index from carousel controls
  const handleSelectBlankIndex = (idx: number) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    setActiveBlankIndex(idx);
  };

  // Handle option selection
  const handleSelectOption = (option: CarouselOption) => {
    const activeTarget = blankTargets[activeBlankIndex];
    if (!activeTarget || activeTarget.isAnswered) return;

    const correct = option.isCorrect;
    if (correct) {
      triggerHaptic('success');
    } else {
      triggerHaptic('error');
    }

    // Update active blank in array
    const updatedTargets = blankTargets.map((target, idx) => {
      if (idx === activeBlankIndex) {
        return {
          ...target,
          isAnswered: true,
          isCorrect: correct,
          userSelectedOptionId: option.id,
          selectedOption: option
        };
      }
      return target;
    });
    setBlankTargets(updatedTargets);

    // Update game statistics
    setStats(prev => {
      const totalAnswered = prev.totalAnswered + 1;
      const correctAnswers = correct ? prev.correctAnswers + 1 : prev.correctAnswers;
      const currentStreak = correct ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, currentStreak);

      let mistakeAyahs = [...prev.mistakeAyahs];
      if (!correct) {
        // Add to mistake list if not already there
        const alreadyExists = mistakeAyahs.some(m => m.ayah.number === activeTarget.fullAyah.number);
        if (!alreadyExists) {
          mistakeAyahs.unshift({
            ayah: activeTarget.fullAyah,
            surahName: currentSurahObj.name,
            surahEnglishName: currentSurahObj.englishName,
            surahNumber: currentSurahObj.number,
            pageNumber: activeTarget.pageNumber || currentPageNumber,
            timestamp: Date.now()
          });
        }
      }

      return {
        ...prev,
        totalAnswered,
        correctAnswers,
        currentStreak,
        bestStreak,
        mistakeAyahs
      };
    });

    // Update range stats if in active range session
    if (activeRange?.enabled) {
      setRangeStats(prev => ({
        ...prev,
        totalBlanksInSession: prev.totalBlanksInSession + 1,
        correctBlanksInSession: correct ? prev.correctBlanksInSession + 1 : prev.correctBlanksInSession,
      }));
    }

    // Auto audio recitation upon correct answer if enabled
    if (correct && autoPlayAudio && activeTarget.fullAyah.audio) {
      setActiveAudioUrl(activeTarget.fullAyah.audio);
      setPlayingAyah(activeTarget.fullAyah);
    }

    // Auto-advance to the next ayah/blank upon selecting the right option
    if (correct && autoAdvanceOnCorrect) {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }

      autoAdvanceTimerRef.current = setTimeout(() => {
        // Find next unanswered blank in order
        const nextUnansweredIdx = updatedTargets.findIndex((b, i) => i > activeBlankIndex && !b.isAnswered);
        if (nextUnansweredIdx !== -1) {
          setActiveBlankIndex(nextUnansweredIdx);
        } else {
          // Check if any earlier blank was skipped
          const firstUnanswered = updatedTargets.findIndex(b => !b.isAnswered);
          if (firstUnanswered !== -1) {
            setActiveBlankIndex(firstUnanswered);
          }
        }
      }, 700);
    }
  };

  // Change challenge mode & refresh blanks
  const handleChangeChallengeType = (type: ChallengeType) => {
    setChallengeType(type);
    if (currentPageData && currentPageData.ayahs.length > 0) {
      const targets = generateBlanksForPages(currentPageData, secondaryPageData, blankCountChoice, type, difficulty, isMobile);
      setBlankTargets(targets);
      setActiveBlankIndex(0);
    }
  };

  // Change difficulty & refresh distractors
  const handleChangeDifficulty = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    if (currentPageData && currentPageData.ayahs.length > 0) {
      const targets = generateBlanksForPages(currentPageData, secondaryPageData, blankCountChoice, challengeType, diff, isMobile);
      setBlankTargets(targets);
      setActiveBlankIndex(0);
    }
  };

  const handlePlayAyahAudio = (ayah: Ayah) => {
    if (ayah.audio) {
      setActiveAudioUrl(ayah.audio);
      setPlayingAyah(ayah);
    }
  };

  const handlePlayAudioUrl = (url?: string) => {
    if (url) setActiveAudioUrl(url);
  };

  const currentSurahObj: Surah = currentPageData?.primarySurah || BUILT_IN_SURAHS[12] || BUILT_IN_SURAHS[1];
  const activeBlankTarget: BlankTarget | null = blankTargets[activeBlankIndex] || blankTargets[0] || null;

  return (
    <div 
      id="mushaf-app-root" 
      className="h-[100dvh] max-h-[100dvh] w-screen overflow-hidden flex flex-col justify-between transition-colors duration-300 bg-amber-950/5 select-none"
    >
      {/* Main Tablet / Mobile Cockpit Workspace - Maximize screen space */}
      <main className="flex-1 min-h-0 w-full mx-auto px-1 sm:px-2 md:px-3 pt-1 sm:pt-1.5 pb-1 flex flex-col md:flex-row gap-1.5 md:gap-3 items-stretch justify-center overflow-hidden">
        
        {/* Left / Center Zone: Expanded Medina Mushaf Page(s) */}
        <section 
          id="tablet-mushaf-stage" 
          className={
            pageViewMode === 'double' && secondaryPageData
              ? "flex-1 md:flex-[2.2] lg:flex-[2.5] h-full flex flex-col items-stretch justify-center min-h-0 min-w-0 w-full overflow-hidden"
              : "flex-1 md:flex-[1.4] lg:flex-[1.6] h-full flex flex-col items-stretch justify-center min-h-0 min-w-0 w-full overflow-hidden"
          }
        >
          {isLoadingPage || !currentPageData ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-amber-50/60 rounded-2xl border-2 border-amber-900/20 shadow-lg">
              <Loader2 className="w-10 h-10 text-amber-800 animate-spin mb-3" />
              <p className="font-bold text-amber-950 font-display tracking-wide text-sm">
                LOADING 15-LINE MUSHAF PAGE {currentPageNumber}...
              </p>
              <p className="text-xs text-amber-900/70 mt-1">
                Arranging standard 15 lines with Medina Uthmani script
              </p>
            </div>
          ) : (
            <div className="w-full h-full min-h-0 flex flex-col items-stretch justify-center">
              
              {/* Mobile View: Compact & Natural Word Proportions */}
              <div className="block md:hidden w-full h-full min-h-0">
                <div className="w-full h-full max-w-[440px] px-0 sm:px-0 mx-auto flex flex-col justify-center">
                  {pageRenderMode === 'authentic-image' ? (
                    <AuthenticMushafPage
                      pageData={currentPageData}
                      blankTargets={blankTargets}
                      activeBlankId={activeBlankTarget?.id}
                      onSelectBlankId={handleSelectBlankById}
                      selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                      isAnswered={activeBlankTarget?.isAnswered || false}
                      isCorrect={activeBlankTarget?.isCorrect || false}
                      theme={theme}
                      pageMargins={pageMargins}
                      onPlayAyahAudio={handlePlayAyahAudio}
                      onOpenSettings={() => setIsSettingsOpen(true)}
                      mistakesCount={stats.mistakeAyahs.length}
                      showTranslation={showTranslation}
                    />
                  ) : (
                    <FifteenLineMushafPage
                      pageData={currentPageData}
                      blankTargets={blankTargets}
                      activeBlankId={activeBlankTarget?.id}
                      onSelectBlankId={handleSelectBlankById}
                      selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                      isAnswered={activeBlankTarget?.isAnswered || false}
                      isCorrect={activeBlankTarget?.isCorrect || false}
                      theme={theme}
                      pageMargins={pageMargins}
                      onPlayAyahAudio={handlePlayAyahAudio}
                      onOpenSettings={() => setIsSettingsOpen(true)}
                      mistakesCount={stats.mistakeAyahs.length}
                      showTranslation={showTranslation}
                    />
                  )}
                </div>
              </div>

              {/* Tablet & Desktop View: 1-Page or 2-Pages Facing Spread */}
              <div className="hidden md:flex w-full h-full min-h-0 items-center justify-center gap-2 lg:gap-3">
                {pageViewMode === 'double' && secondaryPageData ? (
                  <>
                    {/* Right Facing Page */}
                    <div className="h-full flex-1 min-w-0 flex items-center justify-center max-w-[460px] px-0 sm:px-0">
                      {pageRenderMode === 'authentic-image' ? (
                        <AuthenticMushafPage
                          pageData={currentPageData}
                          blankTargets={blankTargets}
                          activeBlankId={activeBlankTarget?.id}
                          onSelectBlankId={handleSelectBlankById}
                          selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                          isAnswered={activeBlankTarget?.isAnswered || false}
                          isCorrect={activeBlankTarget?.isCorrect || false}
                          theme={theme}
                          pageMargins={pageMargins}
                          onPlayAyahAudio={handlePlayAyahAudio}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                          mistakesCount={stats.mistakeAyahs.length}
                          showTranslation={showTranslation}
                        />
                      ) : (
                        <FifteenLineMushafPage
                          pageData={currentPageData}
                          blankTargets={blankTargets}
                          activeBlankId={activeBlankTarget?.id}
                          onSelectBlankId={handleSelectBlankById}
                          selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                          isAnswered={activeBlankTarget?.isAnswered || false}
                          isCorrect={activeBlankTarget?.isCorrect || false}
                          theme={theme}
                          pageMargins={pageMargins}
                          onPlayAyahAudio={handlePlayAyahAudio}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                          mistakesCount={stats.mistakeAyahs.length}
                          showTranslation={showTranslation}
                        />
                      )}
                    </div>

                    {/* Authentic Medina Mushaf Book Spine / Center Binding Fold */}
                    <div className="flex flex-col items-center justify-center w-2 lg:w-3 h-[92%] relative z-10 select-none flex-shrink-0">
                      <div className="w-[1.5px] h-full bg-gradient-to-b from-amber-950/20 via-amber-950/50 to-amber-950/20 dark:from-stone-600/30 dark:via-stone-600/70 dark:to-stone-600/30 rounded-full shadow-inner" />
                      <div className="absolute inset-y-0 -left-2 w-2 bg-gradient-to-r from-transparent to-black/5 dark:to-black/25 pointer-events-none" />
                      <div className="absolute inset-y-0 -right-2 w-2 bg-gradient-to-l from-transparent to-black/5 dark:to-black/25 pointer-events-none" />
                    </div>

                    {/* Left Facing Page */}
                    <div className="h-full flex-1 min-w-0 flex items-center justify-center max-w-[460px] px-0 sm:px-0">
                      {pageRenderMode === 'authentic-image' ? (
                        <AuthenticMushafPage
                          pageData={secondaryPageData}
                          blankTargets={blankTargets}
                          activeBlankId={activeBlankTarget?.id}
                          onSelectBlankId={handleSelectBlankById}
                          selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                          isAnswered={activeBlankTarget?.isAnswered || false}
                          isCorrect={activeBlankTarget?.isCorrect || false}
                          theme={theme}
                          pageMargins={pageMargins}
                          onPlayAyahAudio={handlePlayAyahAudio}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                          mistakesCount={stats.mistakeAyahs.length}
                          showTranslation={showTranslation}
                          isSecondaryPage={true}
                        />
                      ) : (
                        <FifteenLineMushafPage
                          pageData={secondaryPageData}
                          blankTargets={blankTargets}
                          activeBlankId={activeBlankTarget?.id}
                          onSelectBlankId={handleSelectBlankById}
                          selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                          isAnswered={activeBlankTarget?.isAnswered || false}
                          isCorrect={activeBlankTarget?.isCorrect || false}
                          theme={theme}
                          pageMargins={pageMargins}
                          onPlayAyahAudio={handlePlayAyahAudio}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                          mistakesCount={stats.mistakeAyahs.length}
                          showTranslation={showTranslation}
                          isSecondaryPage={true}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  /* Single Page Focused Mode - Balanced Quran Book Proportion */
                  <div className="w-full h-full min-h-0 flex items-center justify-center">
                    <div className="w-full h-full max-w-[480px] px-0 sm:px-0 mx-auto flex flex-col justify-center">
                      {pageRenderMode === 'authentic-image' ? (
                        <AuthenticMushafPage
                          pageData={currentPageData}
                          blankTargets={blankTargets}
                          activeBlankId={activeBlankTarget?.id}
                          onSelectBlankId={handleSelectBlankById}
                          selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                          isAnswered={activeBlankTarget?.isAnswered || false}
                          isCorrect={activeBlankTarget?.isCorrect || false}
                          theme={theme}
                          pageMargins={pageMargins}
                          onPlayAyahAudio={handlePlayAyahAudio}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                          mistakesCount={stats.mistakeAyahs.length}
                          showTranslation={showTranslation}
                        />
                      ) : (
                        <FifteenLineMushafPage
                          pageData={currentPageData}
                          blankTargets={blankTargets}
                          activeBlankId={activeBlankTarget?.id}
                          onSelectBlankId={handleSelectBlankById}
                          selectedOptionId={activeBlankTarget?.userSelectedOptionId}
                          isAnswered={activeBlankTarget?.isAnswered || false}
                          isCorrect={activeBlankTarget?.isCorrect || false}
                          theme={theme}
                          pageMargins={pageMargins}
                          onPlayAyahAudio={handlePlayAyahAudio}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                          mistakesCount={stats.mistakeAyahs.length}
                          showTranslation={showTranslation}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </section>

        {/* Desktop Side Zone: Interactive Side Challenge Carousel & Controls */}
        <section 
          id="tablet-sidebar-stage" 
          className="hidden md:flex flex-1 max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl h-full flex-col justify-between min-h-0 min-w-0"
        >
          <SideVerseCarousel
            blankTargets={blankTargets}
            activeBlankIndex={activeBlankIndex}
            onSelectBlankIndex={handleSelectBlankIndex}
            blankCountChoice={blankCountChoice}
            onChangeBlankCountChoice={handleChangeBlankCountChoice}
            selectedOption={activeBlankTarget?.selectedOption || null}
            isAnswered={activeBlankTarget?.isAnswered || false}
            isCorrect={activeBlankTarget?.isCorrect || false}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleShuffleNewBlanks}
            onResetPageBlanks={handleResetPageBlanks}
            onPlayAudio={handlePlayAudioUrl}
            autoPlayAudio={autoPlayAudio}
            onToggleAutoPlayAudio={() => setAutoPlayAudio(!autoPlayAudio)}
            currentSurah={currentSurahObj}
            currentPageNumber={currentPageNumber}
            pageViewMode={pageViewMode}
            secondaryPageNumber={secondaryPageData?.pageNumber || null}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onOpenSurahPicker={() => setIsSurahPickerOpen(true)}
            onOpenPagePicker={() => setIsPagePickerOpen(true)}
            onOpenRangePicker={() => setIsPagePickerOpen(true)}
            activeRange={activeRange}
            autoAdvance={autoAdvance}
            onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
            challengeType={challengeType}
            difficulty={difficulty}
            onChangeChallengeType={handleChangeChallengeType}
            onChangeDifficulty={handleChangeDifficulty}
            streak={stats.currentStreak}
            bestStreak={stats.bestStreak}
            totalAnswered={stats.totalAnswered}
            correctAnswers={stats.correctAnswers}
            isPlayingAudio={!!activeAudioUrl}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </section>

        {/* Mobile Bottom Zone: Docked Bottom Carousel */}
        <div id="mobile-docked-carousel-container" className="block md:hidden flex-shrink-0 w-full z-20">
          <MobileBottomCarousel
            blankTargets={blankTargets}
            activeBlankIndex={activeBlankIndex}
            onSelectBlankIndex={handleSelectBlankIndex}
            selectedOption={activeBlankTarget?.selectedOption || null}
            isAnswered={activeBlankTarget?.isAnswered || false}
            isCorrect={activeBlankTarget?.isCorrect || false}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleShuffleNewBlanks}
            onResetPageBlanks={handleResetPageBlanks}
            onPlayAudio={handlePlayAudioUrl}
            currentSurah={currentSurahObj}
            currentPageNumber={currentPageNumber}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            autoAdvance={autoAdvance}
            onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
            difficulty={difficulty}
            onOpenSettings={() => setIsSettingsOpen(true)}
            showTranslation={showTranslation}
          />
        </div>

      </main>

      {/* Floating Recitation Player */}
      {activeAudioUrl && (
        <AudioReciter
          currentSurah={currentSurahObj}
          currentAyah={playingAyah}
          audioUrl={activeAudioUrl}
          onClose={() => setActiveAudioUrl(null)}
        />
      )}

      {/* Fullscreen Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pageRenderMode={pageRenderMode}
        onChangePageRenderMode={handleChangePageRenderMode}
        pageMargins={pageMargins}
        onChangePageMargins={handleChangePageMargins}
        challengeType={challengeType}
        onChangeChallengeType={handleChangeChallengeType}
        difficulty={difficulty}
        onChangeDifficulty={handleChangeDifficulty}
        pageViewMode={pageViewMode}
        onChangePageViewMode={handleChangePageViewMode}
        isMobile={isMobile}
        blankCountChoice={blankCountChoice}
        onChangeBlankCountChoice={handleChangeBlankCountChoice}
        autoPlayAudio={autoPlayAudio}
        onToggleAutoPlayAudio={() => setAutoPlayAudio(!autoPlayAudio)}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation(!showTranslation)}
        hapticsEnabled={hapticsEnabled}
        onToggleHaptics={handleToggleHaptics}
        autoAdvance={autoAdvance}
        onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
        autoAdvanceOnCorrect={autoAdvanceOnCorrect}
        onToggleAutoAdvanceOnCorrect={handleToggleAutoAdvanceOnCorrect}
        theme={theme}
        onChangeTheme={setTheme}
        onShuffleNewBlanks={handleShuffleNewBlanks}
        onResetPageBlanks={handleResetPageBlanks}
        onOpenSurahPicker={() => setIsSurahPickerOpen(true)}
        onOpenPagePicker={() => setIsPagePickerOpen(true)}
        onOpenReview={() => setIsReviewOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        currentSurah={currentSurahObj}
        currentPageNumber={currentPageNumber}
        activeRange={activeRange}
        mistakesCount={stats.mistakeAyahs.length}
        totalAnswered={stats.totalAnswered}
        correctAnswers={stats.correctAnswers}
      />

      {/* Surah Picker Modal (1 to 114) */}
      <SurahPickerModal
        isOpen={isSurahPickerOpen}
        onClose={() => setIsSurahPickerOpen(false)}
        onSelectSurah={handleSelectSurahNumber}
        currentSurahNumber={currentSurahObj.number}
      />

      {/* Page, Range & Juz Picker Modal (1 to 604 & Juz 1 to 30) */}
      <PagePickerModal
        isOpen={isPagePickerOpen}
        onClose={() => setIsPagePickerOpen(false)}
        onSelectPage={(p) => loadPage(p)}
        currentPageNumber={currentPageNumber}
        activeRange={activeRange}
        onSetRange={handleSetRange}
      />

      {/* Range Completion Celebratory Modal */}
      <RangeCompleteModal
        isOpen={isRangeCompleteOpen}
        onClose={() => setIsRangeCompleteOpen(false)}
        rangeConfig={activeRange}
        rangeStats={rangeStats}
        onRestartRange={handleRestartRange}
        onOpenRangePicker={() => setIsPagePickerOpen(true)}
        onContinueNextPage={() => {
          if (activeRange && activeRange.endPage < 604) {
            loadPage(activeRange.endPage + 1);
          }
        }}
      />

      {/* Mistake Review Drawer */}
      <ReviewDrawer
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        stats={stats}
        onClearMistakes={() => setStats(prev => ({ ...prev, mistakeAyahs: [] }))}
        onPlayAudio={handlePlayAudioUrl}
        onSelectSurahToPractice={handleSelectSurahNumber}
      />

      {/* How To Play Guide Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

    </div>
  );
}
