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
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: userData, isLoading, error } = useUserQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const isAuthenticated = !!user;
  const loading = isLoading || !isHydrated;

  // Hydrate user state from localStorage after component mounts
  useEffect(() => {
    if (tokenManager.isClient()) {
      const savedUser = tokenManager.getUser();
      if (savedUser && tokenManager.getToken()) {
        setUser(savedUser);
      }
    }
    setIsHydrated(true);
  }, []);

  // Update user state when query data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (error || !tokenManager.getToken()) {
      setUser(null);
    }
  }, [userData, error]);

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
