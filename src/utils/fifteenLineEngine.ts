import { Ayah, BlankTarget, CarouselOption, ChallengeType, DifficultyLevel, PageFifteenLine, PageLineItem, Surah } from '../types';
import { SURAH_METADATA_LIST } from '../data/surahList';
import { toArabicDigits } from '../services/quranApi';

// Exact Medina 15-line templates for iconic pages
interface MedinaLineTemplate {
  lineNumber: number;
  type: 'verse-text' | 'surah-banner' | 'bismillah';
  surahData?: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  tokens: {
    type: 'word' | 'ayah-number' | 'rub-el-hizb';
    text: string;
    ayahNumberInSurah?: number;
    surahNumber?: number;
  }[];
}

const EXACT_MEDINA_PAGES: Record<number, MedinaLineTemplate[]> = {
  // Page 1 - Surah Al-Fatihah (7 Ayahs formatted cleanly in traditional 15-line grid)
  1: [
    {
      lineNumber: 1,
      type: 'surah-banner',
      surahData: {
        number: 1,
        name: 'سُورَةُ ٱلْفَاتِحَةِ',
        englishName: 'Al-Fātihah',
        revelationType: 'Meccan',
        numberOfAyahs: 7
      },
      tokens: []
    },
    {
      lineNumber: 2,
      type: 'bismillah',
      tokens: []
    },
    {
      lineNumber: 3,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'ٱلْحَمْدُ', ayahNumberInSurah: 2, surahNumber: 1 },
        { type: 'word', text: 'لِلَّهِ', ayahNumberInSurah: 2, surahNumber: 1 },
        { type: 'word', text: 'رَبِّ', ayahNumberInSurah: 2, surahNumber: 1 },
        { type: 'word', text: 'ٱلْعَٰلَمِينَ', ayahNumberInSurah: 2, surahNumber: 1 },
        { type: 'ayah-number', text: '٢', ayahNumberInSurah: 2, surahNumber: 1 }
      ]
    },
    {
      lineNumber: 4,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'ٱلرَّحْمَٰنِ', ayahNumberInSurah: 3, surahNumber: 1 },
        { type: 'word', text: 'ٱلرَّحِيمِ', ayahNumberInSurah: 3, surahNumber: 1 },
        { type: 'ayah-number', text: '٣', ayahNumberInSurah: 3, surahNumber: 1 }
      ]
    },
    {
      lineNumber: 5,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'مَٰلِكِ', ayahNumberInSurah: 4, surahNumber: 1 },
        { type: 'word', text: 'يَوْمِ', ayahNumberInSurah: 4, surahNumber: 1 },
        { type: 'word', text: 'ٱلدِّينِ', ayahNumberInSurah: 4, surahNumber: 1 },
        { type: 'ayah-number', text: '٤', ayahNumberInSurah: 4, surahNumber: 1 }
      ]
    },
    {
      lineNumber: 6,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'إِيَّاكَ', ayahNumberInSurah: 5, surahNumber: 1 },
        { type: 'word', text: 'نَعْبُدُ', ayahNumberInSurah: 5, surahNumber: 1 },
        { type: 'word', text: 'وَإِيَّاكَ', ayahNumberInSurah: 5, surahNumber: 1 },
        { type: 'word', text: 'نَسْتَعِينُ', ayahNumberInSurah: 5, surahNumber: 1 },
        { type: 'ayah-number', text: '٥', ayahNumberInSurah: 5, surahNumber: 1 }
      ]
    },
    {
      lineNumber: 7,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'ٱهْدِنَا', ayahNumberInSurah: 6, surahNumber: 1 },
        { type: 'word', text: 'ٱلصِّرَٰطَ', ayahNumberInSurah: 6, surahNumber: 1 },
        { type: 'word', text: 'ٱلْمُسْتَقِيمَ', ayahNumberInSurah: 6, surahNumber: 1 },
        { type: 'ayah-number', text: '٦', ayahNumberInSurah: 6, surahNumber: 1 }
      ]
    },
    {
      lineNumber: 8,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'صِرَٰطَ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'ٱلَّذِينَ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'أَنْعَمْتَ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'عَلَيْهِمْ', ayahNumberInSurah: 7, surahNumber: 1 }
      ]
    },
    {
      lineNumber: 9,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'غَيْرِ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'ٱلْمَغْضُوبِ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'عَلَيْهِمْ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'وَلَا', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'word', text: 'ٱلضَّآلِّينَ', ayahNumberInSurah: 7, surahNumber: 1 },
        { type: 'ayah-number', text: '٧', ayahNumberInSurah: 7, surahNumber: 1 }
      ]
    }
  ],

  // Page 236 - Surah Yusuf (Ayahs 5 to 14) - Exact match to Medina Mushaf
  236: [
    {
      lineNumber: 1,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'قَالَ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'يَبُنَىَّ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'لَا', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'تَقْصُصْ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'رُءْيَاكَ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'عَلَىٰٓ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'إِخْوَتِكَ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'فَيَكِيدُوا۟', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'لَكَ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'كَيْدًاۖ', ayahNumberInSurah: 5, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 2,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'إِنَّ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'ٱلشَّيْطَٰنَ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'لِلْإِنسَٰنِ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'عَدُوٌّ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'مُّبِينٌ', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'ayah-number', text: '٥', ayahNumberInSurah: 5, surahNumber: 12 },
        { type: 'word', text: 'وَكَذَٰلِكَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'يَجْتَبِيكَ', ayahNumberInSurah: 6, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 3,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'رَبُّكَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'وَيُعَلِّمُكَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'مِن', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'تَأْوِيلِ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'ٱلْأَحَادِيثِ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'وَيُتِمُّ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'نِعْمَتَهُۥ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'عَلَيْكَ', ayahNumberInSurah: 6, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 4,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'وَعَلَىٰٓ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'ءَالِ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'يَعْقُوبَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'كَمَآ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'أَتَمَّهَا', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'عَلَىٰٓ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'أَبَوَيْكَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'مِن', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'قَبْلُ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'إِبْرَٰهِيمَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'وَإِسْحَٰقَۚ', ayahNumberInSurah: 6, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 5,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'إِنَّ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'رَبَّكَ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'عَلِيمٌ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'حَكِيمٌ', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'ayah-number', text: '٦', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'rub-el-hizb', text: '۞', ayahNumberInSurah: 6, surahNumber: 12 },
        { type: 'word', text: 'لَّقَدْ', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'word', text: 'كَانَ', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'word', text: 'فِى', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'word', text: 'يُوسُفَ', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'word', text: 'وَإِخْوَتِهِۦٓ', ayahNumberInSurah: 7, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 6,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'ءَايَٰتٌ', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'word', text: 'لِّلسَّآئِلِينَ', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'ayah-number', text: '٧', ayahNumberInSurah: 7, surahNumber: 12 },
        { type: 'word', text: 'إِذْ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'قَالُوا۟', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'لَيُوسُفُ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'وَأَخُوهُ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'أَحَبُّ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'إِلَىٰٓ', ayahNumberInSurah: 8, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 7,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'أَبِينَا', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'مِنَّا', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'وَنَحْنُ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'عُصْبَةٌ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'إِنَّ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'أَبَانَا', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'لَفِى', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'ضَلَٰلٍ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'مُّبِينٍ', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'ayah-number', text: '٨', ayahNumberInSurah: 8, surahNumber: 12 },
        { type: 'word', text: 'ٱقْتُلُوا۟', ayahNumberInSurah: 9, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 8,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'يُوسُفَ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'أَوِ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'ٱطْرَحُوهُ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'أَرْضًا', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'يَخْلُ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'لَكُمْ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'وَجْهُ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'أَبِيكُمْ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'وَتَكُونُوا۟', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'مِنْ', ayahNumberInSurah: 9, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 9,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'بَعْدِهِۦ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'قَوْمًا', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'صَٰلِحِينَ', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'ayah-number', text: '٩', ayahNumberInSurah: 9, surahNumber: 12 },
        { type: 'word', text: 'قَالَ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'قَآئِلٌ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'مِّنْهُمْ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'لَا', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'تَقْتُلُوا۟', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'يُوسُفَ', ayahNumberInSurah: 10, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 10,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'وَأَلْقُوهُ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'فِى', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'غَيَٰبَتِ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'ٱلْجُبِّ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'يَلْتَقِطْهُ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'بَعْضُ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'ٱلسَّيَّارَةِ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'إِن', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'كُنتُمْ', ayahNumberInSurah: 10, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 11,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'فَٰعِلِينَ', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'ayah-number', text: '١٠', ayahNumberInSurah: 10, surahNumber: 12 },
        { type: 'word', text: 'قَالُوا۟', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'يَٰٓأَبَانَا', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'مَالَكَ', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'لَا', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'تَأْمَ۫نَّا', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'عَلَىٰ', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'يُوسُفَ', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'وَإِنَّا', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'لَهُۥ', ayahNumberInSurah: 11, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 12,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'لَنَٰصِحُونَ', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'ayah-number', text: '١١', ayahNumberInSurah: 11, surahNumber: 12 },
        { type: 'word', text: 'أَرْسِلْهُ', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'مَعَنَا', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'غَدًا', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'يَرْتَعْ', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'وَيَلْعَبْ', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'وَإِنَّا', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'لَهُۥ', ayahNumberInSurah: 12, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 13,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'لَحَٰفِظُونَ', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'ayah-number', text: '١٢', ayahNumberInSurah: 12, surahNumber: 12 },
        { type: 'word', text: 'قَالَ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'إِنِّى', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'لَيَحْزُنُنِىٓ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'أَن', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'تَذْهَبُوا۟', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'بِهِۦ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'وَأَخَافُ', ayahNumberInSurah: 13, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 14,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'أَن', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'يَأْكُلَهُ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'ٱلذِّئْبُ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'وَأَنتُمْ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'عَنْهُ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'غَٰفِلُونَ', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'ayah-number', text: '١٣', ayahNumberInSurah: 13, surahNumber: 12 },
        { type: 'word', text: 'قَالُوا۟', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'لَئِنْ', ayahNumberInSurah: 14, surahNumber: 12 },
      ]
    },
    {
      lineNumber: 15,
      type: 'verse-text',
      tokens: [
        { type: 'word', text: 'أَكَلَهُ', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'ٱلذِّئْبُ', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'وَنَحْنُ', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'عُصْبَةٌ', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'إِنَّآ', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'إِذًا', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'word', text: 'لَّخَٰسِرُونَ', ayahNumberInSurah: 14, surahNumber: 12 },
        { type: 'ayah-number', text: '١٤', ayahNumberInSurah: 14, surahNumber: 12 },
      ]
    },
  ]
};

/**
 * 1. Generates baseline 15 lines for the page without blanks.
 * Line boundaries are canonical and never change based on blank state.
 */
export function getBaseFifteenLines(
  pageNumber: number,
  ayahs: Ayah[],
  primarySurah: Surah
): PageFifteenLine[] {
  // If exact template exists for this page
  if (EXACT_MEDINA_PAGES[pageNumber]) {
    const template = EXACT_MEDINA_PAGES[pageNumber];
    return template.map(line => {
      if (line.type === 'surah-banner') {
        return {
          lineNumber: line.lineNumber,
          type: 'surah-banner',
          surahData: line.surahData
        };
      }
      if (line.type === 'bismillah') {
        return {
          lineNumber: line.lineNumber,
          type: 'bismillah',
          rawText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
        };
      }

      const wordCounterMap = new Map<number, number>();

      const items: PageLineItem[] = line.tokens.map(t => {
        let wordIndexInAyah: number | undefined;
        if (t.type === 'word' && t.ayahNumberInSurah) {
          const currentCount = wordCounterMap.get(t.ayahNumberInSurah) || 0;
          wordIndexInAyah = currentCount;
          wordCounterMap.set(t.ayahNumberInSurah, currentCount + 1);
        }

        return {
          type: t.type === 'ayah-number' ? 'ayah-number' : t.type === 'rub-el-hizb' ? 'rub-el-hizb' : 'word',
          text: t.text,
          ayahNumberInSurah: t.ayahNumberInSurah,
          wordIndexInAyah,
          fullAyah: ayahs.find(a => a.numberInSurah === t.ayahNumberInSurah)
        };
      });

      return {
        lineNumber: line.lineNumber,
        type: 'verse-text',
        items
      };
    });
  }

  // Dynamic 15-line segmentation for any page (1 to 604)
  const lines: PageFifteenLine[] = [];
  if (!ayahs || ayahs.length === 0) {
    for (let i = 1; i <= 15; i++) {
      lines.push({ lineNumber: i, type: 'verse-text', items: [] });
    }
    return lines;
  }

  // 1. Detect if any surah begins on this page (ayah 1)
  const surahsStartingOnPage: { surahNum: number; ayahIndex: number }[] = [];
  ayahs.forEach((ayah, idx) => {
    if (ayah.numberInSurah === 1) {
      const sNum = ayah.surahNumber || primarySurah.number;
      surahsStartingOnPage.push({ surahNum: sNum, ayahIndex: idx });
    }
  });

  // Calculate header lines count
  let headerLinesCount = 0;
  surahsStartingOnPage.forEach(s => {
    headerLinesCount += (s.surahNum === 9 ? 1 : 2); // 1 banner + 1 bismillah (except At-Tawbah)
  });

  const targetVerseLinesCount = Math.max(1, 15 - headerLinesCount);

  if (surahsStartingOnPage.length > 0) {
    const sStart = surahsStartingOnPage[0];
    const prevAyahs = ayahs.slice(0, sStart.ayahIndex);
    const newAyahs = ayahs.slice(sStart.ayahIndex);

    const sMeta = SURAH_METADATA_LIST.find(s => s.number === sStart.surahNum) || {
      number: sStart.surahNum,
      name: primarySurah.name,
      englishName: primarySurah.englishName,
      revelationType: primarySurah.revelationType,
      numberOfAyahs: primarySurah.numberOfAyahs
    };

    let prevLinesCount = 0;
    let newLinesCount = targetVerseLinesCount;

    if (prevAyahs.length > 0) {
      const prevWordCount = prevAyahs.reduce((sum, a) => sum + a.text.split(/\s+/).length, 0);
      const newWordCount = newAyahs.reduce((sum, a) => sum + a.text.split(/\s+/).length, 0);
      const totalWords = prevWordCount + newWordCount || 1;
      prevLinesCount = Math.max(1, Math.round((prevWordCount / totalWords) * targetVerseLinesCount));
      newLinesCount = Math.max(1, targetVerseLinesCount - prevLinesCount);
    }

    let lineCounter = 1;

    // 1. Lines before new surah
    if (prevAyahs.length > 0) {
      const prevLines = segmentAyahsIntoLines(prevAyahs, prevLinesCount, lineCounter);
      lines.push(...prevLines);
      lineCounter += prevLines.length;
    }

    // 2. Surah Banner Line
    lines.push({
      lineNumber: lineCounter++,
      type: 'surah-banner',
      surahData: {
        number: sMeta.number,
        name: sMeta.name,
        englishName: sMeta.englishName,
        revelationType: sMeta.revelationType,
        numberOfAyahs: sMeta.numberOfAyahs
      }
    });

    // 3. Bismillah Line (except Surah 9 At-Tawbah)
    if (sMeta.number !== 9) {
      lines.push({
        lineNumber: lineCounter++,
        type: 'bismillah',
        rawText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
      });
    }

    // 4. Lines of new surah
    const newLines = segmentAyahsIntoLines(newAyahs, newLinesCount, lineCounter);
    lines.push(...newLines);
  } else {
    // Normal 15-line verse page
    const verseLines = segmentAyahsIntoLines(ayahs, 15, 1);
    lines.push(...verseLines);
  }

  // Ensure exactly 15 lines
  while (lines.length < 15) {
    lines.push({
      lineNumber: lines.length + 1,
      type: 'verse-text',
      items: []
    });
  }

  return lines.slice(0, 15).map((l, idx) => ({ ...l, lineNumber: idx + 1 }));
}

/**
 * Segments an array of Ayahs into N balanced lines without dropping or scrambling words.
 */
function segmentAyahsIntoLines(
  ayahs: Ayah[],
  numLines: number,
  startLineNum: number
): PageFifteenLine[] {
  // Convert ayahs to word tokens and ayah markers
  const tokens: PageLineItem[] = [];

  ayahs.forEach(ayah => {
    const rawWords = ayah.text.trim().split(/\s+/).filter(Boolean);
    let wordIdxCounter = 0;
    rawWords.forEach((w) => {
      if (w === '۞') {
        tokens.push({
          type: 'rub-el-hizb',
          text: '۞',
          ayahNumberInSurah: ayah.numberInSurah,
          fullAyah: ayah
        });
      } else {
        tokens.push({
          type: 'word',
          text: w,
          ayahNumberInSurah: ayah.numberInSurah,
          wordIndexInAyah: wordIdxCounter++,
          fullAyah: ayah
        });
      }
    });

    // Ayah end marker
    tokens.push({
      type: 'ayah-number',
      text: toArabicDigits(ayah.numberInSurah),
      ayahNumberInSurah: ayah.numberInSurah,
      fullAyah: ayah
    });
  });

  if (tokens.length === 0 || numLines <= 0) {
    return [];
  }

  // Weight each token for optimal visual balance
  const weights = tokens.map(t => {
    if (t.type === 'word') return Math.max(3, (t.text || '').length);
    if (t.type === 'ayah-number') return 4;
    return 3;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const targetPerLine = totalWeight / numLines;

  const lines: PageFifteenLine[] = [];
  let currentLineTokens: PageLineItem[] = [];
  let currentWeight = 0;
  let linesRemaining = numLines;
  let tokenIdx = 0;

  while (tokenIdx < tokens.length) {
    const tokensLeft = tokens.length - tokenIdx;

    if (tokensLeft <= linesRemaining) {
      if (currentLineTokens.length > 0) {
        lines.push({
          lineNumber: startLineNum + lines.length,
          type: 'verse-text',
          items: currentLineTokens
        });
        currentLineTokens = [];
        currentWeight = 0;
        linesRemaining--;
      }
      lines.push({
        lineNumber: startLineNum + lines.length,
        type: 'verse-text',
        items: [tokens[tokenIdx]]
      });
      linesRemaining--;
      tokenIdx++;
      continue;
    }

    if (linesRemaining === 1) {
      currentLineTokens.push(...tokens.slice(tokenIdx));
      lines.push({
        lineNumber: startLineNum + lines.length,
        type: 'verse-text',
        items: currentLineTokens
      });
      currentLineTokens = [];
      linesRemaining--;
      break;
    }

    const t = tokens[tokenIdx];
    const w = weights[tokenIdx];
    const withTokenWeight = currentWeight + w;
    const diffWithout = Math.abs(currentWeight - targetPerLine);
    const diffWith = Math.abs(withTokenWeight - targetPerLine);

    if (currentLineTokens.length > 0 && withTokenWeight > targetPerLine && diffWith >= diffWithout) {
      lines.push({
        lineNumber: startLineNum + lines.length,
        type: 'verse-text',
        items: currentLineTokens
      });
      currentLineTokens = [t];
      currentWeight = w;
      linesRemaining--;
      tokenIdx++;
    } else {
      currentLineTokens.push(t);
      currentWeight += w;
      tokenIdx++;
    }
  }

  if (currentLineTokens.length > 0 && lines.length < numLines) {
    lines.push({
      lineNumber: startLineNum + lines.length,
      type: 'verse-text',
      items: currentLineTokens
    });
  }

  while (lines.length < numLines) {
    lines.push({
      lineNumber: startLineNum + lines.length,
      type: 'verse-text',
      items: []
    });
  }

  return lines;
}

/**
 * 2. Applies Blanks onto the baseline lines WITHOUT shifting or scattering line words.
 * Groups consecutive hidden words on each line into a seamless inline blank slot.
 */
export function formatPageIntoFifteenLines(
  pageNumber: number,
  ayahs: Ayah[],
  primarySurah: Surah,
  blankTargets: BlankTarget[] | BlankTarget | null = null,
  activeBlankId: string | null = null,
  providedBaseLines?: PageFifteenLine[]
): PageFifteenLine[] {
  const blanks: BlankTarget[] = Array.isArray(blankTargets)
    ? blankTargets
    : blankTargets
    ? [blankTargets]
    : [];

  const baseLines = (providedBaseLines && providedBaseLines.length === 15)
    ? providedBaseLines
    : getBaseFifteenLines(pageNumber, ayahs, primarySurah);

  if (blanks.length === 0) {
    return baseLines;
  }

  // Track which blank IDs have already started on a previous line
  const startedBlankIds = new Set<string>();

  return baseLines.map(line => {
    if (line.type !== 'verse-text' || !line.items || line.items.length === 0) {
      return line;
    }

    const transformedItems: PageLineItem[] = [];
    let pendingBlankWords: string[] = [];
    let currentBlankMeta: BlankTarget | null = null;
    let isContinuationOnThisLine = false;

    const flushPendingBlank = () => {
      if (pendingBlankWords.length > 0 && currentBlankMeta) {
        transformedItems.push({
          type: 'blank-slot',
          isBlank: true,
          blankId: currentBlankMeta.id,
          blankIndex: currentBlankMeta.blankIndex,
          isActiveBlank: currentBlankMeta.id === activeBlankId,
          isAnswered: !!currentBlankMeta.isAnswered,
          isCorrect: !!currentBlankMeta.isCorrect,
          text: pendingBlankWords.join(' '),
          ayahNumberInSurah: currentBlankMeta.ayahNumberInSurah,
          fullAyah: currentBlankMeta.fullAyah,
          isContinuation: isContinuationOnThisLine,
          hiddenWordsCount: pendingBlankWords.length
        });
        startedBlankIds.add(currentBlankMeta.id);
        pendingBlankWords = [];
        currentBlankMeta = null;
      }
    };

    line.items.forEach(item => {
      if (item.type === 'ayah-number' || item.type === 'rub-el-hizb') {
        flushPendingBlank();
        transformedItems.push(item);
        return;
      }

      if (item.type === 'word' && item.ayahNumberInSurah) {
        const matchedBlank = blanks.find(
          b => b.ayahNumberInSurah === item.ayahNumberInSurah &&
            (b.fullAyah.surahNumber === undefined || item.fullAyah?.surahNumber === undefined || b.fullAyah.surahNumber === item.fullAyah.surahNumber)
        );

        if (!matchedBlank) {
          flushPendingBlank();
          transformedItems.push(item);
          return;
        }

        // Check if portion challenge and this word is part of visible prefix or suffix
        if (matchedBlank.hiddenType === 'portion') {
          if (matchedBlank.hiddenWordIndices && matchedBlank.hiddenWordIndices.length > 0) {
            const isHidden = item.wordIndexInAyah !== undefined && matchedBlank.hiddenWordIndices.includes(item.wordIndexInAyah);
            if (!isHidden) {
              flushPendingBlank();
              transformedItems.push(item);
              return;
            }
          } else {
            const visiblePrefixWords = (matchedBlank.visiblePrefix || '').trim().split(/\s+/).filter(Boolean);
            const visibleSuffixWords = (matchedBlank.visibleSuffix || '').trim().split(/\s+/).filter(Boolean);
            const wordText = item.text || '';

            if (visiblePrefixWords.includes(wordText) || visibleSuffixWords.includes(wordText)) {
              flushPendingBlank();
              transformedItems.push(item);
              return;
            }
          }
        }

        // Word is hidden as part of this blank target
        if (currentBlankMeta && currentBlankMeta.id !== matchedBlank.id) {
          flushPendingBlank();
        }

        if (!currentBlankMeta) {
          currentBlankMeta = matchedBlank;
          isContinuationOnThisLine = startedBlankIds.has(matchedBlank.id);
        }

        pendingBlankWords.push(item.text || '');
      }
    });

    flushPendingBlank();

    return {
      ...line,
      items: transformedItems
    };
  });
}

/**
 * Advanced Mutashabihat and Tricky Quranic Distractors Generator
 */
interface TrickyCandidate {
  text: string;
  explanation?: string;
}

const ATTRIBUTE_MUTASHABIHAT_RULES: { pattern: RegExp; replacements: string[]; explanation: string }[] = [
  // Asma wa Sifat (Divine Names & Attributes)
  {
    pattern: /عَلِيمًا حَكِيمًا/g,
    replacements: ['غَفُورًا رَّحِيمًا', 'عَزِيزًا حَكِيمًا', 'سَمِيعًا بَصِيرًا', 'تَوَّابًا رَّحِيمًا', 'عَلِيمٌ حَكِيمٌ'],
    explanation: 'Mutashabih on Divine Attribute pairing (عَلِيمًا حَكِيمًا)'
  },
  {
    pattern: /عَلِيمٌ حَكِيمٌ/g,
    replacements: ['غَفُورٌ رَّحِيمٌ', 'عَزِيزٌ حَكِيمٌ', 'عَلِيمٌ خَبِيرٌ', 'وَاسِعٌ عَلِيمٌ', 'سَمِيعٌ عَلِيمٌ'],
    explanation: 'Mutashabih on Divine Attribute (عَلِيمٌ حَكِيمٌ)'
  },
  {
    pattern: /غَفُورٌ رَّحِيمٌ/g,
    replacements: ['عَلِيمٌ حَكِيمٌ', 'تَوَّابٌ رَّحِيمٌ', 'عَفُوٌّ غَفُورٌ', 'غَفُورًا رَّحِيمًا', 'شَكُورٌ حَلِيمٌ'],
    explanation: 'Mutashabih on (غَفُورٌ رَّحِيمٌ)'
  },
  {
    pattern: /غَفُورًا رَّحِيمًا/g,
    replacements: ['عَلِيمًا حَكِيمًا', 'تَوَّابًا رَّحِيمًا', 'عَفُوًّا غَفُورًا', 'رَّحِيمًا غَفُورًا'],
    explanation: 'Mutashabih on accusative ending (غَفُورًا رَّحِيمًا)'
  },
  {
    pattern: /عَزِيزٌ حَكِيمٌ/g,
    replacements: ['عَلِيمٌ حَكِيمٌ', 'غَفُورٌ رَّحِيمٌ', 'عَزِيزٌ غَفُورٌ', 'عَزِيزًا حَكِيمًا'],
    explanation: 'Mutashabih on (عَزِيزٌ حَكِيمٌ)'
  },
  {
    pattern: /عَزِيزًا حَكِيمًا/g,
    replacements: ['عَلِيمًا حَكِيمًا', 'غَفُورًا رَّحِيمًا', 'قَدِيرًا عَلِيمًا'],
    explanation: 'Mutashabih on (عَزِيزًا حَكِيمًا)'
  },
  {
    pattern: /سَمِيعٌ بَصِيرٌ/g,
    replacements: ['سَمِيعٌ عَلِيمٌ', 'خَبِيرٌ بَصِيرٌ', 'عَلِيمٌ حَكِيمٌ', 'سَمِيعًا بَصِيرًا'],
    explanation: 'Mutashabih on (سَمِيعٌ بَصِيرٌ)'
  },
  {
    pattern: /سَمِيعًا بَصِيرًا/g,
    replacements: ['عَلِيمًا حَكِيمًا', 'غَفُورًا رَّحِيمًا', 'سَمِيعًا عَلِيمًا'],
    explanation: 'Mutashabih on (سَمِيعًا بَصِيرًا)'
  },
  {
    pattern: /سَمِيعٌ عَلِيمٌ/g,
    replacements: ['عَلِيمٌ حَكِيمٌ', 'سَمِيعٌ بَصِيرٌ', 'وَاسِعٌ عَلِيمٌ', 'غَفُورٌ رَّحِيمٌ'],
    explanation: 'Mutashabih on (سَمِيعٌ عَلِيمٌ)'
  },
  {
    pattern: /وَاسِعٌ عَلِيمٌ/g,
    replacements: ['عَلِيمٌ حَكِيمٌ', 'غَفُورٌ رَّحِيمٌ', 'سَمِيعٌ عَلِيمٌ'],
    explanation: 'Mutashabih on (وَاسِعٌ عَلِيمٌ)'
  },
  {
    pattern: /لَطِيفٌ خَبِيرٌ/g,
    replacements: ['خَبِيرٌ بَصِيرٌ', 'عَلِيمٌ خَبِيرٌ', 'غَفُورٌ رَّحِيمٌ'],
    explanation: 'Mutashabih on (لَطِيفٌ خَبِيرٌ)'
  },

  // Action / Inversion Endings
  {
    pattern: /بِمَا تَعْمَلُونَ خَبِيرٌ/g,
    replacements: ['خَبِيرٌۢ بِمَا تَعْمَلُونَ', 'بِمَا تَعْمَلُونَ بَصِيرٌ', 'بِمَا يَعْمَلُونَ خَبِيرٌ', 'بِمَا كَانُوا۟ يَعْمَلُونَ'],
    explanation: 'Tricky Mutashabih: Word order of (بِمَا تَعْمَلُونَ خَبِيرٌ vs خَبِيرٌۢ بِمَا تَعْمَلُونَ)'
  },
  {
    pattern: /خَبِيرٌۢ بِمَا تَعْمَلُونَ|خَبِيرٌ بِمَا تَعْمَلُونَ/g,
    replacements: ['بِمَا تَعْمَلُونَ خَبِيرٌ', 'بَصِيرٌۢ بِمَا تَعْمَلُونَ', 'خَبِيرٌۢ بِمَا يَعْمَلُونَ'],
    explanation: 'Tricky Mutashabih: Inverted attribute order (خَبِيرٌۢ بِمَا تَعْمَلُونَ)'
  },
  {
    pattern: /بِمَا تَعْمَلُونَ بَصِيرٌ/g,
    replacements: ['بَصِيرٌۢ بِمَا تَعْمَلُونَ', 'بِمَا تَعْمَلُونَ خَبِيرٌ', 'بِمَا يَعْمَلُونَ بَصِيرٌ'],
    explanation: 'Tricky Mutashabih: (بِمَا تَعْمَلُونَ بَصِيرٌ)'
  },
  {
    pattern: /بَصِيرٌۢ بِمَا تَعْمَلُونَ|بَصِيرٌ بِمَا تَعْمَلُونَ/g,
    replacements: ['بِمَا تَعْمَلُونَ بَصِيرٌ', 'بَصِيرٌۢ بِمَا يَعْمَلُونَ', 'خَبِيرٌۢ بِمَا تَعْمَلُونَ'],
    explanation: 'Tricky Mutashabih: (بَصِيرٌۢ بِمَا تَعْمَلُونَ)'
  },

  // Closing Purpose Formulas
  {
    pattern: /لَعَلَّكُمْ تَعْقِلُونَ/g,
    replacements: ['لَعَلَّكُمْ تَشْكُرُونَ', 'لَعَلَّكُمْ تَتَّقُونَ', 'لَعَلَّكُمْ تَهْتَدُونَ', 'أَفَلَا تَعْقِلُونَ', 'لَعَلَّهُمْ يَعْقِلُونَ'],
    explanation: 'Verse Closing Mutashabih: (لَعَلَّكُمْ تَعْقِلُونَ vs تَشْكُرُونَ/تَتَّقُونَ)'
  },
  {
    pattern: /لَعَلَّكُمْ تَشْكُرُونَ/g,
    replacements: ['لَعَلَّكُمْ تَعْقِلُونَ', 'لَعَلَّكُمْ تَتَّقُونَ', 'لَعَلَّكُمْ تُفْلِحُونَ', 'لَعَلَّهُمْ يَشْكُرُونَ'],
    explanation: 'Verse Closing Mutashabih: (لَعَلَّكُمْ تَشْكُرُونَ vs تَعْقِلُونَ)'
  },
  {
    pattern: /لَعَلَّكُمْ تَتَّقُونَ/g,
    replacements: ['لَعَلَّكُمْ تُفْلِحُونَ', 'لَعَلَّكُمْ تَعْقِلُونَ', 'لَعَلَّكُمْ تَشْكُرُونَ', 'لَعَلَّكُمْ تُرْحَمُونَ'],
    explanation: 'Verse Closing Mutashabih: (لَعَلَّكُمْ تَتَّقُونَ vs تُفْلِحُونَ)'
  },
  {
    pattern: /أَفَلَا تَعْقِلُونَ/g,
    replacements: ['أَفَلَا تَتَذَكَّرُونَ', 'أَفَلَا تُبْصِرُونَ', 'أَفَلَا تَسْمَعُونَ', 'لَعَلَّكُمْ تَعْقِلُونَ'],
    explanation: 'Rhetorical Closing Mutashabih: (أَفَلَا تَعْقِلُونَ vs أَفَلَا تَتَذَكَّرُونَ)'
  },
  {
    pattern: /أَفَلَا تَتَذَكَّرُونَ/g,
    replacements: ['أَفَلَا تَعْقِلُونَ', 'أَفَلَا تُبْصِرُونَ', 'قَلِيلًا مَّا تَذَكَّرُونَ'],
    explanation: 'Rhetorical Closing Mutashabih: (أَفَلَا تَتَذَكَّرُونَ)'
  },

  // Clauses: لقوم يعلمون / يتفكرون / يؤمنون
  {
    pattern: /لِّقَوْمٍ يَعْلَمُونَ/g,
    replacements: ['لِّقَوْمٍ يَتَفَكَّرُونَ', 'لِّقَوْمٍ يُؤْمِنُونَ', 'لِّقَوْمٍ يَسْمَعُونَ', 'لِّقَوْمٍ يَعْقِلُونَ'],
    explanation: 'Mutashabih Clause: (لِّقَوْمٍ يَعْلَمُونَ vs other verbs)'
  },
  {
    pattern: /لِّقَوْمٍ يَتَفَكَّرُونَ/g,
    replacements: ['لِّقَوْمٍ يَعْقِلُونَ', 'لِّقَوْمٍ يُؤْمِنُونَ', 'لِّقَوْمٍ يَسْمَعُونَ', 'لِّقَوْمٍ يَشْكُرُونَ'],
    explanation: 'Mutashabih Clause: (لِّقَوْمٍ يَتَفَكَّرُونَ)'
  },
  {
    pattern: /لِّقَوْمٍ يُؤْمِنُونَ/g,
    replacements: ['لِّقَوْمٍ يَعْلَمُونَ', 'لِّقَوْمٍ يَتَفَكَّرُونَ', 'لِّلْمُؤْمِنِينَ', 'لِّقَوْمٍ يُوقِنُونَ'],
    explanation: 'Mutashabih Clause: (لِّقَوْمٍ يُؤْمِنُونَ)'
  },

  // خالدين فيها
  {
    pattern: /خَٰلِدِينَ فِيهَآ أَبَدًا|خَالِدِينَ فِيهَآ أَبَدًا/g,
    replacements: ['خَٰلِدِينَ فِيهَا', 'هُمْ فِيهَا خَٰلِدُونَ', 'فِيهَا خَٰلِدُونَ'],
    explanation: 'Eternity Formula Mutashabih: Notice the presence of (أَبَدًا)'
  },
  {
    pattern: /خَٰلِدِينَ فِيهَا|خَالِدِينَ فِيهَا/g,
    replacements: ['خَٰلِدِينَ فِيهَآ أَبَدًا', 'هُمْ فِيهَا خَٰلِدُونَ', 'فِيهَا خَالِدُونَ'],
    explanation: 'Eternity Formula Mutashabih: Notice the absence of (أَبَدًا)'
  },
  {
    pattern: /هُمْ فِيهَا خَٰلِدُونَ|هُمْ فِيهَا خَالِدُونَ/g,
    replacements: ['خَٰلِدِينَ فِيهَا', 'خَٰلِدِينَ فِيهَآ أَبَدًا', 'فِيهَا خَٰلِدُونَ'],
    explanation: 'Pronoun Inversion: (هُمْ فِيهَا خَٰلِدُونَ)'
  },

  // الفوز العظيم
  {
    pattern: /ذَٰلِكَ هُوَ ٱلْفَوْزُ ٱلْعَظِيمُ/g,
    replacements: ['وَذَٰلِكَ ٱلْفَوْزُ ٱلْعَظِيمُ', 'ذَٰلِكَ ٱلْفَوْزُ ٱلْعَظِيمُ', 'ذَٰلِكَ ٱلْفَوْزُ ٱلْمُبِينُ', 'ذَٰلِكَ ٱلْفَوْزُ ٱلْكَبِيرُ'],
    explanation: 'Fawz Formula Mutashabih: (ذَٰلِكَ هُوَ ٱلْفَوْزُ ٱلْعَظِيمُ)'
  },
  {
    pattern: /وَذَٰلِكَ ٱلْفَوْزُ ٱلْعَظِيمُ/g,
    replacements: ['ذَٰلِكَ هُوَ ٱلْفَوْزُ ٱلْعَظِيمُ', 'ذَٰلِكَ ٱلْفَوْزُ ٱلْعَظِيمُ'],
    explanation: 'Fawz Formula: Initial Waw vs no Waw (وَذَٰلِكَ)'
  },

  // عذاب أليم
  {
    pattern: /عَذَابٌ أَلِيمٌ/g,
    replacements: ['عَذَابٌ عَظِيمٌ', 'عَذَابٌ مُّهِينٌ', 'عَذَابًا أَلِيمًا', 'عَذَابَ يَوْمٍ أَلِيمٍ', 'عَذَابٌ شَدِيدٌ'],
    explanation: 'Punishment Description Mutashabih: (عَذَابٌ أَلِيمٌ vs عَظِيمٌ/مُّهِينٌ)'
  },
  {
    pattern: /عَذَابٌ عَظِيمٌ/g,
    replacements: ['عَذَابٌ أَلِيمٌ', 'عَذَابٌ مُّهِينٌ', 'عَذَابًا عَظِيمًا', 'عَذَابٌ شَدِيدٌ'],
    explanation: 'Punishment Description: (عَذَابٌ عَظِيمٌ)'
  },
  {
    pattern: /عَذَابًا أَلِيمًا/g,
    replacements: ['عَذَابًا عَظِيمًا', 'عَذَابًا مُّهِينًا', 'عَذَابٌ أَلِيمٌ', 'عَذَابًا شَدِيدًا'],
    explanation: 'Grammatical Case: Accusative tanween (عَذَابًا أَلِيمًا)'
  },

  // تجري من تحتها الأنهار
  {
    pattern: /تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ/g,
    replacements: ['تَجْرِى تَحْتَهَا ٱلْأَنْهَٰرُ', 'جَنَّٰتٍ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ', 'تَجْرِى مِن تَحْتِهِمُ ٱلْأَنْهَٰرُ'],
    explanation: 'Classic Hafiz Mutashabih: (مِن تَحْتِهَا vs تَحْتَهَا)'
  },
  {
    pattern: /تَجْرِى تَحْتَهَا ٱلْأَنْهَٰرُ/g,
    replacements: ['تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ', 'تَجْرِى مِن تَحْتِهِمُ ٱلْأَنْهَٰرُ'],
    explanation: 'Classic Hafiz Mutashabih: (تَحْتَهَا without مِن - At-Tawbah 100)'
  },

  // ولا هم يحزنون
  {
    pattern: /وَلَا هُمْ يَحْزَنُونَ/g,
    replacements: ['وَلَا هُمْ يُنصَرُونَ', 'وَلَا هُمْ يُظْلَمُونَ', 'وَلَا هُمْ يُنظَرُونَ'],
    explanation: 'Negation Ending: (يَحْزَنُونَ vs other verbs)'
  },

  // إن كنتم صادقين / مؤمنين
  {
    pattern: /إِن كُنتُمْ صَٰدِقِينَ|إِن كُنتُمْ صَادِقِينَ/g,
    replacements: ['إِن كُنتُم مُّؤْمِنِينَ', 'إِن كُنتُمْ تَعْلَمُونَ', 'إِن كُنتُمْ فَٰعِلِينَ'],
    explanation: 'Conditional Ending: (صَٰدِقِينَ vs مُّؤْمِنِينَ)'
  },
  {
    pattern: /إِن كُنتُم مُّؤْمِنِينَ|إِن كُنتُم مُّؤْمِنِين/g,
    replacements: ['إِن كُنتُمْ صَٰدِقِينَ', 'إِن كُنتُمْ تَعْلَمُونَ', 'إِن كُنتُمْ مُتَّقِينَ'],
    explanation: 'Conditional Ending: (مُّؤْمِنِينَ vs صَٰدِقِينَ)'
  },

  // من دون الله
  {
    pattern: /مِن دُونِ ٱللَّهِ/g,
    replacements: ['مِن دُونِهِۦ', 'مِن دُونِ ٱلرَّحْمَٰنِ', 'مِن دُونِهِمَا'],
    explanation: 'Preposition Mutashabih: (مِن دُونِ ٱللَّهِ vs مِن دُونِهِۦ)'
  },
  {
    pattern: /مِن دُونِهِۦ/g,
    replacements: ['مِن دُونِ ٱللَّهِ', 'مِن دُونِ ٱلرَّحْمَٰنِ'],
    explanation: 'Preposition Mutashabih: (مِن دُونِهِۦ vs مِن دُونِ ٱللَّهِ)'
  },

  // في السماوات والأرض
  {
    pattern: /فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ|فِى ٱلسَّمَاوَاتِ وَٱلْأَرْضِ/g,
    replacements: ['فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ', 'مَا فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ'],
    explanation: 'Cosmic Formula: (فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ vs presence of وَمَا)'
  },
  {
    pattern: /فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ/g,
    replacements: ['فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ', 'مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ'],
    explanation: 'Cosmic Formula: (presence of وَمَا فِى ٱلْأَرْضِ)'
  },

  // إلى صراط مستقيم
  {
    pattern: /إِلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ/g,
    replacements: ['صِرَٰطٍ مُّسْتَقِيمٍ', 'عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ', 'إِلَىٰ صِرَٰطِ ٱلْعَزِيزِ ٱلْحَمِيدِ'],
    explanation: 'Path Preposition: (إِلَىٰ vs عَلَىٰ vs direct noun)'
  },
  {
    pattern: /عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ/g,
    replacements: ['إِلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ', 'صِرَٰطٍ مُّسْتَقِيمٍ'],
    explanation: 'Path Preposition: (عَلَىٰ vs إِلَىٰ)'
  },
];

/**
 * Generates ultra-close, tricky Mutashabihat and distractors for Hafiz and Medium difficulties
 */
function generateTrickyDistractors(
  hiddenText: string,
  targetAyah: Ayah,
  pageAyahs: Ayah[],
  primarySurah: Surah,
  difficulty: DifficultyLevel,
  portionSection?: 'start' | 'middle' | 'end',
  targetCount: number = 3
): TrickyCandidate[] {
  const results: TrickyCandidate[] = [];
  const addedTexts = new Set<string>([hiddenText.trim()]);

  const addCandidate = (candText: string, explanation: string) => {
    const clean = candText.trim();
    if (clean && clean !== hiddenText.trim() && !addedTexts.has(clean)) {
      addedTexts.add(clean);
      results.push({ text: clean, explanation });
    }
  };

  // 1. Check known Mutashabihat replacement rules
  for (const rule of ATTRIBUTE_MUTASHABIHAT_RULES) {
    if (rule.pattern.test(hiddenText)) {
      rule.pattern.lastIndex = 0; // reset regex index
      for (const rep of rule.replacements) {
        const variant = hiddenText.replace(rule.pattern, rep);
        addCandidate(variant, rule.explanation);
        if (results.length >= targetCount + 2) break;
      }
    }
    if (results.length >= targetCount + 2) break;
  }

  // 2. Starting Particle Mutashabihat (Waw vs Fa vs None)
  const words = hiddenText.trim().split(/\s+/).filter(Boolean);
  if (words.length > 0) {
    const firstWord = words[0];

    // Starts with Waw: وَ...
    if (firstWord.startsWith('وَ') && firstWord.length > 2) {
      const strippedFirst = firstWord.substring(1);
      const faFirst = 'فَ' + strippedFirst;
      const thummaFirst = 'ثُمَّ ' + strippedFirst;

      addCandidate([strippedFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Watch out for initial Waw (وَ) particle');
      addCandidate([faFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Watch out for Fa (فَ) vs Waw (وَ)');
      addCandidate([thummaFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Starting sequence particle');
    }
    // Starts with Fa: فَ...
    else if (firstWord.startsWith('فَ') && firstWord.length > 2) {
      const strippedFirst = firstWord.substring(1);
      const wawFirst = 'وَ' + strippedFirst;
      addCandidate([wawFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Waw (وَ) vs Fa (فَ)');
      addCandidate([strippedFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Initial particle presence');
    }
    // Starts without Waw/Fa
    else {
      const wawFirst = 'وَ' + firstWord;
      const faFirst = 'فَ' + firstWord;
      addCandidate([wawFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Watch out for spurious initial Waw (وَ)');
      addCandidate([faFirst, ...words.slice(1)].join(' '), 'Hafiz Precision: Watch out for initial Fa (فَ)');
    }

    // Starting with إِنَّ vs وَإِنَّ vs فَإِنَّ
    if (firstWord === 'إِنَّ') {
      addCandidate(['وَإِنَّ', ...words.slice(1)].join(' '), 'Mutashabih: (إِنَّ vs وَإِنَّ)');
      addCandidate(['فَإِنَّ', ...words.slice(1)].join(' '), 'Mutashabih: (إِنَّ vs فَإِنَّ)');
    } else if (firstWord === 'وَإِنَّ') {
      addCandidate(['إِنَّ', ...words.slice(1)].join(' '), 'Mutashabih: (وَإِنَّ vs إِنَّ)');
    }

    // Starting with قَالَ vs وَقَالَ vs فَقَالَ vs قَالُوا۟
    if (firstWord === 'قَالَ') {
      addCandidate(['وَقَالَ', ...words.slice(1)].join(' '), 'Mutashabih: (قَالَ vs وَقَالَ)');
      addCandidate(['فَقَالَ', ...words.slice(1)].join(' '), 'Mutashabih: (قَالَ vs فَقَالَ)');
      addCandidate(['قَالُوا۟', ...words.slice(1)].join(' '), 'Conjugation: Singular (قَالَ) vs Plural (قَالُوا۟)');
    } else if (firstWord === 'قَالُوا۟') {
      addCandidate(['وَقَالُوا۟', ...words.slice(1)].join(' '), 'Mutashabih: (قَالُوا۟ vs وَقَالُوا۟)');
      addCandidate(['فَقَالُوا۟', ...words.slice(1)].join(' '), 'Mutashabih: (قَالُوا۟ vs فَقَالُوا۟)');
      addCandidate(['قَالَ', ...words.slice(1)].join(' '), 'Conjugation: Plural (قَالُوا۟) vs Singular (قَالَ)');
    }

    // Starting with قُلْ vs وَقُلْ
    if (firstWord === 'قُلْ') {
      addCandidate(['وَقُلْ', ...words.slice(1)].join(' '), 'Mutashabih: (قُلْ vs وَقُلْ)');
      addCandidate(['فَقُلْ', ...words.slice(1)].join(' '), 'Mutashabih: (قُلْ vs فَقُلْ)');
    }

    // Starting with إِذْ vs وَإِذْ vs إِذَا vs وَإِذَا
    if (firstWord === 'وَإِذْ') {
      addCandidate(['إِذْ', ...words.slice(1)].join(' '), 'Mutashabih: (وَإِذْ vs إِذْ)');
      addCandidate(['وَإِذَا', ...words.slice(1)].join(' '), 'Mutashabih: (وَإِذْ vs وَإِذَا)');
    } else if (firstWord === 'إِذْ') {
      addCandidate(['وَإِذْ', ...words.slice(1)].join(' '), 'Mutashabih: (إِذْ vs وَإِذْ)');
      addCandidate(['إِذَا', ...words.slice(1)].join(' '), 'Mutashabih: (إِذْ vs إِذَا)');
    }

    // Starting with لَقَدْ vs وَلَقَدْ vs قَدْ
    if (firstWord === 'وَلَقَدْ') {
      addCandidate(['لَقَدْ', ...words.slice(1)].join(' '), 'Mutashabih: (وَلَقَدْ vs لَقَدْ)');
      addCandidate(['قَدْ', ...words.slice(1)].join(' '), 'Mutashabih: (وَلَقَدْ vs قَدْ)');
    } else if (firstWord === 'لَقَدْ') {
      addCandidate(['وَلَقَدْ', ...words.slice(1)].join(' '), 'Mutashabih: (لَقَدْ vs وَلَقَدْ)');
      addCandidate(['قَدْ', ...words.slice(1)].join(' '), 'Mutashabih: (لَقَدْ vs قَدْ)');
    }
  }

  // 3. Subtle Pronoun & Conjugation Inversions
  const CONJUGATION_PAIRS: [RegExp, string, string][] = [
    [/تَعْمَلُونَ/g, 'يَعْمَلُونَ', 'Conjugation: 2nd person (تَعْمَلُونَ) vs 3rd person (يَعْمَلُونَ)'],
    [/يَعْمَلُونَ/g, 'تَعْمَلُونَ', 'Conjugation: 3rd person (يَعْمَلُونَ) vs 2nd person (تَعْمَلُونَ)'],
    [/تَعْلَمُونَ/g, 'يَعْلَمُونَ', 'Conjugation: (تَعْلَمُونَ) vs (يَعْلَمُونَ)'],
    [/يَعْلَمُونَ/g, 'تَعْلَمُونَ', 'Conjugation: (يَعْلَمُونَ) vs (تَعْلَمُونَ)'],
    [/تَذَكَّرُونَ/g, 'يَذَّكَّرُونَ', 'Conjugation: (تَذَكَّرُونَ) vs (يَذَّكَّرُونَ)'],
    [/يَذَّكَّرُونَ/g, 'تَذَكَّرُونَ', 'Conjugation: (يَذَّكَّرُونَ) vs (تَذَكَّرُونَ)'],
    [/تَشْكُرُونَ/g, 'يَشْكُرُونَ', 'Conjugation: (تَشْكُرُونَ) vs (يَشْكُرُونَ)'],
    [/يَشْكُرُونَ/g, 'تَشْكُرُونَ', 'Conjugation: (يَشْكُرُونَ) vs (تَشْكُرُونَ)'],
    [/تُؤْمِنُونَ/g, 'يُؤْمِنُونَ', 'Conjugation: (تُؤْمِنُونَ) vs (يُؤْمِنُونَ)'],
    [/يُؤْمِنُونَ/g, 'تُؤْمِنُونَ', 'Conjugation: (يُؤْمِنُونَ) vs (تُؤْمِنُونَ)'],
    [/تَتَّقُونَ/g, 'يَتَّقُونَ', 'Conjugation: (تَتَّقُونَ) vs (يَتَّقُونَ)'],
    [/يَتَّقُونَ/g, 'تَتَّقُونَ', 'Conjugation: (يَتَّقُونَ) vs (تَتَّقُونَ)'],
    [/يَسْمَعُونَ/g, 'تَسْمَعُونَ', 'Conjugation: (يَسْمَعُونَ) vs (تَسْمَعُونَ)'],
    [/يُبْصِرُونَ/g, 'تُبْصِرُونَ', 'Conjugation: (يُبْصِرُونَ) vs (تُبْصِرُونَ)'],
    [/أَبِينَا/g, 'أَبِيكُمْ', 'Pronoun: (أَبِينَا - our father) vs (أَبِيكُمْ - your father)'],
    [/أَبِيكُمْ/g, 'أَبِينَا', 'Pronoun: (أَبِيكُمْ - your father) vs (أَبِينَا - our father)'],
    [/رَبَّنَا/g, 'رَبَّكُمْ', 'Pronoun: (رَبَّنَا - our Lord) vs (رَبَّكُمْ - your Lord)'],
    [/رَبَّكُمْ/g, 'رَبَّنَا', 'Pronoun: (رَبَّكُمْ - your Lord) vs (رَبَّنَا - our Lord)'],
    [/مِنكُمْ/g, 'مِنْهُمْ', 'Pronoun: (مِنكُمْ - among you) vs (مِنْهُمْ - among them)'],
    [/مِنْهُمْ/g, 'مِنكُمْ', 'Pronoun: (مِنْهُمْ - among them) vs (مِنكُمْ - among you)'],
    [/عَلَيْهِمْ/g, 'عَلَيْكُمْ', 'Pronoun: (عَلَيْهِمْ) vs (عَلَيْكُمْ)'],
    [/عَلَيْكُمْ/g, 'عَلَيْهِمْ', 'Pronoun: (عَلَيْكُمْ) vs (عَلَيْهِمْ)'],
    [/فِيهَا/g, 'فِيهِ', 'Pronoun Gender: Feminine (فِيهَا) vs Masculine (فِيهِ)'],
  ];

  for (const [pattern, rep, expl] of CONJUGATION_PAIRS) {
    if (pattern.test(hiddenText)) {
      pattern.lastIndex = 0;
      const variant = hiddenText.replace(pattern, rep);
      addCandidate(variant, expl);
    }
  }

  // 4. If more distractors are needed, pull authentic verses/portions from the page and Surah
  if (results.length < targetCount) {
    // Collect from other page ayahs
    for (const a of pageAyahs) {
      if (a.number !== targetAyah.number) {
        if (portionSection === 'start') {
          const aWords = a.text.trim().split(/\s+/).filter(Boolean);
          if (aWords.length >= 3) {
            const takeCount = Math.min(words.length, Math.max(2, Math.floor(aWords.length * 0.35)));
            addCandidate(aWords.slice(0, takeCount).join(' '), `Beginning fragment from Ayah ${a.numberInSurah}`);
          }
        } else if (portionSection === 'middle') {
          const aWords = a.text.trim().split(/\s+/).filter(Boolean);
          if (aWords.length >= 4) {
            const startI = Math.max(1, Math.floor(aWords.length * 0.25));
            const endI = Math.min(aWords.length - 1, startI + Math.max(2, words.length));
            addCandidate(aWords.slice(startI, endI).join(' '), `Middle fragment from Ayah ${a.numberInSurah}`);
          }
        } else if (portionSection === 'end') {
          const aWords = a.text.trim().split(/\s+/).filter(Boolean);
          if (aWords.length >= 3) {
            const takeCount = Math.min(words.length, Math.max(2, Math.floor(aWords.length * 0.45)));
            addCandidate(aWords.slice(-takeCount).join(' '), `Ending clause from Ayah ${a.numberInSurah}`);
          }
        } else {
          addCandidate(a.text, `Ayah ${a.numberInSurah} of ${primarySurah.englishName}`);
        }
      }
      if (results.length >= targetCount) break;
    }
  }

  // 5. Fallback pool of traditional Quranic mutashabihat endings
  const FALLBACK_MUTASHABIHAT = [
    { text: 'إِنَّ ٱللَّهَ كَانَ عَلِيمًا حَكِيمًا', expl: 'Authentic Mutashabih ending' },
    { text: 'وَكَانَ ٱللَّهُ عَلِيمًا حَكِيمًا', expl: 'Authentic Mutashabih ending' },
    { text: 'إِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ', expl: 'Authentic Mutashabih ending' },
    { text: 'وَٱللَّهُ عَلِيمٌ حَكِيمٌ', expl: 'Authentic Mutashabih ending' },
    { text: 'إِنَّ ٱللَّهَ سَمِيعٌ بَصِيرٌ', expl: 'Authentic Mutashabih ending' },
    { text: 'وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ', expl: 'Authentic Mutashabih ending' },
    { text: 'وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ', expl: 'Authentic Mutashabih ending' },
    { text: 'إِنَّ رَبَّكَ غَفُورٌ ذُو رَحْمَةٍ', expl: 'Authentic Mutashabih ending' },
    { text: 'وَٱللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', expl: 'Authentic Mutashabih ending' },
    { text: 'وَكَانَ ٱللَّهُ غَفُورًا رَّحِيمًا', expl: 'Authentic Mutashabih ending' }
  ];

  for (const item of FALLBACK_MUTASHABIHAT) {
    if (results.length >= targetCount) break;
    addCandidate(item.text, item.expl);
  }

  return results.slice(0, targetCount);
}

/**
 * Creates multiple blank targets on the specified page based on requested count.
 * Fully supports multi-section portion blanking ('start', 'middle', 'end') and tricky Hafiz distractors.
 */
export function createPageBlankTargets(
  pageAyahs: Ayah[],
  primarySurah: Surah,
  requestedCount: number = 1,
  challengeType: ChallengeType = 'full-ayah',
  difficulty: DifficultyLevel = 'medium',
  pageNumberOverride?: number,
  startingIndex: number = 1
): BlankTarget[] {
  if (!pageAyahs || pageAyahs.length === 0) return [];

  const targetPageNum = pageNumberOverride || pageAyahs[0]?.page || 1;
  const actualCount = Math.max(1, Math.min(requestedCount, pageAyahs.length));
  const availableIndices = pageAyahs.map((_, idx) => idx);
  const shuffledIndices = [...availableIndices].sort(() => Math.random() - 0.5);
  const selectedIndices = shuffledIndices.slice(0, actualCount).sort((a, b) => a - b);

  // Available sections for portion mode: cycle through start, middle, end for rich variety
  const SECTION_ROTATION: ('start' | 'middle' | 'end')[] = ['start', 'middle', 'end'];

  return selectedIndices.map((targetIndex, bIdx) => {
    const globalBlankIndex = startingIndex + bIdx;
    const targetAyah = pageAyahs[targetIndex];
    const words = targetAyah.text.trim().split(/\s+/).filter(Boolean);
    const N = words.length;

    let hiddenType: 'full' | 'portion' = 'full';
    let portionSection: 'start' | 'middle' | 'end' | undefined;
    let hiddenWordIndices: number[] | undefined;
    let visiblePrefix: string | undefined;
    let hiddenText = targetAyah.text;
    let visibleSuffix: string | undefined;

    if (challengeType === 'portion-ayah') {
      hiddenType = 'portion';
      // Pick section: rotate across blanks or pick randomly
      portionSection = SECTION_ROTATION[bIdx % SECTION_ROTATION.length];

      if (N <= 2) {
        // Very short ayah: hide single word portion
        const hideIdx = portionSection === 'start' ? 0 : N - 1;
        hiddenWordIndices = [hideIdx];
        if (hideIdx === 0) {
          visiblePrefix = undefined;
          hiddenText = words[0];
          visibleSuffix = words.slice(1).join(' ');
        } else {
          visiblePrefix = words.slice(0, hideIdx).join(' ');
          hiddenText = words[hideIdx];
          visibleSuffix = undefined;
        }
      } else if (portionSection === 'start') {
        // Blank beginning section (concise 2 to 3 words)
        const splitIndex = Math.min(3, Math.max(2, Math.min(N - 1, 3)));
        hiddenWordIndices = Array.from({ length: splitIndex }, (_, i) => i);
        visiblePrefix = undefined;
        hiddenText = words.slice(0, splitIndex).join(' ');
        visibleSuffix = words.slice(splitIndex).join(' ');
      } else if (portionSection === 'middle' && N >= 4) {
        // Blank middle section (concise 2 to 3 words in the middle)
        const portionLength = Math.min(3, Math.max(2, Math.min(N - 2, 3)));
        const middlePivot = Math.floor(N / 2);
        const startIdx = Math.max(1, Math.min(N - portionLength - 1, middlePivot - Math.floor(portionLength / 2)));
        const endIdx = startIdx + portionLength;
        hiddenWordIndices = Array.from({ length: portionLength }, (_, i) => startIdx + i);
        visiblePrefix = words.slice(0, startIdx).join(' ');
        hiddenText = words.slice(startIdx, endIdx).join(' ');
        visibleSuffix = words.slice(endIdx).join(' ');
      } else {
        // Blank ending clause (concise 2 to 3 words at end)
        portionSection = 'end';
        const portionLength = Math.min(3, Math.max(2, Math.min(N - 1, 3)));
        const splitIndex = N - portionLength;
        hiddenWordIndices = Array.from({ length: portionLength }, (_, i) => splitIndex + i);
        visiblePrefix = words.slice(0, splitIndex).join(' ');
        hiddenText = words.slice(splitIndex).join(' ');
        visibleSuffix = undefined;
      }
    }

    // Number of options: Hafiz has 4 tricky mutashabihat options, Medium 4, Easy 3
    const optionsCount = difficulty === 'easy' ? 3 : 4;
    const options: CarouselOption[] = [];

    // Explanation description
    let correctExplanation = `Authentic text of Ayah ${targetAyah.numberInSurah}`;
    if (portionSection === 'start') {
      correctExplanation = `Authentic beginning of Ayah ${targetAyah.numberInSurah}`;
    } else if (portionSection === 'middle') {
      correctExplanation = `Authentic middle clause of Ayah ${targetAyah.numberInSurah}`;
    } else if (portionSection === 'end') {
      correctExplanation = `Authentic conclusion of Ayah ${targetAyah.numberInSurah}`;
    }

    const correctOption: CarouselOption = {
      id: `opt_correct_${globalBlankIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: hiddenText,
      translation: targetAyah.translation,
      isCorrect: true,
      surahReference: `Ayah ${targetAyah.numberInSurah}`,
      explanation: correctExplanation,
      audio: targetAyah.audio
    };

    options.push(correctOption);

    // Generate intelligent, tricky distractors
    const trickyDistractors = generateTrickyDistractors(
      hiddenText,
      targetAyah,
      pageAyahs,
      primarySurah,
      difficulty,
      portionSection,
      optionsCount - 1
    );

    trickyDistractors.forEach((cand, i) => {
      options.push({
        id: `opt_distractor_${globalBlankIndex}_${i}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text: cand.text,
        isCorrect: false,
        explanation: cand.explanation || (difficulty === 'hafiz' ? 'Mutashabih distractor' : 'Quranic distractor')
      });
    });

    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return {
      id: `blank_p${targetPageNum}_a${targetAyah.number}_${globalBlankIndex}_${Date.now()}`,
      blankIndex: globalBlankIndex,
      pageNumber: targetPageNum,
      ayahIndex: targetIndex,
      ayahNumberInSurah: targetAyah.numberInSurah,
      fullAyah: targetAyah,
      hiddenType,
      portionSection,
      hiddenWordIndices,
      visiblePrefix,
      hiddenText,
      visibleSuffix,
      options: shuffledOptions,
      correctOptionId: correctOption.id
    };
  });
}

/**
 * Creates a single blank target on the specified page (wrapper over createPageBlankTargets)
 */
export function createPageBlankTarget(
  pageAyahs: Ayah[],
  primarySurah: Surah,
  challengeType: ChallengeType = 'full-ayah',
  difficulty: DifficultyLevel = 'medium'
): BlankTarget | null {
  const blanks = createPageBlankTargets(pageAyahs, primarySurah, 1, challengeType, difficulty);
  return blanks.length > 0 ? blanks[0] : null;
}

/**
 * Computes Juz, Hizb, and Quarter string for the page margin
 */
export function getHizbStringForPage(juz: number, pageNumber: number): string {
  const hizbNumber = Math.min(60, Math.max(1, Math.floor((pageNumber - 1) / 10) + 1));
  const isHalf = (pageNumber % 10) >= 5;
  if (isHalf) {
    return `Juz' ${juz}, ½ Hizb ${hizbNumber}`;
  }
  return `Juz' ${juz}`;
}
