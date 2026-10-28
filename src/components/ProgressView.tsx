import React, { useState } from 'react';
import { Lesson, TrackType, UserProfile } from '../types';
import { frontendModules } from '../data/frontendTrack';
import { backendModules } from '../data/backendTrack';
import { calculateTrackStats, calculateStudentRank } from '../utils/progress';
import {
  Award,
  Flame,
  CheckCircle2,
  Bookmark,
  Calendar,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  FileCheck,
} from 'lucide-react';

interface ProgressViewProps {
  profile: UserProfile;
  onOpenLessonById: (id: string, track: TrackType) => void;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  onOpenLessonById,
  onResetProgress,
}) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateTrack, setCertificateTrack] = useState<TrackType>('frontend');

  const feLessons: Lesson[] = frontendModules.flatMap((m) => m.lessons);
  const beLessons: Lesson[] = backendModules.flatMap((m) => m.lessons);

  const feStats = calculateTrackStats(feLessons, profile.lessonProgress);
  const beStats = calculateTrackStats(beLessons, profile.lessonProgress);

  const totalLessonsCount = feLessons.length + beLessons.length;
  const totalCompletedLessons = feStats.completedLessons + beStats.completedLessons;
  const overallMastery = Math.round((feStats.masteryPercent + beStats.masteryPercent) / 2);

  const rankInfo = calculateStudentRank(profile.xp);

  // Filter bookmarked lessons
  const bookmarkedLessons = [...feLessons, ...beLessons].filter(
    (l) => profile.lessonProgress[l.id]?.bookmarked
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-sky-400" />
            <span>Mastery & Learning Monitor</span>
          </h1>
          <p className="text-xs text-slate-400">
            Track your concept retention, study streak, XP progression, and earned certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>View Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Mastery Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Academy Mastery Index
            </span>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-4xl font-extrabold text-sky-400 tabular-nums">
                {overallMastery}%
              </div>
              <div className="text-xs text-slate-400 leading-snug">
                Combines completed units and quiz accuracy across both tracks.
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Frontend Track</span>
                <span className="tabular-nums font-mono text-sky-400">{feStats.masteryPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${feStats.masteryPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Backend Track</span>
                <span className="tabular-nums font-mono text-indigo-400">{beStats.masteryPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${beStats.masteryPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rank & XP Level Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Student Rank & Experience
            </span>
            <div className="mt-2">
              <h2 className="text-xl font-bold text-slate-100">{rankInfo.rankTitle}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono font-bold">
                  Tier {rankInfo.level}
                </span>
                <span className="text-xs text-slate-400 tabular-nums">
                  {profile.xp} Total XP
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Next Rank Threshold</span>
              <span className="tabular-nums font-mono">{profile.xp} / {rankInfo.nextThreshold} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((profile.xp / rankInfo.nextThreshold) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Study Streak Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Study Streak
            </span>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-amber-400 tabular-nums">
                  {profile.streakDays} Days
                </div>
                <div className="text-xs text-slate-400">Keep studying daily to maintain!</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last Active:</span>
            </span>
            <span className="font-mono text-slate-300">{profile.lastStudyDate || 'Today'}</span>
          </div>
        </div>
      </div>

      {/* Bookmarked Lessons Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Bookmarked for Offline Revision ({bookmarkedLessons.length})</span>
        </h2>

        {bookmarkedLessons.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No lessons bookmarked yet. Tap the bookmark icon in any lesson to pin it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bookmarkedLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onOpenLessonById(lesson.id, lesson.trackId)}
                className="text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
                  Unit {lesson.subdivision} · {lesson.trackId}
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors mt-0.5 line-clamp-1">
                  {lesson.title}
                </h4>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Profile */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('Reset all lesson progress and start fresh?')) {
              onResetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Study Progress</span>
        </button>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 text-center relative">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>

            {/* Certificate Canvas */}
            <div className="border-4 border-double border-sky-500/40 rounded-xl p-6 sm:p-8 bg-slate-950/90 mb-5 relative">
              <div className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-2">
                DevPath Academy · Certificate of Mastery
              </div>
              <h2 className="text-2xl font-serif font-extrabold text-slate-100 mb-4">
                Certificate of Technical Competence
              </h2>
              <p className="text-xs text-slate-400 mb-2">This certifies that</p>
              <div className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-1 max-w-xs mx-auto mb-4">
                {profile.studentName}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-4">
                Has demonstrated dedicated progress and completed interactive assessments in the{' '}
                <strong className="text-sky-400 uppercase">{profile.activeTrack} Engineering Curriculum</strong>,
                achieving an assessed rank of <strong>{rankInfo.rankTitle}</strong>.
              </p>
              <div className="flex justify-between items-end pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                <div>Issued: {new Date().toISOString().slice(0, 10)}</div>
                <div className="text-sky-400">Verified Offline ID: DP-{profile.xp}</div>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Print / Save Certificate PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
