export type TrackType = 'frontend' | 'backend';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  trackId: TrackType;
  moduleId: string;
  subdivision: string; // e.g. "1.1", "1.2"
  title: string;
  estimatedMinutes: number;
  difficulty: SkillLevel;
  summary: string;
  objectives: string[];
  content: string; // Structured readable sections
  codeExamples: {
    title: string;
    language: 'html' | 'css' | 'javascript' | 'json';
    code: string;
    explanation: string;
  }[];
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  starterPlaygroundCode?: {
    type: 'frontend' | 'backend';
    html?: string;
    css?: string;
    js?: string;
    backendCode?: string;
  };
}

export interface Module {
  id: string;
  trackId: TrackType;
  title: string;
  order: number;
  description: string;
  iconName: string;
  lessons: Lesson[];
}

export interface ProjectRequirement {
  id: string;
  description: string;
  hint?: string;
}

export interface Project {
  id: string;
  title: string;
  trackId: TrackType;
  level: SkillLevel;
  estimatedHours: number;
  description: string;
  skillsCovered: string[];
  architectureOverview: string;
  requirements: ProjectRequirement[];
  starterCode: {
    type: 'frontend' | 'backend';
    html?: string;
    css?: string;
    js?: string;
    backendCode?: string;
  };
  solutionCode?: {
    html?: string;
    css?: string;
    js?: string;
    backendCode?: string;
    explanation: string;
  };
  validationTest?: {
    name: string;
    checkFnCode: string;
  };
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  quizScore?: number; // 0 to 100
  quizAttempts: number;
  bookmarked?: boolean;
}

export interface ProjectProgress {
  projectId: string;
  completed: boolean;
  completedRequirements: string[];
  completedAt?: string;
  userCode?: {
    html?: string;
    css?: string;
    js?: string;
    backendCode?: string;
  };
}

export interface UserProfile {
  studentName: string;
  assessedLevel: SkillLevel;
  diagnosticCompleted: boolean;
  xp: number;
  streakDays: number;
  lastStudyDate: string; // ISO YYYY-MM-DD
  activeTrack: TrackType;
  lessonProgress: Record<string, LessonProgress>;
  projectProgress: Record<string, ProjectProgress>;
  theme: 'dark' | 'light';
  focusMode: boolean;
}
