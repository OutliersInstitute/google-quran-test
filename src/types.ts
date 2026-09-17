export interface Ayah {
  number: number; // Global ayah number (1-6236)
  numberInSurah: number; // 1, 2, 3...
  surahNumber?: number;
  text: string; // Arabic Uthmani text
  translation: string; // English translation
  audio?: string; // URL to audio recitation
  juz: number;
  page?: number;
  hizbQuarter?: number;
  sajda?: boolean;
}

export interface Surah {
  number: number; // 1-114
  name: string; // Arabic name e.g. "سُورَةُ ٱلْفَاتِحَةِ"
  englishName: string; // "Al-Faatiha"
  englishNameTranslation: string; // "The Opening"
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface PageMetadata {
  pageNumber: number; // 1 - 604
  juzNumber: number; // 1 - 30
  hizbQuarter?: number;
  hizbString?: string; // e.g. "Juz' 12, ½ Hizb 24"
  surahNumber: number;
  surahNameArabic: string;
  surahEnglishName: string;
  ayahsCount: number;
}

export interface PageLineItem {
  type: 'word' | 'ayah-number' | 'blank-slot' | 'rub-el-hizb';
  text?: string;
  ayahNumberInSurah?: number;
  ayahIndexInPage?: number;
  wordIndexInAyah?: number;
  fullAyah?: Ayah;
  isBlank?: boolean;
  blankId?: string;
  blankIndex?: number;
  isActiveBlank?: boolean;
  isAnswered?: boolean;
  isCorrect?: boolean;
  isContinuation?: boolean;
  hiddenWordsCount?: number;
}

export interface PageFifteenLine {
  lineNumber: number; // 1 to 15
  type: 'verse-text' | 'surah-banner' | 'bismillah';
  surahData?: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  items?: PageLineItem[];
  rawText?: string;
}

export interface QuranPageData {
  pageNumber: number;
  juzNumber: number;
  hizbString: string;
  primarySurah: Surah;
  ayahs: Ayah[];
  baseLines?: PageFifteenLine[];
  lines: PageFifteenLine[];
}

export type ChallengeType = 'full-ayah' | 'portion-ayah' | 'next-ayah' | 'multi-blank';

export type DifficultyLevel = 'easy' | 'medium' | 'hafiz';

export type MushafTheme = 'parchment' | 'emerald' | 'midnight' | 'classic-white';

export type PageMarginPreset = 'compact' | 'standard' | 'spacious' | 'custom';

export interface PageMarginConfig {
  preset: PageMarginPreset;
  horizontalPadding: number; // in pixels, e.g. 12 to 48
  verticalPadding: number;   // in pixels, e.g. 6 to 24
}

export type PageRenderMode = 'authentic-image' | 'digital-text';

export type PageViewMode = 'single' | 'double';

export interface BlankTarget {
  id: string;
  blankIndex?: number; // 1, 2, 3...
  pageNumber?: number; // 1 - 604
  ayahIndex: number;
  ayahNumberInSurah: number;
  fullAyah: Ayah;
  hiddenType: 'full' | 'portion';
  portionSection?: 'start' | 'middle' | 'end';
  hiddenWordIndices?: number[]; // indices of words in the ayah that are hidden
  visiblePrefix?: string;
  hiddenText: string;
  visibleSuffix?: string;
  options: CarouselOption[];
  correctOptionId: string;
  userSelectedOptionId?: string;
  selectedOption?: CarouselOption;
  isAnswered?: boolean;
  isCorrect?: boolean;
}

export interface CarouselOption {
  id: string;
  text: string; // Arabic text to display on carousel card
  translation?: string;
  isCorrect: boolean;
  surahReference?: string; // e.g. "Ayah 4" or "Al-Baqarah: 12"
  explanation?: string;
  audio?: string;
}

export interface GameStats {
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  surahsPracticed: number[];
  pagesPracticed: number[];
  mistakeAyahs: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    text: string;
    translation: string;
  }[];
}

export interface PageRangeConfig {
  enabled: boolean;
  startPage: number;
  endPage: number;
  title?: string;
}

export interface RangeSessionStats {
  startPage: number;
  endPage: number;
  pagesCompleted: number[];
  totalBlanksInSession: number;
  correctBlanksInSession: number;
}
