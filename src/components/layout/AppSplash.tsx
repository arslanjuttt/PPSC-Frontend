'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

const MIN_SPLASH_MS = 1500;

export default function AppSplash({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const showSplash = isLoading || !minTimeElapsed;

  return (
    <>
      <SplashScreen visible={showSplash} />
      <div className={showSplash ? 'invisible' : 'visible'}>{children}</div>
    </>
  );
}
