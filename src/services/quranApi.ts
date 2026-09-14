import { Ayah, QuranPageData, Surah, PageFifteenLine, PageLineItem } from '../types';
import { BUILT_IN_SURAHS, BUILT_IN_PAGES } from '../data/quranData';
import { SURAH_METADATA_LIST } from '../data/surahList';
import { formatPageIntoFifteenLines, getHizbStringForPage } from '../utils/fifteenLineEngine';

const CACHE_SURAH_PREFIX = 'mushaf_surah_cache_';
const CACHE_PAGE_PREFIX = 'mushaf_page_cache_';

export async function fetchSurah(surahNumber: number): Promise<Surah> {
  // 1. Check if we have it in built-in memory
  if (BUILT_IN_SURAHS[surahNumber]) {
    return BUILT_IN_SURAHS[surahNumber];
  }

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(`${CACHE_SURAH_PREFIX}${surahNumber}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.ayahs && parsed.ayahs.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Cache read error', e);
  }

  // 3. Fetch from API (editions: quran-uthmani for Arabic, en.sahih for English, ar.alafasy for Audio)
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,ar.alafasy`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code === 200 && data.data && data.data.length >= 2) {
      const uthmaniData = data.data[0];
      const englishData = data.data[1];
      const audioData = data.data[2];

      const ayahs: Ayah[] = uthmaniData.ayahs.map((a: any, idx: number) => {
        let text = a.text;
        // Clean attached Bismillah from ayah 1 if not Surah Al-Fatihah
        if (surahNumber !== 1 && surahNumber !== 9 && idx === 0) {
          const bismillahPrefix = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
          const simpleBismillah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
          if (text.startsWith(bismillahPrefix)) {
            text = text.substring(bismillahPrefix.length).trim();
          } else if (text.startsWith(simpleBismillah)) {
            text = text.substring(simpleBismillah.length).trim();
          }
        }

        return {
          number: a.number,
          numberInSurah: a.numberInSurah,
          surahNumber: surahNumber,
          text: text,
          translation: englishData?.ayahs?.[idx]?.text || '',
          audio: audioData?.ayahs?.[idx]?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
          juz: a.juz,
          page: a.page,
          hizbQuarter: a.hizbQuarter,
          sajda: typeof a.sajda === 'boolean' ? a.sajda : !!a.sajda
        };
      });

      const meta = SURAH_METADATA_LIST.find(s => s.number === surahNumber);

      const surah: Surah = {
        number: surahNumber,
        name: uthmaniData.name,
        englishName: uthmaniData.englishName || meta?.englishName || `Surah ${surahNumber}`,
        englishNameTranslation: uthmaniData.englishNameTranslation || meta?.englishNameTranslation || '',
        revelationType: uthmaniData.revelationType || meta?.revelationType || 'Meccan',
        numberOfAyahs: ayahs.length,
        ayahs: ayahs
      };

      try {
        localStorage.setItem(`${CACHE_SURAH_PREFIX}${surahNumber}`, JSON.stringify(surah));
      } catch (e) {
        console.warn('LocalStorage quota or write error', e);
      }

      return surah;
    }
  } catch (error) {
    console.error('Failed to fetch surah from API, falling back', error);
  }

  // Fallback to Al-Fatihah if all else fails
  return BUILT_IN_SURAHS[1];
}

/**
 * Fetches standard 15-line Quran page data by page number (1 to 604)
 */
export async function fetchPage(pageNumber: number): Promise<QuranPageData> {
  const boundedPage = Math.max(1, Math.min(604, pageNumber));

  // 1. Check built-in pre-cached pages (e.g. Page 235, 236, 1, etc.)
  if (BUILT_IN_PAGES && BUILT_IN_PAGES[boundedPage]) {
    const builtIn = BUILT_IN_PAGES[boundedPage];
    const lines = formatPageIntoFifteenLines(boundedPage, builtIn.ayahs, builtIn.primarySurah);
    return {
      ...builtIn,
      lines
    };
  }

  // 2. Check localStorage
  try {
    const cached = localStorage.getItem(`${CACHE_PAGE_PREFIX}${boundedPage}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.ayahs && parsed.ayahs.length > 0) {
        const lines = formatPageIntoFifteenLines(
          boundedPage,
          parsed.ayahs,
          parsed.primarySurah,
          null,
          null,
          parsed.baseLines
        );
        return {
          ...parsed,
          lines
        };
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error for page', e);
  }

  // 3. Primary: Fetch from Quran.com API with King Fahd Complex (QCF) per-page per-line words
  try {
    const quranComRes = await fetch(
      `https://api.quran.com/api/v4/verses/by_page/${boundedPage}?words=true&word_fields=text_uthmani,line_number&translations=20`
    );

    if (quranComRes.ok) {
      const qcfData = await quranComRes.json();
      const rawVerses = qcfData.verses || [];

      if (rawVerses.length > 0) {
        // Map verses
        const ayahs: Ayah[] = rawVerses.map((v: any) => {
          const sNum = parseInt(v.verse_key.split(':')[0], 10);
          const aWords = (v.words || []).filter((w: any) => w.char_type_name === 'word');
          const aText = aWords
            .map((w: any) => (w.text_uthmani || '').replace(/<[^>]+>/g, '').trim())
            .join(' ');
          const rawTrans = v.translations?.[0]?.text || '';
          const cleanTrans = rawTrans
            .replace(/<sup[^>]*>.*?<\/sup>/g, '')
            .replace(/<[^>]+>/g, '')
            .trim();

          return {
            number: v.id,
            numberInSurah: v.verse_number,
            surahNumber: sNum,
            text: aText,
            translation: cleanTrans,
            audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.id}.mp3`,
            juz: v.juz_number,
            page: v.page_number || boundedPage,
            hizbQuarter: v.rub_el_hizb_number,
            sajda: !!v.sajdah_number
          };
        });

        // Group words by their authentic King Fahd Complex line number (1 to 15)
        const lineItemsMap = new Map<number, PageLineItem[]>();
        for (let i = 1; i <= 15; i++) {
          lineItemsMap.set(i, []);
        }

        rawVerses.forEach((v: any) => {
          const fullAyah = ayahs.find(a => a.number === v.id);
          let wordCounter = 0;
          (v.words || []).forEach((w: any) => {
            const ln = w.line_number;
            if (ln >= 1 && ln <= 15) {
              if (w.char_type_name === 'word') {
                const cleanText = (w.text_uthmani || '').replace(/<[^>]+>/g, '').trim();
                lineItemsMap.get(ln)!.push({
                  type: 'word',
                  text: cleanText,
                  ayahNumberInSurah: v.verse_number,
                  wordIndexInAyah: wordCounter++,
                  fullAyah
                });
              } else if (w.char_type_name === 'end') {
                lineItemsMap.get(ln)!.push({
                  type: 'ayah-number',
                  text: toArabicDigits(v.verse_number),
                  ayahNumberInSurah: v.verse_number,
                  fullAyah
                });
              }
            }
          });
        });

        // Determine Surah Banner and Bismillah lines for surahs starting on this page
        const assignedLineTypes = new Map<number, Partial<PageFifteenLine>>();
        rawVerses.forEach((v: any) => {
          if (v.verse_number === 1) {
            const sNum = parseInt(v.verse_key.split(':')[0], 10);
            const firstWord = (v.words || [])[0];
            const firstLine = firstWord ? firstWord.line_number : 1;
            const sMeta = SURAH_METADATA_LIST.find(s => s.number === sNum);
            const surahData = {
              number: sNum,
              name: sMeta ? sMeta.name : 'سُورَةُ',
              englishName: sMeta ? sMeta.englishName : `Surah ${sNum}`,
              revelationType: sMeta ? sMeta.revelationType : 'Meccan',
              numberOfAyahs: sMeta ? sMeta.numberOfAyahs : 1
            };

            if (boundedPage === 1) {
              assignedLineTypes.set(1, { type: 'surah-banner', surahData });
            } else if (sNum === 9) {
              // Surah At-Tawbah has no Bismillah
              assignedLineTypes.set(firstLine - 1, { type: 'surah-banner', surahData });
            } else {
              if (firstLine >= 3) {
                assignedLineTypes.set(firstLine - 2, { type: 'surah-banner', surahData });
                assignedLineTypes.set(firstLine - 1, {
                  type: 'bismillah',
                  rawText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
                });
              }
            }
          }
        });

        const baseLines: PageFifteenLine[] = [];
        for (let l = 1; l <= 15; l++) {
          if (assignedLineTypes.has(l)) {
            baseLines.push({
              lineNumber: l,
              ...(assignedLineTypes.get(l) as any)
            });
          } else {
            baseLines.push({
              lineNumber: l,
              type: 'verse-text',
              items: lineItemsMap.get(l) || []
            });
          }
        }

        const firstAyah = ayahs[0];
        const primarySurahNumber = firstAyah ? firstAyah.surahNumber : 1;
        const surahMeta = SURAH_METADATA_LIST.find(s => s.number === primarySurahNumber);

        const primarySurah: Surah = {
          number: primarySurahNumber,
          name: surahMeta?.name || 'سُورَةُ',
          englishName: surahMeta?.englishName || 'Surah',
          englishNameTranslation: surahMeta?.englishNameTranslation || '',
          revelationType: surahMeta?.revelationType || 'Meccan',
          numberOfAyahs: surahMeta?.numberOfAyahs || 1,
          ayahs: ayahs
        };

        const juzNumber = firstAyah ? firstAyah.juz : 1;
        const hizbString = getHizbStringForPage(juzNumber, boundedPage);
        const lines = formatPageIntoFifteenLines(
          boundedPage,
          ayahs,
          primarySurah,
          null,
          null,
          baseLines
        );

        const pageData: QuranPageData = {
          pageNumber: boundedPage,
          juzNumber,
          hizbString,
          primarySurah,
          ayahs,
          baseLines,
          lines
        };

        try {
          localStorage.setItem(
            `${CACHE_PAGE_PREFIX}${boundedPage}`,
            JSON.stringify({
              pageNumber: boundedPage,
              juzNumber,
              hizbString,
              primarySurah,
              ayahs,
              baseLines
            })
          );
        } catch (e) {
          console.warn('LocalStorage write error for page', e);
        }

        return pageData;
      }
    }
  } catch (qcfError) {
    console.warn('Quran.com API error, falling back to AlQuran Cloud', qcfError);
  }

  // 4. Fallback: Fetch from Al Quran Cloud API (separate requests for uthmani text & english translation)
  try {
    const [uthmaniRes, englishRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/page/${boundedPage}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/page/${boundedPage}/en.sahih`).catch(() => null)
    ]);

    if (!uthmaniRes.ok) {
      throw new Error(`Page fetch error ${uthmaniRes.status}`);
    }

    const uthmaniData = await uthmaniRes.json();
    let englishData: any = null;
    if (englishRes && englishRes.ok) {
      try {
        englishData = await englishRes.json();
      } catch (e) {
        // ignore english translation parse error
      }
    }

    if (uthmaniData.code === 200 && uthmaniData.data && uthmaniData.data.ayahs) {
      const rawAyahs = uthmaniData.data.ayahs;
      const englishAyahs = englishData?.data?.ayahs || [];

      const ayahs: Ayah[] = rawAyahs.map((a: any, idx: number) => {
        let text = a.text;
        const sNum = a.surah?.number || 1;

        // Clean attached bismillah if not Fatihah and not Tawbah
        if (sNum !== 1 && sNum !== 9 && a.numberInSurah === 1) {
          const bismillahPrefix = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
          const simpleBismillah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
          if (text.startsWith(bismillahPrefix)) {
            text = text.substring(bismillahPrefix.length).trim();
          } else if (text.startsWith(simpleBismillah)) {
            text = text.substring(simpleBismillah.length).trim();
          }
        }

        return {
          number: a.number,
          numberInSurah: a.numberInSurah,
          surahNumber: sNum,
          text: text,
          translation: englishAyahs[idx]?.text || '',
          audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
          juz: a.juz,
          page: a.page || boundedPage,
          hizbQuarter: a.hizbQuarter,
          sajda: typeof a.sajda === 'boolean' ? a.sajda : !!a.sajda
        };
      });

      const firstAyah = rawAyahs[0];
      const primarySurahNumber = firstAyah?.surah?.number || 1;
      const surahMeta = SURAH_METADATA_LIST.find(s => s.number === primarySurahNumber);

      const primarySurah: Surah = {
        number: primarySurahNumber,
        name: firstAyah?.surah?.name || surahMeta?.name || 'سُورَةُ',
        englishName: firstAyah?.surah?.englishName || surahMeta?.englishName || 'Surah',
        englishNameTranslation: firstAyah?.surah?.englishNameTranslation || surahMeta?.englishNameTranslation || '',
        revelationType: firstAyah?.surah?.revelationType || surahMeta?.revelationType || 'Meccan',
        numberOfAyahs: firstAyah?.surah?.numberOfAyahs || 1,
        ayahs: ayahs
      };

      const juzNumber = firstAyah?.juz || 1;
      const hizbString = getHizbStringForPage(juzNumber, boundedPage);
      const lines = formatPageIntoFifteenLines(boundedPage, ayahs, primarySurah);

      const pageData: QuranPageData = {
        pageNumber: boundedPage,
        juzNumber,
        hizbString,
        primarySurah,
        ayahs,
        lines
      };

      try {
        localStorage.setItem(`${CACHE_PAGE_PREFIX}${boundedPage}`, JSON.stringify({
          pageNumber: boundedPage,
          juzNumber,
          hizbString,
          primarySurah,
          ayahs
        }));
      } catch (e) {
        console.warn('LocalStorage write error for page', e);
      }

      return pageData;
    }
  } catch (error) {
    console.error('Failed to fetch page from API', error);
  }

  // Fallback to built-in page 235 or page 1 with computed lines
  const fallback = BUILT_IN_PAGES[235] || BUILT_IN_PAGES[1];
  const lines = formatPageIntoFifteenLines(fallback.pageNumber, fallback.ayahs, fallback.primarySurah);
  return {
    ...fallback,
    lines
  };
}

// Convert numbers to Arabic digits for traditional Mushaf verse marks ﴿١٢﴾
export function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map(d => (d >= '0' && d <= '9' ? arabicDigits[parseInt(d, 10)] : d))
    .join('');
}
