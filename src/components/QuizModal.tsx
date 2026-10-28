import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, X, Award } from 'lucide-react';

interface QuizModalProps {
  lessonTitle: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onFinishQuiz: (scorePercent: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  lessonTitle,
  questions,
  onClose,
  onFinishQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setIsQuizComplete(false);
  };

  const finalScorePercent = Math.round((correctAnswersCount / questions.length) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 transition-all my-8">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Interactive Knowledge Check</span>
            </div>
            <h2 id="quiz-modal-title" className="text-lg font-bold text-slate-100">
              {lessonTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Quiz"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isQuizComplete ? (
          <div>
            {/* Question Progress bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="tabular-nums font-mono">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question text */}
            <h3 className="text-base font-semibold text-slate-100 mb-3 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Optional code snippet */}
            {currentQuestion.codeSnippet && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-sky-300 mb-4 overflow-x-auto">
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* Options list */}
            <div className="space-y-2.5 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;

                let optionStyles = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                  } else {
                    optionStyles = 'border-slate-800/50 bg-slate-950/30 text-slate-500';
                  }
                } else if (isSelected) {
                  optionStyles = 'border-sky-500 bg-sky-950/30 text-sky-200';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyles}`}
                  >
                    <span className="w-6 h-6 rounded-md bg-slate-800/80 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="leading-relaxed pl-5 text-slate-300">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Complete Summary Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-100 mb-1">Quiz Completed!</h3>
            <p className="text-sm text-slate-400 mb-6">
              You answered <span className="font-semibold text-slate-200">{correctAnswersCount}</span> out of{' '}
              <span className="font-semibold text-slate-200">{questions.length}</span> questions correctly.
            </p>

            <div className="inline-block p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 px-8">
              <div className="text-3xl font-extrabold text-sky-400 tabular-nums">
                {finalScorePercent}%
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                {finalScorePercent >= 75 ? 'Mastery Achieved' : 'Keep Practicing'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetake}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => {
                  onFinishQuiz(finalScorePercent);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold transition-colors cursor-pointer"
              >
                Save Progress & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
