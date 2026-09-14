import React, { useState, useMemo } from 'react';
import { SURAH_METADATA_LIST, SurahMeta } from '../data/surahList';
import { Search, X, BookOpen, Star, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SurahPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number) => void;
  currentSurahNumber: number;
}

const POPULAR_SURAHS = [1, 67, 18, 36, 55, 56, 78, 93, 97, 108, 109, 112, 113, 114];

export const SurahPickerModal: React.FC<SurahPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
  currentSurahNumber,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'juz30' | 'juz29' | 'meccan' | 'medinan'>('all');

  const filteredSurahs = useMemo(() => {
    return SURAH_METADATA_LIST.filter((surah) => {
      const matchesSearch =
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.includes(searchQuery) ||
        surah.number.toString() === searchQuery.trim();

      if (!matchesSearch) return false;

      if (filterType === 'popular') {
        return POPULAR_SURAHS.includes(surah.number);
      }
      if (filterType === 'juz30') {
        return surah.number >= 78;
      }
      if (filterType === 'juz29') {
        return surah.number >= 67 && surah.number <= 77;
      }
      if (filterType === 'meccan') {
        return surah.revelationType === 'Meccan';
      }
      if (filterType === 'medinan') {
        return surah.revelationType === 'Medinan';
      }

      return true;
    });
  }, [searchQuery, filterType]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-amber-50 border-2 border-amber-800/40 shadow-2xl flex flex-col overflow-hidden text-stone-800"
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amber-900/20 bg-gradient-to-r from-amber-200/40 via-amber-100/70 to-amber-200/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-amber-950 font-display">CHOOSE SURAH</h3>
                <p className="text-xs text-amber-900/70">Select any of the 114 Surahs of the Holy Quran to practice</p>
              </div>
            </div>

            <button
              id="close-surah-picker-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-amber-200/50 hover:bg-amber-300/80 text-amber-950 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search and Filter Toolbar */}
          <div className="p-3 sm:p-4 border-b border-amber-900/15 bg-amber-100/30 flex flex-col gap-2.5">
            
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-800/60" />
              <input
                id="search-surah-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Surah name (e.g. Mulk, Fatihah), number (1-114)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-amber-800/30 focus:border-amber-600 focus:outline-none text-sm text-stone-900 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-700 hover:text-amber-900 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filter Categories */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'all' ? 'bg-amber-800 text-amber-50 font-semibold' : 'bg-amber-200/40 text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                All 114
              </button>
              <button
                onClick={() => setFilterType('popular')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  filterType === 'popular' ? 'bg-amber-800 text-amber-50 font-semibold' : 'bg-amber-200/40 text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                <Star className="w-3 h-3 text-amber-400" />
                <span>Popular</span>
              </button>
              <button
                onClick={() => setFilterType('juz30')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'juz30' ? 'bg-amber-800 text-amber-50 font-semibold' : 'bg-amber-200/40 text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                Juz 'Amma (30)
              </button>
              <button
                onClick={() => setFilterType('juz29')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'juz29' ? 'bg-amber-800 text-amber-50 font-semibold' : 'bg-amber-200/40 text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                Juz Tabārak (29)
              </button>
              <button
                onClick={() => setFilterType('meccan')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'meccan' ? 'bg-amber-800 text-amber-50 font-semibold' : 'bg-amber-200/40 text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                Meccan
              </button>
              <button
                onClick={() => setFilterType('medinan')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'medinan' ? 'bg-amber-800 text-amber-50 font-semibold' : 'bg-amber-200/40 text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                Medinan
              </button>
            </div>

          </div>

          {/* Surah Grid List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh]">
            {filteredSurahs.map((s) => {
              const isSelected = s.number === currentSurahNumber;

              return (
                <button
                  key={`surah_item_${s.number}`}
                  id={`select-surah-${s.number}`}
                  onClick={() => {
                    onSelectSurah(s.number);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                    isSelected
                      ? 'bg-amber-200/80 border-amber-700 shadow-md ring-2 ring-amber-600/40'
                      : 'bg-white hover:bg-amber-100/50 border-amber-900/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-900 border border-amber-800/20'
                    }`}>
                      {s.number}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                        <span>{s.englishName}</span>
                        {POPULAR_SURAHS.includes(s.number) && (
                          <Sparkles className="w-3 h-3 text-amber-600 inline" />
                        )}
                      </div>
                      <div className="text-xs text-stone-500">
                        {s.englishNameTranslation} • {s.numberOfAyahs} ayahs
                      </div>
                      <div className="text-[10px] text-amber-800/75 font-semibold mt-0.5">
                        Page {s.page} • Juz {s.juz} • {s.revelationType}
                      </div>
                    </div>
                  </div>

                  {/* Arabic Name */}
                  <div className="font-arabic font-bold text-lg text-amber-900 text-right pr-1 flex-shrink-0">
                    {s.name}
                  </div>
                </button>
              );
            })}

            {filteredSurahs.length === 0 && (
              <div className="col-span-full py-8 text-center text-stone-500 text-sm">
                No Surahs found matching "{searchQuery}". Try searching by number (e.g. 67) or name (e.g. Mulk).
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-amber-100/40 border-t border-amber-900/15 text-center text-xs text-amber-900/70">
            Click any Surah to instantly load its authentic Mushaf page and test your memorization!
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
