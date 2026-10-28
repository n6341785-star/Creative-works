import { Lesson, LessonProgress, Project, ProjectProgress, SkillLevel, TrackType } from '../types';

export interface TrackStats {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  quizzesTaken: number;
  averageQuizScore: number;
  masteryPercent: number;
}

export function calculateTrackStats(
  trackLessons: Lesson[],
  lessonProgress: Record<string, LessonProgress>
): TrackStats {
  const totalLessons = trackLessons.length;
  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      progressPercent: 0,
      quizzesTaken: 0,
      averageQuizScore: 0,
      masteryPercent: 0,
    };
  }

  let completedLessons = 0;
  let quizzesTaken = 0;
  let totalScore = 0;

  for (const lesson of trackLessons) {
    const prog = lessonProgress[lesson.id];
    if (prog?.completed) {
      completedLessons += 1;
    }
    if (prog?.quizScore !== undefined && prog.quizAttempts > 0) {
      quizzesTaken += 1;
      totalScore += prog.quizScore;
    }
  }

  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const averageQuizScore = quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0;
  // Mastery blends lesson completion (60%) and quiz accuracy (40%)
  const masteryPercent = Math.min(
    100,
    Math.round(progressPercent * 0.6 + averageQuizScore * 0.4)
  );

  return {
    totalLessons,
    completedLessons,
    progressPercent,
    quizzesTaken,
    averageQuizScore,
    masteryPercent,
  };
}

export function updateStreak(
  currentStreak: number,
  lastStudyDate: string,
  todayDate: string
): { newStreak: number; updatedDate: string } {
  if (!todayDate) {
    return { newStreak: currentStreak, updatedDate: lastStudyDate };
  }

  if (lastStudyDate === todayDate) {
    return { newStreak: currentStreak, updatedDate: lastStudyDate };
  }

  if (!lastStudyDate) {
    return { newStreak: 1, updatedDate: todayDate };
  }

  const lastDate = new Date(lastStudyDate + 'T00:00:00Z').getTime();
  const currentDate = new Date(todayDate + 'T00:00:00Z').getTime();
  const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, updatedDate: todayDate };
  } else if (diffDays === 0) {
    return { newStreak: currentStreak, updatedDate: lastStudyDate };
  } else {
    // Missed at least one day, reset to 1
    return { newStreak: 1, updatedDate: todayDate };
  }
}

export function calculateStudentRank(xp: number): {
  rankTitle: string;
  nextThreshold: number;
  level: number;
} {
  if (xp < 250) {
    return { rankTitle: 'Novice Coder', nextThreshold: 250, level: 1 };
  } else if (xp < 750) {
    return { rankTitle: 'Apprentice Developer', nextThreshold: 750, level: 2 };
  } else if (xp < 1500) {
    return { rankTitle: 'Junior Engineer', nextThreshold: 1500, level: 3 };
  } else if (xp < 3000) {
    return { rankTitle: 'Full-Stack Craftsman', nextThreshold: 3000, level: 4 };
  } else {
    return { rankTitle: 'Senior Systems Architect', nextThreshold: 5000, level: 5 };
  }
}

export function filterProjectsForStudent(
  projects: Project[],
  trackId: TrackType,
  studentLevel: SkillLevel
): {
  recommended: Project[];
  others: Project[];
} {
  const trackProjects = projects.filter((p) => p.trackId === trackId);
  const recommended = trackProjects.filter((p) => p.level === studentLevel);
  const others = trackProjects.filter((p) => p.level !== studentLevel);

  return { recommended, others };
}

export function getNextRecommendedLesson(
  lessons: Lesson[],
  lessonProgress: Record<string, LessonProgress>
): Lesson | null {
  for (const lesson of lessons) {
    const prog = lessonProgress[lesson.id];
    if (!prog || !prog.completed) {
      return lesson;
    }
  }
  return null;
}
