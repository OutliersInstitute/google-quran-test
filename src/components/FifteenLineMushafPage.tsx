import React from 'react';
import { Ayah, BlankTarget, MushafTheme, QuranPageData, Surah, PageFifteenLine, PageLineItem } from '../types';
import { toArabicDigits } from '../services/quranApi';
import { Settings } from 'lucide-react';
import { formatPageIntoFifteenLines } from '../utils/fifteenLineEngine';
import { applyKashidaToLine, isLineCentered } from '../utils/kashida';
import { triggerHaptic } from '../utils/haptics';

interface FifteenLineMushafPageProps {
  pageData: QuranPageData;
  blankTargets?: BlankTarget[];
  blankTarget?: BlankTarget | null;
  activeBlankId?: string | null;
  selectedOptionId?: string;
  isAnswered?: boolean;
  isCorrect?: boolean;
  theme: MushafTheme;
  onPlayAyahAudio?: (ayah: Ayah) => void;
  onSelectBlankId?: (blankId: string) => void;
  onSelectBlank?: (blankId: string) => void;
  onOpenSettings?: () => void;
  mistakesCount?: number;
  showTranslation?: boolean;
  isSecondaryPage?: boolean;
}

export const FifteenLineMushafPage: React.FC<FifteenLineMushafPageProps> = ({
  pageData,
  blankTargets,
  blankTarget,
  activeBlankId,
  selectedOptionId,
  isAnswered = false,
  isCorrect = false,
  theme,
  onPlayAyahAudio,
  onSelectBlankId,
  onSelectBlank,
  onOpenSettings,
  mistakesCount,
  showTranslation = false,
  isSecondaryPage = false
}) => {
  const handleBlankClick = onSelectBlankId || onSelectBlank;

  const primarySurah = pageData?.primarySurah || {
    number: 12,
    name: "سُورَةُ يُوسُفَ",
    englishName: "Surah Yūsuf",
    englishNameTranslation: "Joseph",
    revelationType: "Meccan" as const,
    numberOfAyahs: 111,
    ayahs: []
  };

  const pageNumber = pageData?.pageNumber || 236;
  const juzNumber = pageData?.juzNumber || 12;
  const hizbString = pageData?.hizbString || `Juz' ${juzNumber}`;
  const ayahs = pageData?.ayahs || [];

  // Consolidate targets for this specific page
  const effectiveTargets: BlankTarget[] = React.useMemo(() => {
    const list = blankTargets && blankTargets.length > 0 ? blankTargets : (blankTarget ? [blankTarget] : []);
    return list.filter(t => !t.pageNumber || t.pageNumber === pageNumber);
  }, [blankTargets, blankTarget, pageNumber]);

  // Theme styling map
  const themeClasses = {
    parchment: {
      bg: 'bg-[#fcf9f2] text-[#1c1815]',
      frameBg: 'bg-[#fcf9f2]',
      outerBorder: 'border-[#3a2e22]',
      innerBorder: 'border-[#3a2e22]/50',
      cornerOrnament: 'border-[#3a2e22] bg-[#fcf9f2]',
      marginText: 'text-[#3a2e22]',
      headerRule: 'border-[#3a2e22]/20',
      verseColor: 'text-[#1c1815]',
      markerColor: 'text-[#3a2e22]',
      pageNumber: 'text-[#3a2e22]',
      surahBannerBg: 'bg-[#f5ecda] border-[#3a2e22]',
      bismillahColor: 'text-[#2a2016]'
    },
    emerald: {
      bg: 'bg-[#f4f8f5] text-[#0f281e]',
      frameBg: 'bg-[#f4f8f5]',
      outerBorder: 'border-[#1b4332]',
      innerBorder: 'border-[#1b4332]/50',
      cornerOrnament: 'border-[#1b4332] bg-[#f4f8f5]',
      marginText: 'text-[#1b4332]',
      headerRule: 'border-emerald-700/20',
      verseColor: 'text-[#0f281e]',
      markerColor: 'text-[#1b4332]',
      pageNumber: 'text-[#1b4332]',
      surahBannerBg: 'bg-[#e2efe7] border-[#1b4332]',
      bismillahColor: 'text-[#143628]'
    },
    midnight: {
      bg: 'bg-[#15191c] text-[#f1ece1]',
      frameBg: 'bg-[#15191c]',
      outerBorder: 'border-[#d4af37]/80',
      innerBorder: 'border-[#d4af37]/40',
      cornerOrnament: 'border-[#d4af37] bg-[#15191c]',
      marginText: 'text-[#d4af37]',
      headerRule: 'border-[#d4af37]/25',
      verseColor: 'text-[#f5f1e8]',
      markerColor: 'text-[#e5c07b]',
      pageNumber: 'text-[#d4af37]',
      surahBannerBg: 'bg-[#22282e] border-[#d4af37]',
      bismillahColor: 'text-[#f5d78e]'
    },
    'classic-white': {
      bg: 'bg-[#ffffff] text-[#111111]',
      frameBg: 'bg-[#ffffff]',
      outerBorder: 'border-[#222222]',
      innerBorder: 'border-[#222222]/40',
      cornerOrnament: 'border-[#222222] bg-white',
      marginText: 'text-[#222222]',
      headerRule: 'border-stone-200',
      verseColor: 'text-[#111111]',
      markerColor: 'text-[#222222]',
      pageNumber: 'text-[#222222]',
      surahBannerBg: 'bg-[#f5f5f5] border-[#222222]',
      bismillahColor: 'text-[#111111]'
    }
  }[theme];

  // Calculate 15 formatted lines
  const fifteenLines: PageFifteenLine[] = React.useMemo(() => {
    return formatPageIntoFifteenLines(
      pageNumber,
      ayahs,
      primarySurah,
      effectiveTargets,
      activeBlankId || (effectiveTargets[0]?.id ?? null),
      pageData?.baseLines
    );
  }, [pageNumber, ayahs, primarySurah, effectiveTargets, activeBlankId, pageData?.baseLines]);

  // Clean English name for header (e.g. "Surah Yūsuf")
  const headerSurahName = primarySurah.englishName.startsWith('Surah')
    ? primarySurah.englishName
    : `Surah ${primarySurah.englishName}`;

  return (
    <div
      id={`mushaf-15line-page-${pageNumber}`}
      className={`relative w-full h-full max-h-full flex flex-col justify-between transition-all duration-300 p-1 sm:p-2 md:p-3 ${themeClasses.bg} rounded-xl sm:rounded-2xl overflow-hidden select-text`}
    >
      {/* Top Margin Header: Surah Name (Left), Settings Button (Inline), Juz/Hizb (Right) */}
      <div 
        id="page-top-margin" 
        className={`w-full flex items-center justify-between text-xs sm:text-sm font-semibold pb-1.5 mb-1 sm:mb-1.5 border-b select-none flex-shrink-0 opacity-90 ${themeClasses.headerRule} ${themeClasses.marginText}`}
      >
        <div className="font-serif font-bold tracking-normal text-xs sm:text-sm flex-1 text-left truncate">
          {headerSurahName}
        </div>

        {onOpenSettings && (
          <button
            id={`page-header-settings-btn-${pageNumber}`}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              onOpenSettings();
            }}
            className="flex-shrink-0 p-1 sm:p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-current transition-all cursor-pointer flex items-center justify-center relative active:scale-95 mx-2"
            title="Open Settings"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current opacity-80 hover:opacity-100" />
            {mistakesCount !== undefined && mistakesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center leading-none shadow-xs">
                {mistakesCount}
              </span>
            )}
          </button>
        )}

        <div className="font-serif font-bold text-xs sm:text-sm tracking-tight flex-1 text-right truncate">
          {hizbString || `Juz' ${juzNumber}`}
        </div>
      </div>

      {/* Expanded Medina Mushaf 15-Line Canvas - Distributed evenly with vertical row gap */}
      <div 
        id="mushaf-15-lines-grid" 
        className="w-full flex-1 min-h-0 mushaf-15-lines-grid overflow-hidden my-auto"
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(15, minmax(0, 1fr))',
          rowGap: 'clamp(4px, 0.7vh, 9px)',
          height: '100%',
          width: '100%'
        }}
        dir="rtl"
      >
        {fifteenLines.map((line) => {
          // 1. Surah Banner Header Line - Full width framed cartouche like reference
          if (line.type === 'surah-banner' && line.surahData) {
            return (
              <div
                key={`line_${line.lineNumber}_banner`}
                id={`mushaf-line-${line.lineNumber}`}
                className="w-full h-full flex items-center justify-center px-0.5 overflow-hidden"
              >
                <div
                  className={`w-full h-[86%] rounded border border-amber-900/30 dark:border-amber-500/30 flex items-center justify-between px-2.5 sm:px-4 ${themeClasses.surahBannerBg} shadow-2xs my-auto`}
                >
                  <span className="text-[10px] sm:text-xs font-arabic font-bold opacity-75 select-none">
                    {line.surahData.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'}
                  </span>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-amber-800 dark:text-amber-400 text-xs select-none">۞</span>
                    <span className="font-arabic font-extrabold text-xs sm:text-sm md:text-base tracking-wide">
                      سُورَةُ {line.surahData.name.replace('سُورَةُ', '').trim()}
                    </span>
                    <span className="text-amber-800 dark:text-amber-400 text-xs select-none">۞</span>
                  </div>

                  <span className="text-[10px] sm:text-xs font-arabic font-bold opacity-75 select-none">
                    {toArabicDigits(line.surahData.numberOfAyahs)} آيَاتُهَا
                  </span>
                </div>
              </div>
            );
          }

          // 2. Bismillah Header Line
          if (line.type === 'bismillah') {
            return (
              <div
                key={`line_${line.lineNumber}_bismillah`}
                id={`mushaf-line-${line.lineNumber}`}
                className="w-full h-full flex items-center justify-center px-0.5"
              >
                <div
                  className={`w-full h-full flex items-center justify-center text-center font-quran text-base sm:text-lg md:text-xl font-bold select-none leading-[1.4] ${themeClasses.bismillahColor}`}
                  style={{ letterSpacing: 'normal' }}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>
            );
          }

          // 3. Verse Text Line - True justified Arabic text flow with subtle kashida and even line height
          const rawItems = line.items || [];
          const isCentered = isLineCentered(rawItems);
          const items = applyKashidaToLine(rawItems, isCentered);

          return (
            <div
              key={`line_${line.lineNumber}`}
              id={`mushaf-line-${line.lineNumber}`}
              className="w-full h-full flex items-center justify-center select-text overflow-visible px-0.5"
              dir="rtl"
            >
              <div
                className={`w-full font-quran text-[clamp(13px,2.1vh,22px)] sm:text-[clamp(15px,2.3vh,25px)] md:text-[clamp(16px,2.5vh,27px)] leading-[1.4] sm:leading-[1.45] ${themeClasses.verseColor} select-text overflow-visible`}
                style={{
                  textAlign: isCentered ? 'center' : 'justify',
                  textAlignLast: isCentered ? 'center' : 'justify',
                  textJustify: 'auto',
                  wordSpacing: 'normal',
                  letterSpacing: 'normal'
                }}
              >
                {items.map((item, itemIdx) => {
                  const isLastItem = itemIdx === items.length - 1;

                  // Standard Word - Plain, single ink color throughout, visually compact
                  if (item.type === 'word') {
                    return (
                      <React.Fragment key={`l${line.lineNumber}_w${itemIdx}`}>
                        <span className="mushaf-word inline select-text">
                          {item.text}
                        </span>
                        {!isLastItem && ' '}
                      </React.Fragment>
                    );
                  }

                  // Rub El Hizb Quarter Symbol
                  if (item.type === 'rub-el-hizb') {
                    return (
                      <React.Fragment key={`l${line.lineNumber}_rub${itemIdx}`}>
                        <span
                          className="inline-flex items-center justify-center text-amber-700 dark:text-amber-400 text-[1.1em] font-serif select-none"
                          title="Rub El Hizb (Quarter Marker)"
                        >
                          ۞
                        </span>
                        {!isLastItem && ' '}
                      </React.Fragment>
                    );
                  }

                  // Ayah Number Rosette
                  if (item.type === 'ayah-number' && item.ayahNumberInSurah) {
                    return (
                      <React.Fragment key={`l${line.lineNumber}_num${itemIdx}`}>
                        <span
                          onClick={() => {
                            triggerHaptic('light');
                            if (item.fullAyah) onPlayAyahAudio?.(item.fullAyah);
                          }}
                          title={`Ayah ${item.ayahNumberInSurah} - Click to listen recitation`}
                          className="inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-115 active:scale-95 select-none align-middle"
                        >
                          <span className={`inline-flex items-center justify-center w-[1.25em] h-[1.25em] rounded-full border border-stone-800/70 dark:border-amber-400/80 text-[0.68em] font-serif font-bold ${themeClasses.markerColor} bg-amber-500/10 shadow-2xs leading-none`}>
                            {toArabicDigits(item.ayahNumberInSurah)}
                          </span>
                        </span>
                        {!isLastItem && ' '}
                      </React.Fragment>
                    );
                  }

                  // Blank Slot (Active, Inactive, or Answered)
                  if (item.type === 'blank-slot') {
                    const slotBlankId = item.blankId;
                    const slotBlankIndex = item.blankIndex || 1;
                    const slotIsActive = item.isActiveBlank;
                    const slotIsAnswered = item.isAnswered;
                    const slotIsCorrect = item.isCorrect;
                    const isContinuation = item.isContinuation;
                    const wordsCount = item.hiddenWordsCount || 1;
                    const dynamicMinWidth = Math.max(34, Math.min(wordsCount * 18, 85));

                    if (!slotIsAnswered) {
                      if (slotIsActive) {
                        return (
                          <React.Fragment key={`l${line.lineNumber}_blank${itemIdx}`}>
                            <span
                              id={`active-blank-slot-${slotBlankIndex}`}
                              onClick={() => slotBlankId && handleBlankClick?.(slotBlankId)}
                              className="inline-flex items-center justify-center relative px-1.5 py-0.5 border-b-[2.5px] border-red-600 dark:border-red-500 bg-red-500/15 dark:bg-red-950/40 rounded-t cursor-pointer align-middle select-none transition-colors"
                              style={{ minWidth: `${dynamicMinWidth}px` }}
                              title={`Active Blank ${slotBlankIndex} - Underlined in red. Select answer in the challenge panel.`}
                            >
                              <span className="font-sans font-bold text-[10px] sm:text-[11px] text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/70 px-1 py-0.5 rounded border border-red-400/60 dark:border-red-600/60 select-none text-center leading-none tracking-tight">
                                {isContinuation ? `(${slotBlankIndex} cont.)` : `(${slotBlankIndex})`}
                              </span>
                            </span>
                            {!isLastItem && ' '}
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment key={`l${line.lineNumber}_blank_inactive${itemIdx}`}>
                            <span
                              id={`inactive-blank-slot-${slotBlankIndex}`}
                              onClick={() => slotBlankId && handleBlankClick?.(slotBlankId)}
                              className="inline-flex items-center justify-center relative px-1.5 py-0.5 border-b border-red-400/60 dark:border-red-500/40 hover:border-red-600 bg-red-500/5 hover:bg-red-500/10 rounded-t cursor-pointer align-middle select-none transition-colors"
                              style={{ minWidth: `${dynamicMinWidth}px` }}
                              title={`Blank ${slotBlankIndex} - Underlined in red. Click to solve this verse.`}
                            >
                              <span className="font-sans font-semibold text-[10px] sm:text-[11px] text-red-600/90 dark:text-red-400/90 select-none text-center leading-none tracking-tight">
                                {isContinuation ? `(${slotBlankIndex} cont.)` : `(${slotBlankIndex})`}
                              </span>
                            </span>
                            {!isLastItem && ' '}
                          </React.Fragment>
                        );
                      }
                    } else {
                      return (
                        <React.Fragment key={`l${line.lineNumber}_resolved${itemIdx}`}>
                          <span
                            id={`resolved-blank-slot-${slotBlankIndex}`}
                            onClick={() => slotBlankId && handleBlankClick?.(slotBlankId)}
                            className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded font-quran font-bold align-middle text-[0.88em] whitespace-nowrap flex-shrink-0 cursor-pointer ${
                              slotIsCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-b-2 border-emerald-600 text-emerald-950 dark:text-emerald-100'
                                : 'bg-red-50 dark:bg-red-950/40 border-b-2 border-red-600 text-red-950 dark:text-red-100'
                            }`}
                            title={`Blank ${slotBlankIndex} (${slotIsCorrect ? 'Correct' : 'Incorrect'})`}
                          >
                            <span className={`font-sans text-[9px] sm:text-[10px] font-bold px-1 py-0.2 rounded select-none ${
                              slotIsCorrect ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60' : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60'
                            }`}>
                              ({slotBlankIndex}) {slotIsCorrect ? '✓' : '✗'}
                            </span>
                            <span>{item.text}</span>
                          </span>
                          {!isLastItem && ' '}
                        </React.Fragment>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>

        {/* Bottom Footer Margin: Centered Medina Page Number */}
        <div 
          id="page-bottom-margin" 
          className={`flex items-center justify-center text-xs sm:text-sm font-serif font-bold pt-0.5 select-none flex-shrink-0 opacity-75 ${themeClasses.marginText}`}
        >
          <span>{pageNumber}</span>
        </div>

      </div>
    );
  };
