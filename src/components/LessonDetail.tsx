import React, { useState } from 'react';
import { Lesson, LessonProgress } from '../types';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  Play,
  Copy,
  Check,
  Award,
  Sparkles,
} from 'lucide-react';
import { QuizModal } from './QuizModal';

interface LessonDetailProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onBack: () => void;
  onOpenInPlayground: (code: Lesson['starterPlaygroundCode']) => void;
  onCompleteLesson: (lessonId: string, score?: number) => void;
  onToggleBookmark: (lessonId: string) => void;
  focusMode: boolean;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  progress,
  onBack,
  onOpenInPlayground,
  onCompleteLesson,
  onToggleBookmark,
  focusMode,
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isCompleted = progress?.completed;
  const isBookmarked = progress?.bookmarked;
  const score = progress?.quizScore;

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-6 ${focusMode ? 'py-10' : ''}`}>
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Lessons</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(lesson.id)}
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>
        </div>
      </div>

      {/* Lesson Meta Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
          <span className="font-mono text-sky-400 font-semibold">
            Unit {lesson.subdivision}
          </span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{lesson.trackId} Track</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.estimatedMinutes} min read</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{lesson.difficulty} Level</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mb-3">
          {lesson.title}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
          {lesson.summary}
        </p>

        {isCompleted && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Lesson Completed · Quiz Score: {score ?? 100}%</span>
          </div>
        )}
      </div>

      {/* Learning Objectives Box */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Key Learning Objectives
        </h2>
        <ul className="space-y-2">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Instructional Content */}
      <div className="prose prose-invert max-w-none mb-10 text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
        {lesson.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Interactive Code Examples */}
      {lesson.codeExamples.length > 0 && (
        <div className="space-y-6 mb-10">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Code Demonstrations & Examples</span>
          </h2>

          {lesson.codeExamples.map((ex, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300 font-mono">
                  {ex.title}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(ex.code, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>

                  {lesson.starterPlaygroundCode && (
                    <button
                      onClick={() => onOpenInPlayground(lesson.starterPlaygroundCode)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-sky-400" />
                      <span>Run in Playground</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-950 font-mono text-xs sm:text-sm text-sky-200 overflow-x-auto leading-relaxed">
                <pre>{ex.code}</pre>
              </div>

              <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400">
                <strong className="text-slate-300">Explanation: </strong>
                {ex.explanation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Takeaways */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 mb-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Summary & Key Takeaways
        </h2>
        <ul className="space-y-2">
          {lesson.keyTakeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-sky-400 font-bold shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* End of Lesson Action Area */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mx-auto mb-3">
          <Award className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Test Your Knowledge</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
          Reinforce your mastery of these concepts with our interactive multi-choice quiz.
        </p>

        <button
          onClick={() => setShowQuiz(true)}
          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          {isCompleted ? 'Retake Knowledge Quiz' : `Start Lesson Quiz (${lesson.quiz.length} Questions)`}
        </button>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          lessonTitle={lesson.title}
          questions={lesson.quiz}
          onClose={() => setShowQuiz(false)}
          onFinishQuiz={(quizScore) => {
            onCompleteLesson(lesson.id, quizScore);
          }}
        />
      )}
    </div>
  );
};
