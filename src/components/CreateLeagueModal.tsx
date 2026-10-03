import React, { useState } from 'react';
import { 
  X, Users, Sparkles, Target, Calendar, BookOpen, Layers, 
  ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { LeagueChallengeStructure, LeagueRangeType, LeagueTarget, MushafTheme } from '../types';
import { SURAH_METADATA_LIST, JUZ_PAGE_DEFINITIONS } from '../data/surahList';
import { triggerHaptic } from '../utils/haptics';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLeague: (data: {
    name: string;
    description: string;
    challengeStructure: LeagueChallengeStructure;
    target: LeagueTarget;
    durationDays?: number;
  }) => void;
  theme: MushafTheme;
}

export const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({
  isOpen,
  onClose,
  onCreateLeague,
  theme,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [challengeStructure, setChallengeStructure] = useState<LeagueChallengeStructure>('monthly');
  const [rangeType, setRangeType] = useState<LeagueRangeType>('juz');
  
  // Target parameters
  const [selectedJuz, setSelectedJuz] = useState<number>(30);
  const [startSurah, setStartSurah] = useState<number>(78);
  const [endSurah, setEndSurah] = useState<number>(114);
  const [singleSurah, setSingleSurah] = useState<number>(67);
  const [targetPagesCount, setTargetPagesCount] = useState<number>(20);
  const [targetAyahsCount, setTargetAyahsCount] = useState<number>(10);
  const [targetPagesStart, setTargetPagesStart] = useState<number>(582);
  const [targetPagesEnd, setTargetPagesEnd] = useState<number>(604);
  const [durationDays, setDurationDays] = useState<number>(30);

  if (!isOpen) return null;

  // Preset suggestions
  const presetTemplates = [
    {
      title: 'Juz Amma Monthly Sprint',
      name: "Juz 'Amma Companions",
      desc: 'Master the 37 short Surahs of Juz 30 together this month.',
      structure: 'monthly' as LeagueChallengeStructure,
      rangeType: 'juz' as LeagueRangeType,
      juz: 30,
    },
    {
      title: 'Fajr 10-Ayahs Daily Habit',
      name: 'Fajr Memorization Circle',
      desc: 'Consistency over volume: at least 10 ayahs tested every single morning.',
      structure: 'daily' as LeagueChallengeStructure,
      rangeType: 'ayahs-count' as LeagueRangeType,
      ayahs: 10,
    },
    {
      title: 'Surah Al-Mulk Mastery',
      name: 'Al-Mulk Protectors',
      desc: 'Memorize & perfect all 30 verses of Surah Al-Mulk.',
      structure: 'fixed-goal' as LeagueChallengeStructure,
      rangeType: 'single-surah' as LeagueRangeType,
      surah: 67,
    },
    {
      title: '20 Pages Weekly Revision',
      name: 'Weekly Muraja’ah League',
      desc: 'Solidify your retention with 20 pages reviewed every week.',
      structure: 'weekly' as LeagueChallengeStructure,
      rangeType: 'pages-range' as LeagueRangeType,
      pages: 20,
    },
  ];

  const handleApplyPreset = (preset: typeof presetTemplates[0]) => {
    triggerHaptic('medium');
    setName(preset.name);
    setDescription(preset.desc);
    setChallengeStructure(preset.structure);
    setRangeType(preset.rangeType);
    if (preset.juz) setSelectedJuz(preset.juz);
    if (preset.ayahs) setTargetAyahsCount(preset.ayahs);
    if (preset.surah) setSingleSurah(preset.surah);
    if (preset.pages) setTargetPagesCount(preset.pages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    triggerHaptic('celebrate');

    let target: LeagueTarget;

    if (rangeType === 'juz') {
      const juzDef = JUZ_PAGE_DEFINITIONS.find(j => j.juz === selectedJuz) || JUZ_PAGE_DEFINITIONS[29];
      target = {
        rangeType: 'juz',
        description: `Master Juz ${selectedJuz} (${juzDef.name}) - Pages ${juzDef.startPage} to ${juzDef.endPage}`,
        targetAmount: juzDef.endPage - juzDef.startPage + 1,
        targetUnit: 'pages',
        selectedJuz,
        startPage: juzDef.startPage,
        endPage: juzDef.endPage,
      };
    } else if (rangeType === 'surahs') {
      const startS = SURAH_METADATA_LIST.find(s => s.number === startSurah);
      const endS = SURAH_METADATA_LIST.find(s => s.number === endSurah);
      const sPage = startS?.page || 1;
      const ePage = endS?.page || 604;
      target = {
        rangeType: 'surahs',
        description: `Complete Surahs ${startS?.englishName || startSurah} through ${endS?.englishName || endSurah}`,
        targetAmount: Math.abs(endSurah - startSurah) + 1,
        targetUnit: 'surahs',
        startSurah,
        endSurah,
        startSurahName: startS?.englishName,
        endSurahName: endS?.englishName,
        startPage: Math.min(sPage, ePage),
        endPage: Math.max(sPage, ePage),
      };
    } else if (rangeType === 'single-surah') {
      const sObj = SURAH_METADATA_LIST.find(s => s.number === singleSurah);
      target = {
        rangeType: 'single-surah',
        description: `Master Surah ${sObj?.number}. ${sObj?.englishName} (${sObj?.name})`,
        targetAmount: sObj?.numberOfAyahs || 30,
        targetUnit: 'ayahs',
        startSurah: singleSurah,
        startSurahName: sObj?.englishName,
        startPage: sObj?.page || 1,
        endPage: sObj?.page ? sObj.page + 2 : 3,
      };
    } else if (rangeType === 'ayahs-count') {
      target = {
        rangeType: 'ayahs-count',
        description: `Practice at least ${targetAyahsCount} ayahs ${challengeStructure === 'daily' ? 'every day' : 'regularly'}`,
        targetAmount: targetAyahsCount,
        targetUnit: 'ayahs',
        startPage: 1,
        endPage: 604,
      };
    } else {
      // pages-range
      target = {
        rangeType: 'pages-range',
        description: `Complete pages ${targetPagesStart} to ${targetPagesEnd} (${targetPagesEnd - targetPagesStart + 1} pages)`,
        targetAmount: Math.max(1, targetPagesEnd - targetPagesStart + 1),
        targetUnit: 'pages',
        startPage: targetPagesStart,
        endPage: targetPagesEnd,
      };
    }

    onCreateLeague({
      name: name.trim(),
      description: description.trim() || `Private Quran Hifz League: ${target.description}`,
      challengeStructure,
      target,
      durationDays: challengeStructure === 'fixed-goal' ? durationDays : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#faf7f0] dark:bg-[#161b20] text-stone-900 dark:text-stone-100 border border-amber-900/20 dark:border-stone-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/10 dark:border-stone-800 bg-[#f4eee0] dark:bg-[#12161a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">Create Private Quran League</h2>
              <p className="text-xs opacity-75">Define challenge goals and invite friends with a code</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Preset Templates */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended League Templates</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetTemplates.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-3 rounded-2xl border border-amber-900/10 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 hover:border-amber-700/40 text-left transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="font-bold text-xs group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {p.title}
                  </div>
                  <div className="text-[11px] opacity-70 mt-1 line-clamp-2">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: League Basics */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
              1. League Name & Vision
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fajr Hifz Circle, Juz Amma Sprint, Kahf Brothers"
              className="w-full px-4 py-3 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/50"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description or encouragement for your circle..."
              className="w-full px-4 py-2.5 rounded-xl border border-amber-900/15 dark:border-stone-700 bg-white/60 dark:bg-stone-900/60 text-xs focus:outline-none focus:ring-2 focus:ring-amber-700/50"
            />
          </div>

          {/* Section 2: Challenge Structure (Daily vs Long-Term) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
              2. Challenge Duration & Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'daily', label: 'Daily Challenge', sub: 'Target resets every day' },
                { id: 'weekly', label: 'Weekly Challenge', sub: 'Target resets every week' },
                { id: 'monthly', label: 'Monthly Challenge', sub: 'Sprint across the month' },
                { id: 'fixed-goal', label: 'Fixed Goal', sub: 'Until target is completed' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setChallengeStructure(s.id as LeagueChallengeStructure);
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    challengeStructure === s.id
                      ? 'border-amber-800 bg-amber-800 text-amber-50 shadow-xs'
                      : 'border-amber-900/10 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="font-bold text-xs">{s.label}</span>
                  <span className="text-[10px] opacity-80 mt-1">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Quran Range Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
              3. Quran Range to Memorize / Revise
            </label>
            
            <div className="flex flex-wrap gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-2xl text-xs">
              {[
                { id: 'juz', label: 'Whole Juz' },
                { id: 'single-surah', label: 'Specific Surah' },
                { id: 'surahs', label: 'Range of Surahs' },
                { id: 'pages-range', label: 'Page Range' },
                { id: 'ayahs-count', label: 'Daily Ayahs Quota' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setRangeType(r.id as LeagueRangeType);
                  }}
                  className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-bold transition-all cursor-pointer text-center ${
                    rangeType === r.id
                      ? 'bg-amber-800 text-amber-50 shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-75'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Range specific inputs */}
            <div className="p-4 rounded-2xl border border-amber-900/15 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 space-y-4">
              {rangeType === 'juz' && (
                <div className="space-y-2">
                  <span className="text-xs font-medium">Select Juz (1 - 30):</span>
                  <select
                    value={selectedJuz}
                    onChange={(e) => setSelectedJuz(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-semibold"
                  >
                    {JUZ_PAGE_DEFINITIONS.map((j) => (
                      <option key={j.juz} value={j.juz}>
                        Juz {j.juz} — {j.name} (p. {j.startPage} - {j.endPage})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {rangeType === 'single-surah' && (
                <div className="space-y-2">
                  <span className="text-xs font-medium">Select Surah:</span>
                  <select
                    value={singleSurah}
                    onChange={(e) => setSingleSurah(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-semibold"
                  >
                    {SURAH_METADATA_LIST.map((s) => (
                      <option key={s.number} value={s.number}>
                        {s.number}. {s.englishName} ({s.name}) — {s.numberOfAyahs} Ayahs
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {rangeType === 'surahs' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium">From Surah:</span>
                    <select
                      value={startSurah}
                      onChange={(e) => setStartSurah(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold"
                    >
                      {SURAH_METADATA_LIST.map((s) => (
                        <option key={s.number} value={s.number}>
                          {s.number}. {s.englishName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium">To Surah:</span>
                    <select
                      value={endSurah}
                      onChange={(e) => setEndSurah(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold"
                    >
                      {SURAH_METADATA_LIST.map((s) => (
                        <option key={s.number} value={s.number}>
                          {s.number}. {s.englishName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {rangeType === 'pages-range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium">Start Medina Page (1 - 604):</span>
                    <input
                      type="number"
                      min={1}
                      max={604}
                      value={targetPagesStart}
                      onChange={(e) => setTargetPagesStart(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium">End Medina Page (1 - 604):</span>
                    <input
                      type="number"
                      min={1}
                      max={604}
                      value={targetPagesEnd}
                      onChange={(e) => setTargetPagesEnd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-semibold"
                    />
                  </div>
                </div>
              )}

              {rangeType === 'ayahs-count' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Daily Ayahs Quota:</span>
                    <span className="font-bold font-mono text-amber-800 dark:text-amber-400">{targetAyahsCount} Ayahs</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={targetAyahsCount}
                    onChange={(e) => setTargetAyahsCount(Number(e.target.value))}
                    className="w-full accent-amber-800"
                  />
                  <div className="flex justify-between text-[10px] opacity-60">
                    <span>5 Ayahs</span>
                    <span>20 Ayahs</span>
                    <span>50 Ayahs</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-800 hover:bg-amber-700 active:scale-98 text-amber-50 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Create League & Generate Invite Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
