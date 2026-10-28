import React from 'react';
import { BookOpen, Terminal, FolderGit2, Award } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'tracks' | 'playground' | 'projects' | 'mastery';
  onSelectTab: (tab: 'tracks' | 'playground' | 'projects' | 'mastery') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'tracks' as const, label: 'Lessons', icon: BookOpen },
    { id: 'playground' as const, label: 'Playground', icon: Terminal },
    { id: 'projects' as const, label: 'Projects', icon: FolderGit2 },
    { id: 'mastery' as const, label: 'Mastery', icon: Award },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden pb-safe"
    >
      <div className="grid grid-cols-4 items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
                isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] font-medium tracking-tight mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
