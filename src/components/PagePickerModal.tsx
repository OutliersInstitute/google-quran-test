import React, { useState } from 'react';
import { Layers, X, Target, Play, ChevronRight, CheckCircle2, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SURAH_METADATA_LIST, JUZ_PAGE_DEFINITIONS, getSurahPageRange } from '../data/surahList';
import { PageRangeConfig } from '../types';

interface PagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (pageNumber: number) => void;
  currentPageNumber: number;
  activeRange: PageRangeConfig | null;
  onSetRange: (range: PageRangeConfig | null) => void;
}

export const PagePickerModal: React.FC<PagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPage,
  currentPageNumber,
  activeRange,
  onSetRange,
}) => {
  const [activeTab, setActiveTab] = useState<'range' | 'juz' | 'surah' | 'direct'>('range');
  const [startPageInput, setStartPageInput] = useState<number>(activeRange?.startPage || currentPageNumber);
  const [endPageInput, setEndPageInput] = useState<number>(activeRange?.endPage || Math.min(currentPageNumber + 4, 604));
  const [directPageInput, setDirectPageInput] = useState<string>(String(currentPageNumber));
  const [surahSearch, setSurahSearch] = useState<string>('');

  if (!isOpen) return null;

  const handleStartCustomRange = () => {
    const s = Math.max(1, Math.min(604, Number(startPageInput) || 1));
    const e = Math.max(s, Math.min(604, Number(endPageInput) || s));
    onSetRange({
      enabled: true,
      startPage: s,
      endPage: e,
      title: `Pages ${s}–${e}`
    });
    onSelectPage(s);
    onClose();
  };

  const handleSelectJuzRange = (juzNum: number) => {
    const def = JUZ_PAGE_DEFINITIONS.find(j => j.juz === juzNum);
    if (!def) return;
    onSetRange({
      enabled: true,
      startPage: def.startPage,
      endPage: def.endPage,
      title: `Juz ${def.juz} (${def.name})`
    });
    onSelectPage(def.startPage);
    onClose();
  };

  const handleSelectSurahRange = (surahNum: number) => {
    const meta = SURAH_METADATA_LIST.find(s => s.number === surahNum);
    if (!meta) return;
    const { startPage, endPage } = getSurahPageRange(surahNum);
    onSetRange({
      enabled: true,
      startPage,
      endPage,
      title: `Surah ${meta.englishName} (p.${startPage}–${endPage})`
    });
    onSelectPage(startPage);
    onClose();
  };

  const handleDirectJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(directPageInput, 10);
    if (p >= 1 && p <= 604) {
      onSelectPage(p);
      onClose();
    }
  };

  const handleClearRange = () => {
    onSetRange(null);
  };

  const filteredSurahs = SURAH_METADATA_LIST.filter(s => {
    if (!surahSearch.trim()) return true;
    const q = surahSearch.toLowerCase();
    return (
      s.number.toString().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] rounded-2xl bg-amber-50 dark:bg-stone-900 border-2 border-amber-800/40 shadow-2xl flex flex-col overflow-hidden text-stone-800 dark:text-stone-100"
        >
          {/* Modal Header */}
          <div className="p-3.5 border-b border-amber-900/20 bg-amber-200/40 dark:bg-amber-950/50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-sm shadow-sm">
                <Target className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-amber-950 dark:text-amber-100 font-display">
                  PAGE & TEST RANGE SETTINGS
                </h3>
                <p className="text-xs text-amber-900/70 dark:text-amber-300/70 font-sans">
                  Define a start & end page to test sequentially with auto-advance
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-amber-200/50 hover:bg-amber-300/80 dark:bg-amber-900/40 dark:hover:bg-amber-800/60 text-amber-950 dark:text-amber-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Range Status Bar if active */}
          {activeRange?.enabled && (
            <div className="bg-emerald-100/90 dark:bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-950 dark:text-emerald-100 flex-shrink-0">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Active Test Range: {activeRange.title || `Pages ${activeRange.startPage}–${activeRange.endPage}`}</span>
                <span className="opacity-70 font-normal">({activeRange.endPage - activeRange.startPage + 1} pages total)</span>
              </div>
              <button
                onClick={handleClearRange}
                className="px-2 py-0.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-50 font-bold text-[11px] cursor-pointer shadow-xs"
              >
                Clear Range
              </button>
            </div>
          )}

          {/* Nav Tabs */}
          <div className="flex border-b border-amber-900/15 bg-amber-100/40 dark:bg-stone-800/60 p-1 gap-1 flex-shrink-0">
            <button
              onClick={() => setActiveTab('range')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'range'
                  ? 'bg-amber-800 text-amber-50 shadow-sm'
                  : 'text-amber-900 dark:text-amber-200 hover:bg-amber-200/50'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Custom Range</span>
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'juz'
                  ? 'bg-amber-800 text-amber-50 shadow-sm'
                  : 'text-amber-900 dark:text-amber-200 hover:bg-amber-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Juz Ranges (30)</span>
            </button>
            <button
              onClick={() => setActiveTab('surah')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'surah'
                  ? 'bg-amber-800 text-amber-50 shadow-sm'
                  : 'text-amber-900 dark:text-amber-200 hover:bg-amber-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Surah Ranges (114)</span>
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'direct'
                  ? 'bg-amber-800 text-amber-50 shadow-sm'
                  : 'text-amber-900 dark:text-amber-200 hover:bg-amber-200/50'
              }`}
            >
              <span>Single Page</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto p-4 max-h-[55vh]">
            {/* 1. Custom Range Tab */}
            {activeTab === 'range' && (
              <div className="flex flex-col gap-4">
                <div className="bg-amber-100/60 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-800/20">
                  <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100 font-display mb-1">
                    Set Test Page Range (1 to 604)
                  </h4>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed mb-3">
                    When active, testing will progress page-by-page from your start page to your end page. Once you complete all blanks on a page, it will automatically advance and generate test blanks on the next page!
                  </p>

                  <div className="grid grid-cols-2 gap-3 items-center mb-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-amber-900 dark:text-amber-200">Start Page (From):</label>
                      <input
                        type="number"
                        min="1"
                        max="604"
                        value={startPageInput}
                        onChange={(e) => setStartPageInput(Math.max(1, Math.min(604, parseInt(e.target.value) || 1)))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-amber-800/40 font-bold text-sm text-center shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-amber-900 dark:text-amber-200">End Page (To):</label>
                      <input
                        type="number"
                        min="1"
                        max="604"
                        value={endPageInput}
                        onChange={(e) => setEndPageInput(Math.max(1, Math.min(604, parseInt(e.target.value) || 1)))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-amber-800/40 font-bold text-sm text-center shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 py-1 px-1 border-t border-amber-900/10">
                    <span>Total Pages to Test: <strong className="text-amber-900 dark:text-amber-200 font-bold">{Math.max(1, endPageInput - startPageInput + 1)} pages</strong></span>
                    <span className="text-[11px] text-amber-800 dark:text-amber-300">Medina 15-line standard</span>
                  </div>

                  <button
                    onClick={handleStartCustomRange}
                    className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-amber-200 text-amber-200" />
                    <span>Start Test on Range (Page {startPageInput} → {endPageInput})</span>
                  </button>
                </div>

                {/* Popular Range Presets */}
                <div>
                  <h5 className="font-bold text-xs text-amber-950 dark:text-amber-200 mb-2 uppercase tracking-wide">
                    Quick Preset Ranges:
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => { setStartPageInput(582); setEndPageInput(604); }}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-900/15 text-left text-xs font-semibold cursor-pointer"
                    >
                      <div className="font-bold text-amber-950 dark:text-amber-100">Juz 'Amma (30)</div>
                      <div className="text-[10px] text-stone-500">Pages 582 – 604 (23 pages)</div>
                    </button>
                    <button
                      onClick={() => { setStartPageInput(562); setEndPageInput(581); }}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-900/15 text-left text-xs font-semibold cursor-pointer"
                    >
                      <div className="font-bold text-amber-950 dark:text-amber-100">Juz Tabārak (29)</div>
                      <div className="text-[10px] text-stone-500">Pages 562 – 581 (20 pages)</div>
                    </button>
                    <button
                      onClick={() => { setStartPageInput(293); setEndPageInput(304); }}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-900/15 text-left text-xs font-semibold cursor-pointer"
                    >
                      <div className="font-bold text-amber-950 dark:text-amber-100">Surah Al-Kahf</div>
                      <div className="text-[10px] text-stone-500">Pages 293 – 304 (12 pages)</div>
                    </button>
                    <button
                      onClick={() => { setStartPageInput(235); setEndPageInput(248); }}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-900/15 text-left text-xs font-semibold cursor-pointer"
                    >
                      <div className="font-bold text-amber-950 dark:text-amber-100">Surah Yusuf</div>
                      <div className="text-[10px] text-stone-500">Pages 235 – 248 (14 pages)</div>
                    </button>
                    <button
                      onClick={() => { setStartPageInput(440); setEndPageInput(445); }}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-900/15 text-left text-xs font-semibold cursor-pointer"
                    >
                      <div className="font-bold text-amber-950 dark:text-amber-100">Surah Ya-Sin</div>
                      <div className="text-[10px] text-stone-500">Pages 440 – 445 (6 pages)</div>
                    </button>
                    <button
                      onClick={() => { setStartPageInput(562); setEndPageInput(564); }}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-900/15 text-left text-xs font-semibold cursor-pointer"
                    >
                      <div className="font-bold text-amber-950 dark:text-amber-100">Surah Al-Mulk</div>
                      <div className="text-[10px] text-stone-500">Pages 562 – 564 (3 pages)</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Juz Ranges Tab (1 to 30) */}
            {activeTab === 'juz' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {JUZ_PAGE_DEFINITIONS.map((j) => {
                  const isCurrent = currentPageNumber >= j.startPage && currentPageNumber <= j.endPage;
                  const isRangeSelected = activeRange?.enabled && activeRange.startPage === j.startPage && activeRange.endPage === j.endPage;

                  return (
                    <button
                      key={`juz_range_${j.juz}`}
                      onClick={() => handleSelectJuzRange(j.juz)}
                      className={`p-2.5 rounded-xl border text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between ${
                        isRangeSelected
                          ? 'bg-amber-800 text-amber-50 border-amber-700 shadow-md ring-2 ring-amber-500'
                          : isCurrent
                          ? 'bg-amber-200/80 dark:bg-amber-950/60 border-amber-700 font-bold'
                          : 'bg-white dark:bg-stone-800 hover:bg-amber-100/60 border-amber-900/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Juz' {j.juz}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-semibold ${
                          isRangeSelected ? 'bg-amber-950 text-amber-200' : 'bg-amber-100 dark:bg-stone-700 text-amber-800 dark:text-amber-300'
                        }`}>
                          p. {j.startPage}–{j.endPage}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate mt-1 font-sans ${isRangeSelected ? 'text-amber-200' : 'text-stone-600 dark:text-stone-400'}`}>
                        {j.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. Surah Ranges Tab (1 to 114) */}
            {activeTab === 'surah' && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search Surah by name or number..."
                  value={surahSearch}
                  onChange={(e) => setSurahSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-amber-800/30 text-xs font-medium placeholder:text-stone-400 mb-1"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[44vh] overflow-y-auto">
                  {filteredSurahs.map((s) => {
                    const range = getSurahPageRange(s.number);
                    const isRangeSelected = activeRange?.enabled && activeRange.startPage === range.startPage && activeRange.endPage === range.endPage;

                    return (
                      <button
                        key={`surah_range_${s.number}`}
                        onClick={() => handleSelectSurahRange(s.number)}
                        className={`p-2 rounded-xl border text-left transition-all hover:bg-amber-100/60 dark:hover:bg-stone-800 flex items-center justify-between cursor-pointer ${
                          isRangeSelected
                            ? 'bg-amber-800 text-amber-50 border-amber-700 font-bold'
                            : 'bg-white dark:bg-stone-800/90 border-amber-900/15'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${
                            isRangeSelected ? 'bg-amber-950 text-amber-100' : 'bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200'
                          }`}>
                            {s.number}
                          </span>
                          <div>
                            <div className="font-bold text-xs">{s.englishName}</div>
                            <div className="text-[10px] opacity-70">
                              Pages {range.startPage}–{range.endPage} ({range.endPage - range.startPage + 1} p.)
                            </div>
                          </div>
                        </div>
                        <span className="font-arabic font-bold text-sm text-amber-900 dark:text-amber-300">
                          {s.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Direct Single Page Jump Tab */}
            {activeTab === 'direct' && (
              <div className="flex flex-col gap-4">
                <form onSubmit={handleDirectJump} className="bg-amber-100/50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-800/20 flex flex-col gap-3">
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
                    Jump directly to any single page (1 to 604):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="604"
                      value={directPageInput}
                      onChange={(e) => setDirectPageInput(e.target.value)}
                      placeholder="e.g. 235"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-amber-800/40 font-bold text-base text-center shadow-inner"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-sm cursor-pointer shadow-sm"
                    >
                      Jump
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
