import React from 'react';
import { Surah } from '../types';

interface SurahBannerProps {
  surah: Surah;
  showBismillah?: boolean;
}

export const SurahBanner: React.FC<SurahBannerProps> = ({ surah, showBismillah = true }) => {
  const displayBismillah = showBismillah && surah.number !== 9;

  return (
    <div id="surah-header-banner" className="w-full flex flex-col items-center my-2 select-none">
      
      {/* Traditional Ornate Surah Cartouche Frame matching Medina Mushaf */}
      <div className="relative w-full max-w-xl mx-auto px-2">
        
        <div className="relative border-[2px] border-[#3a2e22] bg-[#fcf9f2] rounded-lg p-2 flex items-center justify-between shadow-sm overflow-hidden">
          
          {/* Background subtle geometric line */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3a2e22_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Left Metadata / Ayah Count Badge */}
          <div className="flex flex-col items-center justify-center text-[10px] text-[#3a2e22] font-semibold px-2 py-0.5 border border-[#3a2e22]/40 rounded bg-amber-100/40 min-w-[54px]">
            <span className="font-bold text-xs">{surah.numberOfAyahs}</span>
            <span className="text-[9px]">آيَاتُهَا</span>
          </div>

          {/* Center Cartouche with Calligraphic Title */}
          <div className="flex-1 flex flex-col items-center justify-center mx-2 py-0.5 border-x border-[#3a2e22]/20">
            <div className="flex items-center gap-3">
              <span className="text-amber-800 text-sm">✦</span>
              <h2 className="font-arabic text-2xl sm:text-3xl font-extrabold text-[#241c14] tracking-wider">
                {surah.name}
              </h2>
              <span className="text-amber-800 text-sm">✦</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-[#4a3b2c] mt-0.5">
              {surah.englishName}
            </div>
          </div>

          {/* Right Metadata / Revelation Type Badge */}
          <div className="flex flex-col items-center justify-center text-[10px] text-[#3a2e22] font-semibold px-2 py-0.5 border border-[#3a2e22]/40 rounded bg-amber-100/40 min-w-[54px]">
            <span className="font-bold text-xs">{surah.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'}</span>
            <span className="text-[9px]">{surah.revelationType}</span>
          </div>
        </div>
      </div>

      {/* Bismillah Calligraphy */}
      {displayBismillah && (
        <div id="bismillah-calligraphy" className="w-full text-center mt-2 mb-1">
          <div className="font-quran text-2xl sm:text-3xl md:text-4xl text-[#1c1815] leading-relaxed font-bold tracking-wide">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}
    </div>
  );
};
