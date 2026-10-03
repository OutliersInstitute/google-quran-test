import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Send, Users, Sparkles } from 'lucide-react';
import { League, MushafTheme } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  theme: MushafTheme;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  isOpen,
  onClose,
  league,
  theme,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const shareText = `Assalamu Alaikum! Join our private Quran memorization league "${league.name}" on Mushaf Hafiz. Goal: ${league.target.description}. Use invite code: ${league.inviteCode}`;

  const handleCopyCode = () => {
    triggerHaptic('celebrate');
    navigator.clipboard?.writeText(league.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyInviteMessage = () => {
    triggerHaptic('celebrate');
    const appUrl = window.location.origin;
    navigator.clipboard?.writeText(`${shareText}\n${appUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    triggerHaptic('medium');
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
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
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">Invite Friends to League</h2>
              <p className="text-xs opacity-75">{league.name}</p>
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

        {/* Card Body */}
        <div className="p-6 space-y-6">
          
          {/* Shareable Invite Card Visual */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 text-amber-50 shadow-md space-y-3 text-center relative overflow-hidden">
            <div className="text-[11px] uppercase tracking-widest font-bold opacity-80">
              Private Hifz League Invite
            </div>
            
            <div className="font-display font-extrabold text-xl text-balance">
              {league.name}
            </div>

            <div className="text-xs opacity-90 px-2 leading-relaxed">
              {league.target.description}
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                Shareable Code:
              </span>
              <div className="mt-1 font-mono text-2xl font-black tracking-widest bg-black/30 py-2 px-4 rounded-xl border border-white/20 inline-block">
                {league.inviteCode}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleCopyCode}
              className="w-full py-3 px-4 rounded-xl border border-amber-900/20 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Invite Code ({league.inviteCode})</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyInviteMessage}
              className="w-full py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-700 active:scale-98 text-amber-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Full Invitation Copied!</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Copy Full Invitation Message</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </button>
          </div>

          <p className="text-center text-[11px] opacity-65 leading-relaxed">
            Friends can enter this invite code in the <strong>Join League</strong> tab to instantly join your leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};
