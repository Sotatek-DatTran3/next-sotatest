'use client';

import { authAPI, tokenManager } from '@/lib/strapi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

// Register mutation
export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (userData: {
      username: string;
      email: string;
      password: string;
    }) => {
      const response = await authAPI.register(userData);
      return response as StrapiAuthResponse;
    },
    onSuccess: (data) => {
      tokenManager.setToken(data.jwt);
      tokenManager.setUser(data.user);
      // Refresh page to trigger middleware redirect
      window.location.href = '/dashboard';
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error('Registration failed:', error.response?.data?.error?.message || error.message);
      } else {
        console.error('Registration failed:', error);
      }
    },
  });
}

// Login mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: {
      identifier: string;
      password: string;
    }) => {
      const response = await authAPI.login(credentials);
      return response as StrapiAuthResponse;
    },
    onSuccess: (data) => {
      tokenManager.setToken(data.jwt);
      tokenManager.setUser(data.user);
      queryClient.setQueryData(['auth', 'user'], data.user);
      // Refresh page to trigger middleware redirect
      window.location.href = '/dashboard';
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error('Login failed:', error.response?.data?.error?.message || error.message);
      } else {
        console.error('Login failed:', error);
      }
    },
  });
}

// Get current user query
export function useUserQuery() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) {
        return null;
      }

      try {
        const user = await authAPI.getMe();
        return user as StrapiUser;
      } catch (error) {
        tokenManager.clear();
        return null;
      }
    },
    enabled: !!tokenManager.getToken(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      tokenManager.clear();
    },
    onSuccess: () => {
      queryClient.clear();
      // Refresh page to trigger middleware redirect
      window.location.href = '/';
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      return await authAPI.forgotPassword(email);
    },
  });
}

// Reset password mutation
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (data: {
      code: string;
      password: string;
      passwordConfirmation: string;
    }) => {
      const response = await authAPI.resetPassword(data);
      return response as StrapiAuthResponse;
    },
    onSuccess: (data) => {
      tokenManager.setToken(data.jwt);
      tokenManager.setUser(data.user);
      window.location.href = '/dashboard';
    },
  });
}
