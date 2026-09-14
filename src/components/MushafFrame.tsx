import React from 'react';
import { MushafTheme } from '../types';

interface MushafFrameProps {
  theme: MushafTheme;
  children: React.ReactNode;
  juzNumber?: number;
  surahNameArabic?: string;
  pageNumber?: number;
}

export const MushafFrame: React.FC<MushafFrameProps> = ({
  theme,
  children,
  juzNumber = 1,
  surahNameArabic = "سُورَةُ الفَاتِحَة",
  pageNumber = 1,
}) => {
  // Theme color maps
  const themeStyles = {
    parchment: {
      outerBg: "bg-amber-100/40",
      pageBg: "mushaf-paper text-stone-900 border-amber-900/30",
      borderGold: "#b58729",
      borderInner: "border-amber-800/40",
      accentBg: "bg-amber-900/5",
      headerText: "text-amber-950/80",
      ornamentStroke: "#8c6517",
      glow: "shadow-2xl shadow-amber-950/15"
    },
    emerald: {
      outerBg: "bg-emerald-950/10",
      pageBg: "bg-[#f5f9f6] text-emerald-950 border-emerald-900/30",
      borderGold: "#c59a3f",
      borderInner: "border-emerald-800/40",
      accentBg: "bg-emerald-900/5",
      headerText: "text-emerald-900",
      ornamentStroke: "#2d6a4f",
      glow: "shadow-2xl shadow-emerald-950/20"
    },
    midnight: {
      outerBg: "bg-slate-950",
      pageBg: "mushaf-paper-night text-amber-50 border-amber-500/30",
      borderGold: "#d4af37",
      borderInner: "border-amber-400/30",
      accentBg: "bg-amber-400/5",
      headerText: "text-amber-300",
      ornamentStroke: "#d4af37",
      glow: "shadow-2xl shadow-black/60"
    },
    'classic-white': {
      outerBg: "bg-stone-100",
      pageBg: "bg-white text-stone-900 border-stone-300",
      borderGold: "#a37014",
      borderInner: "border-stone-400/50",
      accentBg: "bg-stone-50",
      headerText: "text-stone-800",
      ornamentStroke: "#785310",
      glow: "shadow-xl shadow-stone-400/20"
    }
  }[theme];

  return (
    <div id="mushaf-container" className="relative w-full max-w-4xl mx-auto my-2">
      {/* Authentic Mushaf Page Outer Frame */}
      <div className={`relative rounded-2xl p-3 sm:p-5 md:p-7 transition-all duration-300 ${themeStyles.pageBg} ${themeStyles.glow} border-[3px]`}>
        
        {/* Top Quranic Page Header Ribbon (Juz, Surah Name, Page) */}
        <div id="mushaf-top-bar" className="flex items-center justify-between border-b pb-2 mb-4 px-2 sm:px-4 text-xs sm:text-sm font-medium tracking-wide border-amber-900/20">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rotate-45 border border-amber-700/60 bg-amber-500/20"></span>
            <span className={`font-semibold ${themeStyles.headerText}`}>
              الجزء {juzNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`font-arabic text-base sm:text-lg font-bold ${themeStyles.headerText}`}>
              {surahNameArabic}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`font-semibold ${themeStyles.headerText}`}>
              صفحة {pageNumber}
            </span>
            <span className="inline-block w-2.5 h-2.5 rotate-45 border border-amber-700/60 bg-amber-500/20"></span>
          </div>
        </div>

        {/* Traditional Double Ornate Outer Border */}
        <div className={`relative p-3 sm:p-5 md:p-6 rounded-lg border-2 ${themeStyles.borderInner}`}>
          
          {/* Islamic Corner Arabesque Rosettes */}
          {/* Top Left */}
          <div className="absolute -top-3 -left-3 w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-700/80">
              <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
              <circle cx="12" cy="12" r="3" fill="#f59e0b" />
            </svg>
          </div>
          {/* Top Right */}
          <div className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-700/80">
              <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
              <circle cx="12" cy="12" r="3" fill="#f59e0b" />
            </svg>
          </div>
          {/* Bottom Left */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-700/80">
              <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
              <circle cx="12" cy="12" r="3" fill="#f59e0b" />
            </svg>
          </div>
          {/* Bottom Right */}
          <div className="absolute -bottom-3 -right-3 w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-700/80">
              <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
              <circle cx="12" cy="12" r="3" fill="#f59e0b" />
            </svg>
          </div>

          {/* Inner Content Area */}
          <div className="relative">
            {children}
          </div>
        </div>

        {/* Bottom Page Number Badge */}
        <div className="flex justify-center mt-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-amber-900/20 bg-amber-500/10 text-xs font-semibold text-amber-900/80">
            <span>﴿ {pageNumber} ﴾</span>
          </div>
        </div>

      </div>
    </div>
  );
};
