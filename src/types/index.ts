export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  phone?: string;
  city?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  profile: UserProfile;
}

export interface UserProfile {
  streak: number;
  xp: number;
  level: number;
  badges: string[];
  totalTests: number;
  accuracy?: number;
  lastScore?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
}

/** MCQs loaded from JSON / subject samples (options A–D, correct answer as letter). */
export interface JsonMcq {
  question_number: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: Subject;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Subject = 
  | 'General Knowledge'
  | 'English'
  | 'Islamiat'
  | 'Pakistan Studies'
  | 'Everyday Science'
  | 'Analytical/IQ'
  | 'Current Affairs';

export interface TestConfig {
  subject?: Subject;
  numberOfQuestions: number;
  timeLimit?: number; // in minutes
  isFullMockTest: boolean;
}

export interface TestSession {
  id: string;
  userId: string;
  config: TestConfig;
  questions: MCQ[];
  answers: (number | null)[];
  bookmarkedQuestions: number[];
  startTime: string;
  endTime?: string;
  currentQuestionIndex: number;
}

export interface TestResult {
  id: string;
  userId: string;
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeTaken: number; // in minutes
  subjectBreakdown?: Record<Subject, { correct: number; total: number }>;
  completedAt: string;
  /** Practice quiz subject name (e.g. "English"). */
  subject?: string;
  /** "practice" = subject quiz; "mock" = full mock test. */
  source?: 'practice' | 'mock';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface TestContextType {
  currentSession: TestSession | null;
  startTest: (config: TestConfig) => void;
  submitAnswer: (questionIndex: number, answer: number) => void;
  toggleBookmark: (questionIndex: number) => void;
  navigateToQuestion: (index: number) => void;
  submitTest: () => TestResult | null;
  pauseTest: () => void;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
