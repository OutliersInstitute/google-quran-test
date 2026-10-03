import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { XpEventNotification } from '../types';

interface XpNotificationToastProps {
  notification: XpEventNotification | null;
  onClear: () => void;
}

export const XpNotificationToast: React.FC<XpNotificationToastProps> = ({
  notification,
  onClear,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClear, 300);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [notification, onClear]);

  if (!notification || !isVisible) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-8 z-50 pointer-events-none animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-900 text-amber-50 shadow-2xl border border-amber-600/40 backdrop-blur-md">
        <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-xs">
          <Sparkles className="w-4 h-4 fill-current" />
        </div>
        <div>
          <div className="text-xs font-black font-mono tracking-tight text-amber-300">
            +{notification.points} XP EARNED
          </div>
          <div className="text-[11px] opacity-90 font-medium">
            {notification.label}
          </div>
        </div>
      </div>
    </div>
  );
};
