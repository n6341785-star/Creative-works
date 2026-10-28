import React from 'react';
import { Flame, Eye, EyeOff } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'tracks' | 'playground' | 'projects' | 'mastery';
  onSelectTab: (tab: 'tracks' | 'playground' | 'projects' | 'mastery') => void;
  streakDays: number;
  xp: number;
  focusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  streakDays,
  focusMode,
  onToggleFocusMode,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => onSelectTab('tracks')}
          className="flex items-center gap-2 text-left group cursor-pointer shrink-0"
          aria-label="DevPath Academy Home"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold text-sm">
            &lt;/&gt;
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap">
            DevPath
          </span>
        </button>

        {/* Zone 2: Nav Links (Desktop & Tablet) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium"
        >
          <button
            onClick={() => onSelectTab('tracks')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'tracks'
                ? 'bg-slate-800/80 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => onSelectTab('playground')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-slate-800/80 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => onSelectTab('projects')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-slate-800/80 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onSelectTab('mastery')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'mastery'
                ? 'bg-slate-800/80 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mastery
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Study Streak */}
          <div
            title={`${streakDays} Day Study Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tabular-nums"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{streakDays}d streak</span>
          </div>

          {/* Distraction-Free Focus Mode Toggle */}
          <button
            onClick={onToggleFocusMode}
            aria-label={focusMode ? 'Exit Distraction-Free Focus Mode' : 'Enter Distraction-Free Focus Mode'}
            title={focusMode ? 'Exit Focus Mode' : 'Focus Mode (Distraction-Free)'}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              focusMode
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
