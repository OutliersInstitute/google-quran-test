import React, { useState } from 'react';
import { Ayah, BlankTarget, MushafTheme, QuranPageData, PageFifteenLine, PageMarginConfig } from '../types';
import { formatPageIntoFifteenLines } from '../utils/fifteenLineEngine';
import { Settings, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AuthenticMushafPageProps {
  pageData: QuranPageData;
  blankTargets?: BlankTarget[];
  blankTarget?: BlankTarget | null;
  activeBlankId?: string | null;
  selectedOptionId?: string;
  isAnswered?: boolean;
  isCorrect?: boolean;
  theme: MushafTheme;
  pageMargins?: PageMarginConfig;
  onPlayAyahAudio?: (ayah: Ayah) => void;
  onSelectBlankId?: (blankId: string) => void;
  onSelectBlank?: (blankId: string) => void;
  onOpenSettings?: () => void;
  mistakesCount?: number;
  showTranslation?: boolean;
  isSecondaryPage?: boolean;
}

/**
 * Returns the CDN URL for high-resolution King Fahd Complex Medina Mushaf page scans.
 * Width 1260px provides razor-sharp rendering on Retina and 4K screens while loading rapidly.
 */
export function getMushafPageImageUrl(pageNumber: number): string {
  const bounded = Math.max(1, Math.min(604, pageNumber));
  const padded = String(bounded).padStart(3, '0');
  return `https://android.quran.com/data/width_1260/page${padded}.png`;
}

export const AuthenticMushafPage: React.FC<AuthenticMushafPageProps> = ({
  pageData,
  blankTargets = [],
  blankTarget,
  activeBlankId,
  selectedOptionId,
  isAnswered = false,
  isCorrect = false,
  theme,
  pageMargins,
  onPlayAyahAudio,
  onSelectBlankId,
  onSelectBlank,
  onOpenSettings,
  mistakesCount,
  showTranslation = false,
  isSecondaryPage = false
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const handleBlankClick = onSelectBlankId || onSelectBlank;

  const pageNumber = pageData?.pageNumber || 236;
  const primarySurah = pageData?.primarySurah || {
    number: 12,
    name: "سُورَةُ يُوسُفَ",
    englishName: "Surah Yūsuf",
    englishNameTranslation: "Joseph",
    revelationType: "Meccan" as const,
    numberOfAyahs: 111,
    ayahs: []
  };

  const imageUrl = getMushafPageImageUrl(pageNumber);

  // Targets for this page
  const effectiveTargets: BlankTarget[] = React.useMemo(() => {
    const list = blankTargets && blankTargets.length > 0 ? blankTargets : (blankTarget ? [blankTarget] : []);
    return list.filter(t => !t.pageNumber || t.pageNumber === pageNumber);
  }, [blankTargets, blankTarget, pageNumber]);

  // Format 15 lines so we know which lines contain blank targets for overlay positioning
  const fifteenLines: PageFifteenLine[] = React.useMemo(() => {
    return formatPageIntoFifteenLines(
      pageNumber,
      pageData?.ayahs || [],
      primarySurah,
      effectiveTargets,
      activeBlankId || (effectiveTargets[0]?.id ?? null),
      pageData?.baseLines
    );
  }, [pageNumber, pageData?.ayahs, primarySurah, effectiveTargets, activeBlankId, pageData?.baseLines]);

  // Clean English name for header
  const headerSurahName = primarySurah.englishName.startsWith('Surah')
    ? primarySurah.englishName
    : `Surah ${primarySurah.englishName}`;

  // Theme filter styling for authentic page image
  const themeContainerBg = {
    parchment: 'bg-[#fcf9f2] text-[#2c251e]',
    emerald: 'bg-[#f4f8f5] text-[#0f281e]',
    midnight: 'bg-[#15191c] text-[#f1ece1]',
    'classic-white': 'bg-[#ffffff] text-[#111111]'
  }[theme];

  // Visual filter for night mode / parchment tinting
  const imageFilterClass = {
    parchment: 'filter contrast-[1.03] sepia-[0.04]',
    emerald: 'filter contrast-[1.02] hue-rotate-[15deg]',
    midnight: 'filter invert-[0.88] hue-rotate-[180deg] contrast-[1.1] brightness-[0.9]',
    'classic-white': 'filter contrast-[1.05]'
  }[theme];

  // Dynamic margin padding style if configured
  const pageMarginStyle: React.CSSProperties = pageMargins ? {
    paddingLeft: `${Math.max(0, pageMargins.horizontalPadding - 10)}px`,
    paddingRight: `${Math.max(0, pageMargins.horizontalPadding - 10)}px`,
    paddingTop: `${pageMargins.verticalPadding}px`,
    paddingBottom: `${pageMargins.verticalPadding}px`,
  } : {};

  return (
    <div
      id={`authentic-mushaf-page-${pageNumber}`}
      style={pageMarginStyle}
      className={`relative w-full h-full max-h-full flex flex-col items-center justify-between transition-all duration-300 ${pageMargins ? '' : 'px-0 py-1 sm:py-1.5'} ${themeContainerBg} rounded-xl sm:rounded-2xl overflow-hidden select-none`}
    >
      {/* Top Floating Controls Bar */}
      <div 
        id="authentic-page-header-bar" 
        className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold pb-1 mb-0.5 border-b border-amber-900/15 dark:border-stone-700 select-none flex-shrink-0 opacity-90 px-3 z-20"
      >
        <div className="font-serif font-bold text-xs sm:text-sm flex-1 text-left truncate">
          {headerSurahName}
        </div>

        {onOpenSettings && (
          <button
            id={`authentic-page-settings-btn-${pageNumber}`}
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
          {pageData?.hizbString || `Juz' ${pageData?.juzNumber || 1}`}
        </div>
      </div>

      {/* Main Authentic King Fahd Complex Mushaf Canvas Container */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        
        {/* Loading Indicator while high-res image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-inherit">
            <Loader2 className="w-8 h-8 animate-spin text-amber-800 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-900/80 dark:text-amber-200">
              Loading Authentic Medina Page {pageNumber}...
            </span>
          </div>
        )}

        {/* Authentic Mushaf Page Image */}
        <div className="relative w-full h-full max-w-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={`Authentic Medina Mushaf Page ${pageNumber}`}
            className={`max-w-full max-h-full w-auto h-full object-contain pointer-events-none transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${imageFilterClass}`}
            loading="eager"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {/* Interactive Blank Targets Floating Indicators & Overlay */}
          {imageLoaded && effectiveTargets.length > 0 && (
            <div 
              id="authentic-page-blanks-overlay" 
              className="absolute inset-x-0 bottom-1 sm:bottom-2 flex items-center justify-center gap-1.5 sm:gap-2 px-2 z-20 pointer-events-auto"
            >
              {effectiveTargets.map((target) => {
                const isActive = target.id === activeBlankId;
                const slotIndex = target.blankIndex || 1;
                const isResolved = target.isAnswered;
                const isTargetCorrect = target.isCorrect;

                return (
                  <button
                    key={`authentic_blank_${target.id}`}
                    id={`authentic-blank-pill-${slotIndex}`}
                    onClick={() => {
                      triggerHaptic('light');
                      handleBlankClick?.(target.id);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer transform active:scale-95 ${
                      isActive
                        ? 'bg-amber-800 text-white ring-2 ring-amber-500 scale-105 shadow-lg'
                        : isResolved
                        ? isTargetCorrect
                          ? 'bg-emerald-700 text-white'
                          : 'bg-rose-700 text-white'
                        : 'bg-white/95 dark:bg-stone-800/95 text-stone-800 dark:text-stone-100 border border-amber-900/20 hover:bg-amber-50'
                    }`}
                    title={`Ayah ${target.ayahNumberInSurah} - Click to select in carousel`}
                  >
                    <span>Blank {slotIndex}</span>
                    <span className="text-[10px] opacity-80">(v. {target.ayahNumberInSurah})</span>
                    {isResolved && (
                      isTargetCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-200" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Fallback Notice if CDN is unreachable */}
        {imageError && (
          <div className="p-4 text-center text-rose-600 dark:text-rose-400 text-xs">
            Unable to load page scan. Please toggle to Digital Text Mode in Settings.
          </div>
        )}
      </div>

      {/* Footer Page Number */}
      <div 
        id="authentic-page-footer" 
        className="flex items-center justify-center text-xs sm:text-sm font-serif font-bold pt-0.5 select-none flex-shrink-0 opacity-75"
      >
        <span>{pageNumber}</span>
      </div>
    </div>
  );
};
