import { apiClient } from './client';
import { AuthResponse, ApiResponse, BackendUser } from './types';

export const authApi = {
  signup: (data: { name: string; email: string; password: string; phone?: string; city?: string }) =>
    apiClient.post<AuthResponse>('/api/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/api/auth/login', data),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse>('/api/auth/forgot-password', { email }),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post<ApiResponse>('/api/auth/verify-otp', { email, otp }),

  resetPassword: (email: string, password: string) =>
    apiClient.post<ApiResponse>('/api/auth/reset-password', { email, password }),

  verifyEmail: (otp: string) =>
    apiClient.post<ApiResponse<BackendUser>>('/api/auth/verify-email', { otp }),

  resendVerification: () =>
    apiClient.post<ApiResponse>('/api/auth/resend-verification'),
};

export const userApi = {
  getProfile: () => apiClient.get<ApiResponse<BackendUser>>('/api/users/profile'),

  updateProfile: (data: { name?: string; phone?: string; city?: string; profileImage?: string }) =>
    apiClient.put<ApiResponse<BackendUser>>('/api/users/profile', data),

  getStats: () => apiClient.get<ApiResponse>('/api/users/stats'),

  recordTestResult: (data: {
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
    totalQuestions?: number;
    unattempted?: number;
    subject?: string;
    source?: 'practice' | 'mock';
  }) => apiClient.post<ApiResponse>('/api/users/stats/test-result', data),

  getTestHistory: () => apiClient.get<ApiResponse>('/api/users/test-history'),

  getLeaderboard: () => apiClient.get<ApiResponse>('/api/users/leaderboard'),
};

export const testApi = {
  getAll: () => apiClient.get<ApiResponse>('/api/tests'),
};

export const transcriptApi = {
  generate: (url: string) => apiClient.post<ApiResponse<{ transcript: string }>>('/api/transcript', { url }),
};

export const chatApi = {
  send: (payload: { messages: Array<{ role: 'user' | 'assistant'; content: string }> }) =>
    apiClient.post<{ text?: string; error?: string }>('/api/chat', payload),

  translate: (text: string) =>
    apiClient.post<{ translatedText?: string; error?: string }>('/api/chat/translate', { text }),
};
