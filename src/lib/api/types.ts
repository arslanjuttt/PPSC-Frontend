export interface BackendUserStats {
  testsTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  lastScore: number;
  accuracy: number;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  profileImage?: string;
  role?: string;
  isEmailVerified?: boolean;
  stats?: BackendUserStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: BackendUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  user?: T;
  stats?: BackendUserStats;
  leaderboard?: LeaderboardEntry[];
  tests?: MockTest[];
  results?: TestHistoryItem[];
}

export interface LeaderboardEntry {
  _id?: string;
  name: string;
  stats: BackendUserStats;
}

export interface MockTest {
  id: number;
  title: string;
  questionCount: number;
  duration: number;
  subject?: string;
  description?: string;
}

export interface RecordTestResultPayload {
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  totalQuestions?: number;
  unattempted?: number;
  subject?: string;
  source?: 'practice' | 'mock';
}

export interface TestHistoryItem {
  _id: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  unattempted: number;
  subject: string;
  source: 'practice' | 'mock';
  createdAt: string;
}
