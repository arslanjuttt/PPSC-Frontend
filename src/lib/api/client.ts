import axios from 'axios';

const TOKEN_KEY = 'ppsc_token';

const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return '';

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
};

const apiBaseUrl =
  normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL) ||
  normalizeBaseUrl(
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SERVER_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_SERVER_URL_LOCAL
  ) ||
  'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthAttempt = url.includes('/api/auth/login') || url.includes('/api/auth/signup');
      if (!isAuthAttempt && tokenStorage.get() && typeof window !== 'undefined') {
        tokenStorage.clear();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const tokenStorage = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),
  set: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
  },
};

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};
