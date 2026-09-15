import { PageLineItem } from '../types';
import { SURAH_METADATA_LIST } from '../data/surahList';

/**
 * Strips tajweed / waqf marks and special Quranic symbols that render as black circular dots
 * on mobile/desktop browsers, while strictly preserving core Uthmani letters and standard harakat.
 *
 * Specifically removes:
 * - \u06DF: ARABIC SMALL HIGH ROUNDED ZERO (۟) - renders as black circular dot on silent letters
 * - \u06E0: ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO (۠)
 * - \u06E2: ARABIC SMALL HIGH MEEM ISOLATED FORM (ۢ) - iqlab symbol
 * - \u06E3: ARABIC SMALL LOW SEEN (ۣ)
 * - \u06E4: ARABIC SMALL HIGH MADDA (ۤ)
 * - \u06E7: ARABIC SMALL HIGH YEH (ۧ)
 * - \u06E8: ARABIC SMALL HIGH NOON (ۨ)
 * - \u06EA: ARABIC EMPTY CENTRE LOW STOP (۪)
 * - \u06EB: ARABIC EMPTY CENTRE HIGH STOP (۫)
 * - \u06EC: ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE (۬) - solid black dot
 * - \u06ED: ARABIC SMALL LOW MEEM (ۭ)
 * - \u06D6-\u06DC: Waqf stop signs (ۖ, ۗ, ۘ, ۙ, ۚ, ۛ, ۜ) that attach to words
 * - \u0640: Tatweel/kashida (ـ) so words remain tightly joined without elongation gaps
 */
export function stripTajweedMarkers(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/[\u06D6-\u06DC\u06DF\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    .replace(/\u0640+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Arabic combining marks / diacritics
const DIACRITICS = new Set([
  0x064b, 0x064c, 0x064d, 0x064e, 0x064f, 0x0650, 0x0651, 0x0652, 0x0653,
  0x0670, 0x06df, 0x06e0, 0x06e1, 0x06e2, 0x06e3, 0x06e4, 0x06e5, 0x06e6,
  0x06e7, 0x06e8, 0x06ea, 0x06eb, 0x06ec, 0x06ed
]);

// Non-connecting Arabic letters (cannot have tatweel after them)
const NON_CONNECTING = new Set([
  'ا', 'أ', 'إ', 'آ', 'ٱ',
  'د', 'ذ',
  'ر', 'ز',
  'و', 'ؤ',
  'ء', 'ة', 'ى'
]);

/**
 * Finds character indices where a calligraphic kashida (ـ) can be naturally inserted.
 * A slot is valid if:
 * 1. The character connects to the following letter.
 * 2. It is not part of a Lam-Alif ligature.
 * 3. The insertion point is placed after any combining diacritics for that base consonant.
 */
export function findKashidaSlots(word: string): number[] {
  if (!word || word.length < 2) return [];

  const slots: number[] = [];
  const chars = [...word];

  for (let i = 0; i < chars.length - 1; i++) {
    const ch = chars[i];
    const code = ch.charCodeAt(0);

    // Skip diacritics or non-connecting letters
    if (DIACRITICS.has(code) || NON_CONNECTING.has(ch) || ch === 'ـ') {
      continue;
    }

    // Advance past any diacritics on the current base letter
    let nextBaseIdx = i + 1;
    while (nextBaseIdx < chars.length && DIACRITICS.has(chars[nextBaseIdx].charCodeAt(0))) {
      nextBaseIdx++;
    }

    if (nextBaseIdx >= chars.length) continue;

    const nextChar = chars[nextBaseIdx];

    // Do not split the Lam-Alif ligature
    if (ch === 'ل' && (nextChar === 'ا' || nextChar === 'أ' || nextChar === 'إ' || nextChar === 'آ' || nextChar === 'ٱ')) {
      continue;
    }

    // Do not insert immediately before another tatweel or punctuation
    if (nextChar === 'ـ' || nextChar === ' ' || nextChar === 'ۙ' || nextChar === 'ۚ' || nextChar === 'ۖ') {
      continue;
    }

    slots.push(nextBaseIdx);
  }

  return slots;
}

/**
 * Elongates an Arabic word with kashida at authentic calligraphic joints.
 * In Classical Quranic typography, elongation is preferred:
 * - Before the final letter of a word (e.g. ٱلْعَـٰلَمِيـنَ, ٱلرَّحِيـمِ)
 * - Between Seen/Sheen/Sad and the following letter (e.g. بِسْـمِ, ٱلْمُسْـتَقِيمَ)
 */
export function elongateWord(word: string, amount: number = 1): string {
  if (!word || amount <= 0) return word;

  const slots = findKashidaSlots(word);
  if (slots.length === 0) return word;

  const chars = [...word];

  // Prefer slot before the final consonant
  const chosenSlot = slots[slots.length - 1];
  chars.splice(chosenSlot, 0, 'ـ'.repeat(amount));

  return chars.join('');
}

/**
 * Checks if a line contains the last verse of a Surah and has few words,
 * meaning it should be centered in classical Mushaf style rather than justified.
 */
export function isLineCentered(items: PageLineItem[] | undefined): boolean {
  if (!items || items.length === 0) return false;

  const wordItems = items.filter(it => it.type === 'word' || it.type === 'blank-slot');
  if (wordItems.length <= 4) return true;

  // Check if this line concludes a surah
  const ayahNumItem = items.find(it => it.type === 'ayah-number');
  if (ayahNumItem && ayahNumItem.fullAyah?.surahNumber && ayahNumItem.ayahNumberInSurah) {
    const sMeta = SURAH_METADATA_LIST.find(s => s.number === ayahNumItem.fullAyah.surahNumber);
    if (sMeta && ayahNumItem.ayahNumberInSurah >= sMeta.numberOfAyahs && wordItems.length <= 6) {
      return true;
    }
  }

  return false;
}

/**
 * Returns line items without inserting kashida/tatweel characters between letters,
 * ensuring words stay visually compact, tight, and naturally dense as in authentic printed Mushafs.
 */
export function applyKashidaToLine(items: PageLineItem[], _isCentered: boolean): PageLineItem[] {
  if (!items || items.length === 0) {
    return items;
  }
  // Stop inserting kashida (ـ) between letters to preserve authentic, tight word shapes
  return items;
}
