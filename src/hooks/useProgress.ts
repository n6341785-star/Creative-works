import { useEffect, useState } from 'react';
import { LessonProgress, ProjectProgress, SkillLevel, TrackType, UserProfile } from '../types';
import { updateStreak } from '../utils/progress';

const STORAGE_KEY = 'devpath_student_profile_v1';

const defaultProfile: UserProfile = {
  studentName: 'Student Developer',
  assessedLevel: 'beginner',
  diagnosticCompleted: false,
  xp: 120,
  streakDays: 1,
  lastStudyDate: new Date().toISOString().slice(0, 10),
  activeTrack: 'frontend',
  lessonProgress: {},
  projectProgress: {},
  theme: 'dark',
  focusMode: false,
};

export function useProgress() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse profile from localStorage', e);
    }
    return defaultProfile;
  });

  // Check and update study streak on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const { newStreak, updatedDate } = updateStreak(
      profile.streakDays,
      profile.lastStudyDate,
      today
    );

    if (newStreak !== profile.streakDays || updatedDate !== profile.lastStudyDate) {
      setProfile((prev) => {
        const updated = { ...prev, streakDays: newStreak, lastStudyDate: updatedDate };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save updated streak', e);
        }
        return updated;
      });
    }
  }, []);

  const saveProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save profile to localStorage', e);
      }
      return next;
    });
  };

  const setTrack = (track: TrackType) => {
    saveProfile((prev) => ({ ...prev, activeTrack: track }));
  };

  const setSkillLevel = (level: SkillLevel) => {
    saveProfile((prev) => ({ ...prev, assessedLevel: level }));
  };

  const toggleFocusMode = () => {
    saveProfile((prev) => ({ ...prev, focusMode: !prev.focusMode }));
  };

  const recordLessonCompleted = (lessonId: string, quizScore?: number) => {
    saveProfile((prev) => {
      const existing = prev.lessonProgress[lessonId] || {
        lessonId,
        completed: false,
        quizAttempts: 0,
      };

      const attempts = existing.quizAttempts + (quizScore !== undefined ? 1 : 0);
      const isNewCompletion = !existing.completed;
      const score = quizScore !== undefined ? Math.max(existing.quizScore || 0, quizScore) : existing.quizScore;

      // Calculate XP bonus (+50 XP for completion, +50 XP for high quiz score)
      let addedXP = isNewCompletion ? 60 : 10;
      if (quizScore && quizScore >= 80) addedXP += 40;

      const updatedProgress: Record<string, LessonProgress> = {
        ...prev.lessonProgress,
        [lessonId]: {
          ...existing,
          completed: true,
          completedAt: new Date().toISOString(),
          quizScore: score,
          quizAttempts: attempts,
        },
      };

      return {
        ...prev,
        xp: prev.xp + addedXP,
        lessonProgress: updatedProgress,
      };
    });
  };

  const toggleBookmark = (lessonId: string) => {
    saveProfile((prev) => {
      const existing = prev.lessonProgress[lessonId] || {
        lessonId,
        completed: false,
        quizAttempts: 0,
      };
      return {
        ...prev,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: {
            ...existing,
            bookmarked: !existing.bookmarked,
          },
        },
      };
    });
  };

  const toggleProjectRequirement = (projectId: string, reqId: string) => {
    saveProfile((prev) => {
      const existing: ProjectProgress = prev.projectProgress[projectId] || {
        projectId,
        completed: false,
        completedRequirements: [],
      };

      const hasReq = existing.completedRequirements.includes(reqId);
      const updatedReqs = hasReq
        ? existing.completedRequirements.filter((id) => id !== reqId)
        : [...existing.completedRequirements, reqId];

      return {
        ...prev,
        projectProgress: {
          ...prev.projectProgress,
          [projectId]: {
            ...existing,
            completedRequirements: updatedReqs,
          },
        },
      };
    });
  };

  const markProjectCompleted = (projectId: string, userCode?: ProjectProgress['userCode']) => {
    saveProfile((prev) => {
      const existing = prev.projectProgress[projectId];
      const isFirst = !existing?.completed;

      return {
        ...prev,
        xp: prev.xp + (isFirst ? 150 : 20),
        projectProgress: {
          ...prev.projectProgress,
          [projectId]: {
            projectId,
            completed: true,
            completedRequirements: existing?.completedRequirements || [],
            completedAt: new Date().toISOString(),
            userCode: userCode || existing?.userCode,
          },
        },
      };
    });
  };

  const resetAllProgress = () => {
    const fresh: UserProfile = {
      ...defaultProfile,
      lastStudyDate: new Date().toISOString().slice(0, 10),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.warn('Failed to reset profile', e);
    }
    setProfile(fresh);
  };

  return {
    profile,
    setTrack,
    setSkillLevel,
    toggleFocusMode,
    recordLessonCompleted,
    toggleBookmark,
    toggleProjectRequirement,
    markProjectCompleted,
    resetAllProgress,
  };
}
