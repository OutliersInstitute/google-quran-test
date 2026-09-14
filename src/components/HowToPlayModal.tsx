import React from 'react';
import { HelpCircle, X, Sparkles, BookOpen, Layers, Volume2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-2xl bg-amber-50 border-2 border-amber-800/40 shadow-2xl p-5 sm:p-6 text-stone-800"
        >
          {/* Close button */}
          <button
            id="close-how-to-play-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-200/50 hover:bg-amber-300/80 text-amber-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-950 font-display">HOW TO PLAY</h3>
              <p className="text-xs text-amber-900/70">Quran Memorization Mushaf Challenge</p>
            </div>
          </div>

          <div className="space-y-3.5 text-sm text-stone-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-900/15">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-bold text-stone-900">Read the Authentic Mushaf Page</p>
                <p className="text-xs text-stone-600 mt-0.5">Look at the Holy Quran page. A missing verse or ending portion is marked with an illuminated golden slot <span className="font-arabic font-bold text-amber-900">[ ؟؟؟ اخْتَرِ التَّكْمِلَة ]</span>.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-900/15">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-bold text-stone-900">Browse the Mini Carousel</p>
                <p className="text-xs text-stone-600 mt-0.5">Below the page is a mini carousel of candidate verses in authentic Arabic script. Use the <b>arrow keys</b> or buttons to slide through options.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-900/15">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-bold text-stone-900">Select & Verify with Audio</p>
                <p className="text-xs text-stone-600 mt-0.5">Click <b>اخْتَر هَٰذِهِ الآيَة (Select This Verse)</b> or press <b>Enter/Number Keys</b>. You can also listen to audio recitations by Sheikh Mishary Alafasy!</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-900/15">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
              <div>
                <p className="font-bold text-stone-900">Customize Difficulty & Surahs</p>
                <p className="text-xs text-stone-600 mt-0.5">Practice full verses or tricky endings across all 114 Surahs of the Holy Quran, switch themes (Parchment, Emerald, Midnight), and build your memorization streak!</p>
              </div>
            </div>
          </div>

          <button
            id="start-memorizing-btn"
            onClick={onClose}
            className="w-full mt-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Memorizing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
