import React from 'react';
import { Settings, Home } from 'lucide-react';

interface MushafHeaderProps {
  onOpenSettings: () => void;
  onNavigateHome?: () => void;
  mistakesCount: number;
}

export const MushafHeader: React.FC<MushafHeaderProps> = ({
  onOpenSettings,
  onNavigateHome,
  mistakesCount,
}) => {
  return (
    <header 
      id="app-top-header" 
      className="w-full mx-auto py-0.5 px-2 sm:px-3 flex items-center justify-end gap-1.5 flex-shrink-0 z-30"
    >
      {onNavigateHome && (
        <button
          id="header-home-btn"
          onClick={onNavigateHome}
          className="relative p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-100 border border-amber-900/15 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          title="Return to Home Dashboard & Goals"
        >
          <Home className="w-4 h-4 text-amber-800 dark:text-amber-300" />
          <span className="text-[11px] font-bold font-sans">Home</span>
        </button>
      )}

      {/* Settings Menu Button - Houses all display, theme, audio, translation, and test controls */}
      <button
        id="header-open-settings-btn"
        onClick={onOpenSettings}
        className="relative p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 dark:text-amber-100 border border-amber-900/15 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
        title="Open Settings & Controls"
      >
        <Settings className="w-4 h-4 text-amber-800 dark:text-amber-300" />
        <span className="text-[11px] font-bold font-sans">Settings</span>
        {mistakesCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
            {mistakesCount}
          </span>
        )}
      </button>
    </header>
  );
};
