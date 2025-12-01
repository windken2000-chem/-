export enum Subject {
  MATH = '數學',
  CHINESE = '國語',
  ENGLISH = '英文',
  LIFE = '生活'
}

export enum AppScreen {
  HOME = 'HOME',
  MAP = 'MAP',
  GAME = 'GAME',
  RESULT = 'RESULT'
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string; // Explanation for the correct answer
}

export interface LevelContent {
  lessonTitle: string;
  lessonText: string;
  questions: QuizQuestion[];
}

export interface LevelConfig {
  id: number;
  title: string;
  topic: string; // e.g., "加法", "生字"
  isLocked: boolean;
  stars: number; // 0-3
}

export interface GameState {
  subject: Subject | null;
  currentLevelId: number | null;
  score: number;
  health: number; // Max 3
}