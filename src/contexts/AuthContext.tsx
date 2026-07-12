'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '@/types';
import { userStorage } from '@/lib/localStorage';
import { authApi, userApi, tokenStorage } from '@/lib/api';
import { mapBackendUserToUser } from '@/lib/mappers/user.mapper';
import { BackendUser } from '@/lib/api/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toBackendUser = (raw: BackendUser & { _id?: string }): BackendUser => ({
  ...raw,
  id: String(raw.id || raw._id),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyUser = useCallback((backendUser: BackendUser & { _id?: string }) => {
    const mapped = mapBackendUserToUser(toBackendUser(backendUser));
    setUser(mapped);
    userStorage.setCurrentUser(mapped);
    return mapped;
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await userApi.getProfile();
    if (data.user) applyUser(data.user as BackendUser & { _id?: string });
  }, [applyUser]);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        tokenStorage.clear();
        userStorage.setCurrentUser(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    tokenStorage.set(data.token);
    applyUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await authApi.signup({ name, email, password });
    tokenStorage.set(data.token);
    applyUser(data.user);
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
    userStorage.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
