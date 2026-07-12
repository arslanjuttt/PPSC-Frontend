export const RESET_EMAIL_KEY = 'ppsc_reset_email';

export const resetFlowStorage = {
  getEmail: () => (typeof window !== 'undefined' ? sessionStorage.getItem(RESET_EMAIL_KEY) : null),
  setEmail: (email: string) => {
    if (typeof window !== 'undefined') sessionStorage.setItem(RESET_EMAIL_KEY, email);
  },
  clear: () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(RESET_EMAIL_KEY);
  },
};
