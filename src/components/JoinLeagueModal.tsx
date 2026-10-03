import React, { useState } from 'react';
import { X, Users, KeyRound, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { League, MushafTheme } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface JoinLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinCode: (code: string) => void;
  availableLeagues: League[];
  theme: MushafTheme;
}

export const JoinLeagueModal: React.FC<JoinLeagueModalProps> = ({
  isOpen,
  onClose,
  onJoinCode,
  availableLeagues,
  theme,
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    triggerHaptic('medium');
    onJoinCode(code.trim().toUpperCase());
    onClose();
  };

  const isMoonstone = theme === 'moonstone';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${
          isMoonstone 
            ? 'bg-white text-[#20373B] border-2 border-[#519CAB]/30' 
            : 'bg-[#faf7f0] dark:bg-[#161b20] text-stone-900 dark:text-stone-100 border border-amber-900/20 dark:border-stone-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isMoonstone 
            ? 'bg-white border-[#519CAB]/20 text-[#20373B]' 
            : 'border-amber-900/10 dark:border-stone-800 bg-[#f4eee0] dark:bg-[#12161a]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              isMoonstone ? 'bg-[#519CAB] text-white' : 'bg-amber-800 text-amber-100'
            }`}>
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">Join Private League</h2>
              <p className="text-xs opacity-75">Enter the invite code from your friend</p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-80 mb-2">
                League Invite Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AMMA-7860 or FAJR-1010"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-amber-900/30 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono font-bold text-center tracking-widest text-lg uppercase focus:outline-none focus:ring-2 focus:ring-amber-700/50"
                  autoFocus
                />
              </div>
              <p className="text-[11px] opacity-65 mt-1.5 text-center">
                Invite codes are formatted like <span className="font-mono font-bold">CODE-1234</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={!code.trim()}
              className={`w-full py-3.5 px-6 rounded-2xl disabled:opacity-50 active:scale-98 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isMoonstone ? 'bg-[#519CAB] hover:bg-[#438795] text-white' : 'bg-amber-800 hover:bg-amber-700 text-amber-50'
              }`}
            >
              <span>Join Circle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Existing Available Circles */}
          {availableLeagues.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-amber-900/10 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Or switch to an active circle:</span>
              </span>
              <div className="space-y-1.5">
                {availableLeagues.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      triggerHaptic('light');
                      onJoinCode(l.inviteCode);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl border border-amber-900/10 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 hover:border-amber-700/40 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs">{l.name}</div>
                      <div className="text-[10px] opacity-70 font-mono">Code: {l.inviteCode}</div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">
                      {l.members.length} members
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
