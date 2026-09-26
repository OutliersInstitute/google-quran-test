import { JUZ_PAGE_DEFINITIONS, SURAH_METADATA_LIST, getSurahPageRange } from '../data/surahList';
import { DailyProgressData, DailyTargetConfig, GoalProgressSummary } from '../types';

export const DAILY_TARGET_STORAGE_KEY = 'mushaf_daily_target_config_v1';
export const DAILY_PROGRESS_STORAGE_KEY = 'mushaf_daily_progress_v1';

/**
 * Returns today's date string in YYYY-MM-DD local timezone
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns default initial target for a user:
 * Targeting Surah Yusuf (pages 235-248) or Juz 12 (pages 222-241) matching initial page 236.
 */
export function getDefaultDailyTarget(): DailyTargetConfig {
  return {
    enabled: true,
    mode: 'pages-range',
    title: 'Surah Yusuf (Pages 235–248)',
    startPage: 235,
    endPage: 248,
    targetPagesCount: 14,
    targetBlanksCount: 20,
    selectedSurah: 12,
    surahName: 'Yusuf',
  };
}

/**
 * Load daily target configuration from localStorage
 */
export function loadDailyTargetConfig(): DailyTargetConfig {
  try {
    const raw = localStorage.getItem(DAILY_TARGET_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.enabled === 'boolean') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load daily target config', e);
  }
  return getDefaultDailyTarget();
}

/**
 * Save daily target configuration to localStorage
 */
export function saveDailyTargetConfig(config: DailyTargetConfig): void {
  try {
    localStorage.setItem(DAILY_TARGET_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save daily target config', e);
  }
}

/**
 * Load daily progress from localStorage with automatic day rollover & streak maintenance
 */
export function loadDailyProgress(): DailyProgressData {
  const today = getTodayDateString();
  const defaultProgress: DailyProgressData = {
    date: today,
    completedPages: [],
    practicedPages: [236],
    blanksCompletedToday: 0,
    correctBlanksToday: 0,
    currentStreakDays: 1,
    lastActiveDate: today,
  };

  try {
    const raw = localStorage.getItem(DAILY_PROGRESS_STORAGE_KEY);
    if (!raw) return defaultProgress;

    const parsed: DailyProgressData = JSON.parse(raw);
    if (!parsed) return defaultProgress;

    // Check if progress belongs to today
    if (parsed.date === today) {
      return parsed;
    }

    // New day rollover: calculate streak
    const lastDate = new Date(parsed.date);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = parsed.currentStreakDays || 1;
    if (diffDays === 1) {
      // Consecutive day streak continue
      newStreak = (parsed.completedPages.length > 0 || parsed.blanksCompletedToday > 0)
        ? (parsed.currentStreakDays || 1) + 1
        : parsed.currentStreakDays || 1;
    } else if (diffDays > 2) {
      // Streak broken after more than 1 missed day
      newStreak = 1;
    }

    const resetForToday: DailyProgressData = {
      date: today,
      completedPages: [],
      practicedPages: [],
      blanksCompletedToday: 0,
      correctBlanksToday: 0,
      currentStreakDays: newStreak,
      lastActiveDate: parsed.date || today,
    };
    saveDailyProgress(resetForToday);
    return resetForToday;
  } catch (e) {
    console.warn('Failed to load daily progress', e);
  }

  return defaultProgress;
}

/**
 * Save daily progress to localStorage
 */
export function saveDailyProgress(progress: DailyProgressData): void {
  try {
    localStorage.setItem(DAILY_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save daily progress', e);
  }
}

/**
 * Calculate goal progress summary based on active target, daily progress, and current page spread
 */
export function calculateGoalProgress(
  target: DailyTargetConfig,
  progress: DailyProgressData,
  currentPageNumber: number,
  secondaryPageNumber?: number | null
): GoalProgressSummary {
  if (!target || !target.enabled) {
    return {
      percent: 0,
      current: 0,
      target: 0,
      unit: 'pages',
      formattedLabel: 'No Target Set',
      title: 'Daily Goal',
      isComplete: false,
      relativePositionPercent: 0,
      isOnTargetPage: false,
    };
  }

  const { mode } = target;
  let targetCount = 1;
  let currentCount = 0;
  let unit: 'pages' | 'blanks' = 'pages';
  let formattedLabel = '';
  let title = target.title || 'Daily Goal';
  let startPage = target.startPage || 1;
  let endPage = target.endPage || 604;
  let isOnTargetPage = false;
  let relativePositionPercent = 0;
  let spreadPositionText = '';

  // Determine span
  if (mode === 'juz') {
    const juzNum = target.selectedJuz || 1;
    const def = JUZ_PAGE_DEFINITIONS.find(j => j.juz === juzNum);
    startPage = def?.startPage || target.startPage || 1;
    endPage = def?.endPage || target.endPage || 21;
    targetCount = endPage - startPage + 1;
    // Count pages in target completed today
    currentCount = progress.completedPages.filter(p => p >= startPage && p <= endPage).length;
    unit = 'pages';
    formattedLabel = `${currentCount} / ${targetCount} pages`;
    title = `Juz ${juzNum} (${def?.name || `Juz' ${juzNum}`})`;
  } else if (mode === 'surah') {
    const surahNum = target.selectedSurah || 1;
    const meta = SURAH_METADATA_LIST.find(s => s.number === surahNum);
    const range = getSurahPageRange(surahNum);
    startPage = range.startPage;
    endPage = range.endPage;
    targetCount = endPage - startPage + 1;
    currentCount = progress.completedPages.filter(p => p >= startPage && p <= endPage).length;
    unit = 'pages';
    formattedLabel = `${currentCount} / ${targetCount} pages`;
    title = `Surah ${meta?.englishName || target.surahName || 'Surah'}`;
  } else if (mode === 'pages-range') {
    startPage = Math.max(1, Math.min(604, target.startPage || 1));
    endPage = Math.max(startPage, Math.min(604, target.endPage || startPage));
    targetCount = endPage - startPage + 1;
    currentCount = progress.completedPages.filter(p => p >= startPage && p <= endPage).length;
    unit = 'pages';
    formattedLabel = `${currentCount} / ${targetCount} pages`;
    title = target.title || `Pages ${startPage}–${endPage}`;
  } else if (mode === 'pages-count') {
    targetCount = Math.max(1, target.targetPagesCount || 5);
    currentCount = progress.completedPages.length;
    unit = 'pages';
    formattedLabel = `${currentCount} / ${targetCount} pages`;
    title = `Daily Goal: ${targetCount} Pages`;
  } else if (mode === 'blanks-count') {
    targetCount = Math.max(1, target.targetBlanksCount || 20);
    currentCount = progress.blanksCompletedToday;
    unit = 'blanks';
    formattedLabel = `${currentCount} / ${targetCount} blanks`;
    title = `Daily Goal: ${targetCount} Blanks`;
  }

  // Calculate percentage
  const percent = Math.min(100, Math.round((currentCount / Math.max(1, targetCount)) * 100));
  const isComplete = currentCount >= targetCount;

  // Spread check
  const activePages = [currentPageNumber];
  if (secondaryPageNumber) activePages.push(secondaryPageNumber);

  isOnTargetPage = mode === 'pages-count' || mode === 'blanks-count' 
    ? true 
    : activePages.some(p => p >= startPage && p <= endPage);

  if (mode === 'juz' || mode === 'surah' || mode === 'pages-range') {
    const pageOffset = Math.max(0, Math.min(targetCount - 1, currentPageNumber - startPage));
    relativePositionPercent = Math.round(((pageOffset + 1) / targetCount) * 100);

    if (secondaryPageNumber) {
      spreadPositionText = `Spread p. ${Math.min(currentPageNumber, secondaryPageNumber)}–${Math.max(currentPageNumber, secondaryPageNumber)} of ${startPage}–${endPage}`;
    } else {
      spreadPositionText = `Page ${currentPageNumber} of ${startPage}–${endPage}`;
    }
  } else {
    relativePositionPercent = percent;
    if (secondaryPageNumber) {
      spreadPositionText = `Spread p. ${Math.min(currentPageNumber, secondaryPageNumber)}–${Math.max(currentPageNumber, secondaryPageNumber)}`;
    } else {
      spreadPositionText = `Page ${currentPageNumber}`;
    }
  }

  return {
    percent,
    current: currentCount,
    target: targetCount,
    unit,
    formattedLabel,
    title,
    isComplete,
    spreadPositionText,
    relativePositionPercent,
    isOnTargetPage,
  };
}
