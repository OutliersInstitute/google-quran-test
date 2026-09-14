import React from 'react';
import { BlankTarget, Surah, Ayah } from '../types';
import { toArabicDigits } from '../services/quranApi';
import { Sparkles, Volume2, HelpCircle, Check, X } from 'lucide-react';

interface MushafPageProps {
  surah: Surah;
  blankTarget: BlankTarget | null;
  selectedOptionId?: string;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelectBlank?: (blankId: string) => void;
  onPlayAyahAudio?: (ayah: Ayah) => void;
  showTranslation?: boolean;
}

export const MushafPage: React.FC<MushafPageProps> = ({
  surah,
  blankTarget,
  selectedOptionId,
  isAnswered,
  isCorrect,
  onSelectBlank,
  onPlayAyahAudio,
  showTranslation = false,
}) => {
  return (
    <div id="mushaf-text-flow" className="relative w-full py-2 px-1 sm:px-3 text-right" dir="rtl">
      
      {/* Quran Verses Paragraph Layout */}
      <div 
        className="font-quran text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-[2.9] sm:leading-[3.1] md:leading-[3.3] text-justify selection:bg-amber-300"
        style={{ textJustify: 'inter-word' }}
      >
        
        {surah.ayahs.map((ayah, index) => {
          const isTargetAyah = blankTarget?.ayahIndex === index;

          // If NOT target ayah, render normal verse with end marker
          if (!isTargetAyah) {
            return (
              <span key={`ayah_${ayah.number}`} className="group relative inline-block mx-0.5 hover:text-amber-950 transition-colors">
                <span>{ayah.text}</span>
                
                {/* Traditional Ayah End Symbol with Arabic Number */}
                <span 
                  id={`ayah-end-marker-${ayah.numberInSurah}`}
                  onClick={() => onPlayAyahAudio?.(ayah)}
                  title={`Ayah ${ayah.numberInSurah} - Click to listen`}
                  className="ayah-symbol inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-115 active:scale-95 text-amber-800 font-bold mx-1.5 align-middle select-none"
                >
                  <span className="relative text-xl sm:text-2xl text-amber-800/90 font-serif">
                    ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                  </span>
                </span>
              </span>
            );
          }

          // TARGET AYAH (HIDING FULL OR PORTION)
          const target = blankTarget!;

          return (
            <span
              key={`target_ayah_${ayah.number}`}
              className="inline"
            >
              {/* If Portion: Show visible prefix */}
              {target.hiddenType === 'portion' && target.visiblePrefix && (
                <span className="text-stone-900 ml-1 font-quran">{target.visiblePrefix} </span>
              )}

              {/* The Blank Interactive Slot */}
              {!isAnswered ? (
                <span
                  id="active-missing-blank"
                  onClick={() => onSelectBlank?.(target.id)}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-1 my-1 mx-1.5 rounded-xl border-2 border-dashed border-amber-600 bg-amber-200/50 hover:bg-amber-300/60 transition-all duration-300 shadow-md cursor-pointer align-middle"
                  title="Missing verse - select from the carousel below"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="font-arabic font-bold text-lg sm:text-xl md:text-2xl text-amber-950 px-1">
                    [ ؟؟؟ اخْتَرِ التَّكْمِلَة ]
                  </span>
                </span>
              ) : (
                /* When Answered: Show Result Feedback */
                <span
                  id="resolved-blank-text"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg font-quran transition-all duration-500 mx-1 align-middle ${
                    isCorrect
                      ? 'bg-emerald-100/90 border border-emerald-500 text-emerald-950 shadow-md shadow-emerald-700/10'
                      : 'bg-rose-100/90 border border-rose-400 text-rose-950 shadow-md'
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-emerald-700 inline" />
                  ) : (
                    <X className="w-5 h-5 text-rose-600 inline" />
                  )}
                  <span className="font-bold">{target.hiddenText}</span>
                </span>
              )}

              {/* Ayah End Marker */}
              <span
                id={`ayah-end-marker-${ayah.numberInSurah}`}
                onClick={() => onPlayAyahAudio?.(ayah)}
                title={`Ayah ${ayah.numberInSurah} - Click to listen`}
                className="ayah-symbol inline-flex items-center justify-center cursor-pointer hover:scale-110 text-amber-800 font-bold mx-1.5 align-middle select-none"
              >
                <span className="relative text-xl sm:text-2xl text-amber-800/90 font-serif">
                  ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                </span>
              </span>
            </span>
          );
        })}

      </div>

      {/* Optional English Translation Footnote / Overlay if requested */}
      {showTranslation && blankTarget && (
        <div id="mushaf-translation-card" className="mt-6 p-4 rounded-xl bg-amber-50/90 border border-amber-900/20 text-left font-sans text-stone-700" dir="ltr">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900/80 mb-1">
            <span>Translation Context (Ayah {blankTarget.ayahNumberInSurah}):</span>
            <button
              onClick={() => onPlayAyahAudio?.(blankTarget.fullAyah)}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-900 text-xs font-medium cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>
          <p className="text-sm italic leading-relaxed text-stone-800">
            "{blankTarget.fullAyah.translation}"
          </p>
        </div>
      )}

    </div>
  );
};
