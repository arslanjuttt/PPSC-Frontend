'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from './Layout';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}
