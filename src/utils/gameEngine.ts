import { Ayah, BlankTarget, CarouselOption, ChallengeType, DifficultyLevel, Surah } from '../types';
import { BUILT_IN_SURAHS } from '../data/quranData';

// Generate a blank target for a given Surah and Ayah index
export function createBlankTarget(
  surah: Surah,
  ayahIndex: number,
  challengeType: ChallengeType,
  difficulty: DifficultyLevel
): BlankTarget {
  const currentAyah = surah.ayahs[ayahIndex];
  const ayahWords = currentAyah.text.split(' ');

  let hiddenType: 'full' | 'portion' = 'full';
  let visiblePrefix: string | undefined = undefined;
  let hiddenText = currentAyah.text;
  let visibleSuffix: string | undefined = undefined;

  if (challengeType === 'portion-ayah' || (difficulty === 'medium' && ayahWords.length >= 4)) {
    hiddenType = 'portion';
    // Hide last 40-60% of words or middle words
    const splitPoint = Math.max(1, Math.floor(ayahWords.length * 0.45));
    visiblePrefix = ayahWords.slice(0, splitPoint).join(' ');
    hiddenText = ayahWords.slice(splitPoint).join(' ');
  }

  // Build Distractors / Options for carousel
  const options = generateOptions(surah, ayahIndex, hiddenType, hiddenText, currentAyah, difficulty);

  // Find correct option ID
  const correctOption = options.find(o => o.isCorrect);

  return {
    id: `blank_${surah.number}_${currentAyah.numberInSurah}_${Date.now()}`,
    blankIndex: 1,
    ayahIndex,
    ayahNumberInSurah: currentAyah.numberInSurah,
    fullAyah: currentAyah,
    hiddenType,
    visiblePrefix,
    hiddenText,
    visibleSuffix,
    options,
    correctOptionId: correctOption ? correctOption.id : options[0].id,
  };
}

function generateOptions(
  surah: Surah,
  targetAyahIndex: number,
  hiddenType: 'full' | 'portion',
  hiddenText: string,
  targetAyah: Ayah,
  difficulty: DifficultyLevel
): CarouselOption[] {
  const optionsCount = difficulty === 'easy' ? 3 : 4;
  const correctOption: CarouselOption = {
    id: `opt_correct_${Math.random()}`,
    text: hiddenText,
    translation: targetAyah.translation,
    isCorrect: true,
    surahReference: `${surah.englishName} [Ayah ${targetAyah.numberInSurah}]`,
    audio: targetAyah.audio,
    explanation: `Exact authentic continuation in ${surah.englishName} (${targetAyah.numberInSurah}).`
  };

  const distractorList: CarouselOption[] = [];

  // Pool of candidate verses from same surah
  const otherAyahsInSurah = surah.ayahs.filter((_, idx) => idx !== targetAyahIndex);

  // Pool of candidate verses from other built-in surahs
  const otherSurahs = Object.values(BUILT_IN_SURAHS).filter(s => s.number !== surah.number);
  const otherSurahAyahs: { ayah: Ayah; surah: Surah }[] = [];
  otherSurahs.forEach(s => {
    s.ayahs.forEach(a => otherSurahAyahs.push({ ayah: a, surah: s }));
  });

  if (hiddenType === 'portion') {
    // Generate portion distractors (e.g. realistic ending completions)
    const portionPool: { text: string; ref: string; trans?: string }[] = [];

    // Check for common Quranic endings or substrings from other ayahs in this surah
    otherAyahsInSurah.forEach(a => {
      const words = a.text.split(' ');
      if (words.length >= 3) {
        const portion = words.slice(Math.floor(words.length * 0.4)).join(' ');
        if (portion && portion !== hiddenText) {
          portionPool.push({
            text: portion,
            ref: `${surah.englishName} [Ayah ${a.numberInSurah}]`,
            trans: a.translation
          });
        }
      }
    });

    // Add iconic endings
    const commonEndings = [
      { text: "وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ", ref: "Common Quranic Ending", trans: "And He is the Exalted in Might, the Wise." },
      { text: "إِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ", ref: "Common Quranic Ending", trans: "Indeed, Allah is Forgiving and Merciful." },
      { text: "وَٱللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", ref: "Common Quranic Ending", trans: "And Allah is Seeing of what you do." },
      { text: "إِنَّ ٱللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", ref: "Common Quranic Ending", trans: "Indeed, Allah is over all things competent." },
      { text: "وَكَانَ ٱللَّهُ عَلِيمًا حَكِيمًا", ref: "Common Quranic Ending", trans: "And Allah is ever Knowing and Wise." },
      { text: "إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ", ref: "Common Quranic Ending", trans: "Indeed in that are signs for a people who give thought." },
      { text: "وَهُوَ ٱلْغَفُورُ ٱلرَّحِيمُ", ref: "Common Quranic Ending", trans: "And He is the Forgiving, the Merciful." }
    ];

    commonEndings.forEach(e => {
      if (e.text !== hiddenText) {
        portionPool.push({ text: e.text, ref: e.ref, trans: e.trans });
      }
    });

    // Pick unique distractors
    const shuffledPortions = shuffleArray(portionPool);
    let count = 0;
    for (const p of shuffledPortions) {
      if (count >= optionsCount - 1) break;
      if (!distractorList.some(d => d.text === p.text) && p.text !== hiddenText) {
        distractorList.push({
          id: `opt_distractor_${count}_${Math.random()}`,
          text: p.text,
          translation: p.trans,
          isCorrect: false,
          surahReference: p.ref,
          explanation: `From ${p.ref} — different verse ending.`
        });
        count++;
      }
    }
  } else {
    // Full Ayah distractors
    // Prioritize other ayahs from the same Surah to test sequential precision
    const sameSurahShuffled = shuffleArray(otherAyahsInSurah);
    for (const a of sameSurahShuffled) {
      if (distractorList.length >= Math.min(2, optionsCount - 1)) break;
      if (a.text !== hiddenText) {
        distractorList.push({
          id: `opt_distractor_same_${a.numberInSurah}_${Math.random()}`,
          text: a.text,
          translation: a.translation,
          isCorrect: false,
          surahReference: `${surah.englishName} [Ayah ${a.numberInSurah}]`,
          audio: a.audio,
          explanation: `Ayah ${a.numberInSurah} in ${surah.englishName}, not Ayah ${targetAyah.numberInSurah}.`
        });
      }
    }

    // Fill remaining from other Surahs
    const otherSurahShuffled = shuffleArray(otherSurahAyahs);
    for (const item of otherSurahShuffled) {
      if (distractorList.length >= optionsCount - 1) break;
      if (item.ayah.text !== hiddenText && !distractorList.some(d => d.text === item.ayah.text)) {
        distractorList.push({
          id: `opt_distractor_other_${item.ayah.number}_${Math.random()}`,
          text: item.ayah.text,
          translation: item.ayah.translation,
          isCorrect: false,
          surahReference: `${item.surah.englishName} [Ayah ${item.ayah.numberInSurah}]`,
          audio: item.ayah.audio,
          explanation: `From ${item.surah.englishName} (Ayah ${item.ayah.numberInSurah}).`
        });
      }
    }
  }

  // Combine and shuffle all options
  const allOptions = [correctOption, ...distractorList];
  return shuffleArray(allOptions);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
