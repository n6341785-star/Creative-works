import React, { useState } from 'react';
import { Lesson, Module, TrackType, UserProfile } from '../types';
import { frontendModules } from '../data/frontendTrack';
import { backendModules } from '../data/backendTrack';
import { calculateTrackStats, getNextRecommendedLesson } from '../utils/progress';
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Bookmark,
  Sparkles,
  ArrowRight,
  Code2,
  Server,
  Layers,
} from 'lucide-react';

interface TrackViewProps {
  activeTrack: TrackType;
  onSelectTrack: (track: TrackType) => void;
  onOpenLesson: (lesson: Lesson) => void;
  profile: UserProfile;
}

export const TrackView: React.FC<TrackViewProps> = ({
  activeTrack,
  onSelectTrack,
  onOpenLesson,
  profile,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'completed' | 'bookmarked'>('all');

  const currentModules: Module[] = activeTrack === 'frontend' ? frontendModules : backendModules;
  const allTrackLessons: Lesson[] = currentModules.flatMap((m) => m.lessons);

  const stats = calculateTrackStats(allTrackLessons, profile.lessonProgress);
  const nextLesson = getNextRecommendedLesson(allTrackLessons, profile.lessonProgress);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Track Selector & Master Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Curriculum Pathways
          </h1>
          <p className="text-xs text-slate-400">
            Self-paced subdivided lessons and interactive quizzes to test your knowledge offline.
          </p>
        </div>

        {/* Dual Track Segmented Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            onClick={() => onSelectTrack('frontend')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTrack === 'frontend'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Frontend Track</span>
          </button>
          <button
            onClick={() => onSelectTrack('backend')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTrack === 'backend'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Backend Track</span>
          </button>
        </div>
      </div>

      {/* Progress & Mastery Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Completed Lessons
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-100 tabular-nums">
              {stats.completedLessons}
            </span>
            <span className="text-xs text-slate-500">/ {stats.totalLessons}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Curriculum Progress
          </span>
          <div className="text-2xl font-bold text-sky-400 tabular-nums mt-1">
            {stats.progressPercent}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {stats.completedLessons === stats.totalLessons ? 'Track Completed!' : 'Keep up the momentum'}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quiz Accuracy
          </span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
            {stats.averageQuizScore}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Across {stats.quizzesTaken} completed quizzes
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Concept Mastery
          </span>
          <div className="text-2xl font-bold text-indigo-400 tabular-nums mt-1">
            {stats.masteryPercent}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Blends lessons & quiz scores
          </p>
        </div>
      </div>

      {/* Up Next Recommendation Banner */}
      {nextLesson && (
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Lesson</span>
            </div>
            <h2 className="text-base font-bold text-slate-100">
              Unit {nextLesson.subdivision}: {nextLesson.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {nextLesson.summary}
            </p>
          </div>

          <button
            onClick={() => onOpenLesson(nextLesson)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>Start Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lesson Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['all', 'incomplete', 'completed', 'bookmarked'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize whitespace-nowrap ${
              filterMode === mode
                ? 'bg-slate-800 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mode === 'all' ? 'All Lessons' : mode}
          </button>
        ))}
      </div>

      {/* Subdivided Modules and Lessons Catalog */}
      <div className="space-y-6">
        {currentModules.map((module) => {
          // Filter lessons within module
          const filteredLessons = module.lessons.filter((l) => {
            const prog = profile.lessonProgress[l.id];
            if (filterMode === 'incomplete') return !prog?.completed;
            if (filterMode === 'completed') return prog?.completed;
            if (filterMode === 'bookmarked') return prog?.bookmarked;
            return true;
          });

          if (filteredLessons.length === 0 && filterMode !== 'all') {
            return null;
          }

          return (
            <div
              key={module.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    Module 0{module.order}
                  </span>
                  <h2 className="text-base font-bold text-slate-100">{module.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{module.description}</p>
                </div>
              </div>

              {/* Subdivided Lessons List */}
              <div className="divide-y divide-slate-800/80 mt-4">
                {filteredLessons.map((lesson) => {
                  const prog = profile.lessonProgress[lesson.id];
                  const isDone = prog?.completed;
                  const isBookmarked = prog?.bookmarked;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onOpenLesson(lesson)}
                      className="w-full text-left py-3.5 px-2 hover:bg-slate-800/40 rounded-xl transition-colors flex items-center justify-between gap-4 group cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : lesson.subdivision}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                              {lesson.title}
                            </h3>
                            {isBookmarked && (
                              <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.estimatedMinutes}m</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{lesson.difficulty}</span>
                            {prog?.quizScore !== undefined && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-400 font-mono">
                                  Quiz: {prog.quizScore}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
