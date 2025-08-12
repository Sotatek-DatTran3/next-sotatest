import axios from 'axios';

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const strapiApi = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

strapiApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('strapi_jwt');
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
        localStorage.removeItem('strapi_jwt');
        localStorage.removeItem('strapi_user');
        window.location.href = '/auth';
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
      localStorage.setItem('strapi_jwt', token);
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi_jwt');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
    }
  },

  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('strapi_user', JSON.stringify(user));
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      try {
        const user = localStorage.getItem('strapi_user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_user');
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
      localStorage.removeItem('strapi_user');
    }
  },

  isClient: () => typeof window !== 'undefined',
};
