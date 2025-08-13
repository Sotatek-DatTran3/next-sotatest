'use client';

import { StrapiUser, useLoginMutation, useLogoutMutation, useUserQuery } from '@/hooks/useAuth';
import { tokenManager } from '@/lib/strapi';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: StrapiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const { data: userData, isLoading, error } = useUserQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const isAuthenticated = !!user;
  // Show loading when initializing OR when query is loading
  const loading = initializing || isLoading;

  // Update user state when query data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
      setInitializing(false);
    } else if (error || !tokenManager.getToken()) {
      setUser(null);
      setInitializing(false);
    }
  }, [userData, error]);

  // Handle initial token check
  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      setUser(null);
      setInitializing(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({
        identifier: email,
        password,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
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
