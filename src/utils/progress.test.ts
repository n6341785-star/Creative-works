import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTrackStats,
  updateStreak,
  calculateStudentRank,
  filterProjectsForStudent,
  getNextRecommendedLesson,
} from './progress';
import { Lesson, Project } from '../types';

test('calculateTrackStats correctly calculates progress and mastery', () => {
  const dummyLessons: Lesson[] = [
    {
      id: 'l1',
      trackId: 'frontend',
      moduleId: 'm1',
      subdivision: '1.1',
      title: 'HTML Intro',
      estimatedMinutes: 10,
      difficulty: 'beginner',
      summary: '',
      objectives: [],
      content: '',
      codeExamples: [],
      keyTakeaways: [],
      quiz: [],
    },
    {
      id: 'l2',
      trackId: 'frontend',
      moduleId: 'm1',
      subdivision: '1.2',
      title: 'HTML Semantic',
      estimatedMinutes: 15,
      difficulty: 'beginner',
      summary: '',
      objectives: [],
      content: '',
      codeExamples: [],
      keyTakeaways: [],
      quiz: [],
    },
  ];

  // 1 out of 2 completed with 100% quiz score
  const progress = {
    l1: {
      lessonId: 'l1',
      completed: true,
      quizScore: 100,
      quizAttempts: 1,
    },
  };

  const stats = calculateTrackStats(dummyLessons, progress);
  assert.equal(stats.totalLessons, 2);
  assert.equal(stats.completedLessons, 1);
  assert.equal(stats.progressPercent, 50);
  assert.equal(stats.averageQuizScore, 100);
  // 50% * 0.6 + 100% * 0.4 = 30 + 40 = 70
  assert.equal(stats.masteryPercent, 70);
});

test('updateStreak correctly handles consecutive days and gaps', () => {
  // First time
  const first = updateStreak(0, '', '2026-10-28');
  assert.equal(first.newStreak, 1);
  assert.equal(first.updatedDate, '2026-10-28');

  // Same day
  const sameDay = updateStreak(1, '2026-10-28', '2026-10-28');
  assert.equal(sameDay.newStreak, 1);

  // Consecutive day
  const nextDay = updateStreak(1, '2026-10-28', '2026-10-29');
  assert.equal(nextDay.newStreak, 2);
  assert.equal(nextDay.updatedDate, '2026-10-29');

  // Gap of 2 days resets to 1
  const afterGap = updateStreak(5, '2026-10-25', '2026-10-28');
  assert.equal(afterGap.newStreak, 1);
  assert.equal(afterGap.updatedDate, '2026-10-28');
});

test('calculateStudentRank maps XP to expected titles and thresholds', () => {
  assert.equal(calculateStudentRank(100).rankTitle, 'Novice Coder');
  assert.equal(calculateStudentRank(500).rankTitle, 'Apprentice Developer');
  assert.equal(calculateStudentRank(1000).rankTitle, 'Junior Engineer');
  assert.equal(calculateStudentRank(2000).rankTitle, 'Full-Stack Craftsman');
  assert.equal(calculateStudentRank(4000).rankTitle, 'Senior Systems Architect');
});

test('filterProjectsForStudent partitions projects by student skill level', () => {
  const dummyProjects: Project[] = [
    {
      id: 'p1',
      title: 'Beginner Project',
      trackId: 'frontend',
      level: 'beginner',
      estimatedHours: 2,
      description: '',
      skillsCovered: [],
      architectureOverview: '',
      requirements: [],
      starterCode: { type: 'frontend' },
    },
    {
      id: 'p2',
      title: 'Intermediate Project',
      trackId: 'frontend',
      level: 'intermediate',
      estimatedHours: 4,
      description: '',
      skillsCovered: [],
      architectureOverview: '',
      requirements: [],
      starterCode: { type: 'frontend' },
    },
    {
      id: 'p3',
      title: 'Backend Project',
      trackId: 'backend',
      level: 'beginner',
      estimatedHours: 2,
      description: '',
      skillsCovered: [],
      architectureOverview: '',
      requirements: [],
      starterCode: { type: 'backend' },
    },
  ];

  const result = filterProjectsForStudent(dummyProjects, 'frontend', 'beginner');
  assert.equal(result.recommended.length, 1);
  assert.equal(result.recommended[0].id, 'p1');
  assert.equal(result.others.length, 1);
  assert.equal(result.others[0].id, 'p2');
});

test('getNextRecommendedLesson picks first incomplete lesson in order', () => {
  const dummyLessons: Lesson[] = [
    { id: 'l1', trackId: 'frontend', moduleId: 'm1', subdivision: '1.1', title: 'A', estimatedMinutes: 5, difficulty: 'beginner', summary: '', objectives: [], content: '', codeExamples: [], keyTakeaways: [], quiz: [] },
    { id: 'l2', trackId: 'frontend', moduleId: 'm1', subdivision: '1.2', title: 'B', estimatedMinutes: 5, difficulty: 'beginner', summary: '', objectives: [], content: '', codeExamples: [], keyTakeaways: [], quiz: [] },
  ];

  const progress = {
    l1: { lessonId: 'l1', completed: true, quizAttempts: 1 },
  };

  const next = getNextRecommendedLesson(dummyLessons, progress);
  assert.equal(next?.id, 'l2');
});
