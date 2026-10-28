import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-18 md:bottom-5 left-4 z-40 flex items-center gap-2 bg-amber-500/95 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm animate-pulse border border-amber-400/40"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — All lessons, quizzes & playground work locally</span>
    </div>
  );
};
