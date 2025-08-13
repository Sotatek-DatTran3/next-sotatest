import axios from 'axios';

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const strapiApi = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get JWT from cookie
const getJWTFromCookie = (): string | null => {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwt') {
      return value;
    }
  }
  return null;
};

// Helper function to get user from cookie
const getUserFromCookie = (): any | null => {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'user') {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (error) {
        console.error('Error parsing user from cookie:', error);
        return null;
      }
    }
  }
  return null;
};

strapiApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getJWTFromCookie();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

strapiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await strapiApi.post('/auth/local/register', userData);
    return response.data;
  },

  login: async (credentials: {
    identifier: string; // email
    password: string;
  }) => {
    const response = await strapiApi.post('/auth/local', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await strapiApi.get('/users/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await strapiApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: {
    code: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    const response = await strapiApi.post('/auth/reset-password', data);
    return response.data;
  },
};

export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      document.cookie = `jwt=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return getJWTFromCookie();
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      return getUserFromCookie();
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  isClient: () => typeof window !== 'undefined',
};
