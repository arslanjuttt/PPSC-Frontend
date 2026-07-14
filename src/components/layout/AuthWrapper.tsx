'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from './Layout';
import SplashScreen from './SplashScreen';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/reset-password',
];

const AUTH_ONLY_ROUTES = ['/verify-email'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      if (!user.isEmailVerified && pathname !== '/verify-email') {
        router.push('/verify-email');
        return;
      }
      if (user.isEmailVerified && pathname === '/verify-email') {
        router.push('/dashboard');
        return;
      }
      if (isPublicRoute) {
        router.push('/dashboard');
      }
      return;
    }

    if (isAuthOnlyRoute) {
      router.push('/login');
      return;
    }

    if (!isPublicRoute) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router, isPublicRoute, isAuthOnlyRoute]);

  if (isPublicRoute || (isAuthOnlyRoute && user)) {
    return <>{children}</>;
  }

  if (isLoading || !user) {
    return <SplashScreen />;
  }

  return <Layout>{children}</Layout>;
}
