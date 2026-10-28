import React, { useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { TrackView } from './components/TrackView';
import { LessonDetail } from './components/LessonDetail';
import { Playground } from './components/Playground';
import { ProjectsView } from './components/ProjectsView';
import { ProgressView } from './components/ProgressView';
import { Lesson, Project, TrackType } from './types';
import { frontendModules } from './data/frontendTrack';
import { backendModules } from './data/backendTrack';

export default function App() {
  const {
    profile,
    setTrack,
    setSkillLevel,
    toggleFocusMode,
    recordLessonCompleted,
    toggleBookmark,
    toggleProjectRequirement,
    markProjectCompleted,
    resetAllProgress,
  } = useProgress();

  const [activeTab, setActiveTab] = useState<'tracks' | 'playground' | 'projects' | 'mastery'>('tracks');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Playground state passed from "Open in Playground" actions
  const [playgroundConfig, setPlaygroundConfig] = useState<{
    mode: 'frontend' | 'backend';
    code?: {
      html?: string;
      css?: string;
      js?: string;
      backendCode?: string;
    };
  }>({
    mode: profile.activeTrack === 'backend' ? 'backend' : 'frontend',
  });

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('tracks');
  };

  const handleOpenLessonById = (id: string, track: TrackType) => {
    const modules = track === 'frontend' ? frontendModules : backendModules;
    const found = modules.flatMap((m) => m.lessons).find((l) => l.id === id);
    if (found) {
      setTrack(track);
      setSelectedLesson(found);
      setActiveTab('tracks');
    }
  };

  const handleOpenInPlaygroundFromLesson = (code: Lesson['starterPlaygroundCode']) => {
    if (!code) return;
    setPlaygroundConfig({
      mode: code.type,
      code: {
        html: code.html,
        css: code.css,
        js: code.js,
        backendCode: code.backendCode,
      },
    });
    setActiveTab('playground');
  };

  const handleOpenProjectInPlayground = (
    starterCode: Project['starterCode'],
    trackId: 'frontend' | 'backend'
  ) => {
    setPlaygroundConfig({
      mode: starterCode.type || trackId,
      code: {
        html: starterCode.html,
        css: starterCode.css,
        js: starterCode.js,
        backendCode: starterCode.backendCode,
      },
    });
    setActiveTab('playground');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'tracks') {
            setSelectedLesson(null);
          }
        }}
        streakDays={profile.streakDays}
        xp={profile.xp}
        focusMode={profile.focusMode}
        onToggleFocusMode={toggleFocusMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {activeTab === 'tracks' && (
          selectedLesson ? (
            <LessonDetail
              lesson={selectedLesson}
              progress={profile.lessonProgress[selectedLesson.id]}
              onBack={() => setSelectedLesson(null)}
              onOpenInPlayground={handleOpenInPlaygroundFromLesson}
              onCompleteLesson={recordLessonCompleted}
              onToggleBookmark={toggleBookmark}
              focusMode={profile.focusMode}
            />
          ) : (
            <TrackView
              activeTrack={profile.activeTrack}
              onSelectTrack={setTrack}
              onOpenLesson={handleOpenLesson}
              profile={profile}
            />
          )
        )}

        {activeTab === 'playground' && (
          <Playground
            initialMode={playgroundConfig.mode}
            initialCode={playgroundConfig.code}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            profile={profile}
            onSetSkillLevel={setSkillLevel}
            onToggleRequirement={toggleProjectRequirement}
            onCompleteProject={markProjectCompleted}
            onOpenProjectInPlayground={handleOpenProjectInPlayground}
          />
        )}

        {activeTab === 'mastery' && (
          <ProgressView
            profile={profile}
            onOpenLessonById={handleOpenLessonById}
            onResetProgress={resetAllProgress}
          />
        )}
      </main>

      {/* Offline Status Banner */}
      <OfflineBanner />

      {/* Android Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'tracks') {
            setSelectedLesson(null);
          }
        }}
      />
    </div>
  );
}
