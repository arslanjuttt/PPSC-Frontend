import { User } from '@/types';

const CURRENT_USER_KEY = 'ppsc_current_user';

/** Cached copy of the logged-in user for quick hydration (token is stored separately). */
export const userStorage = {
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },
};

const LATEST_PRACTICE_KEY = 'ppsc_latest_practice';

export interface LatestPracticeDetail {
  subjectName: string;
  subjectSlug: string;
  mcqs: { question_number: number; question: string; options: { A: string; B: string; C: string; D: string }; correct_answer: 'A' | 'B' | 'C' | 'D' }[];
  answers: (string | null)[];
  score: number;
  correctCount: number;
}

/** Session-only storage for the latest quiz review screen. */
export const testResultStorage = {
  getLatestPracticeDetail: (): LatestPracticeDetail | null => {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem(LATEST_PRACTICE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setLatestPracticeDetail: (detail: LatestPracticeDetail): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(LATEST_PRACTICE_KEY, JSON.stringify(detail));
  },

  clearLatestPracticeDetail: (): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(LATEST_PRACTICE_KEY);
  },
};
