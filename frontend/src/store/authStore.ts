import { create } from 'zustand';
import { authApi } from '../api/auth';
import { apiClient } from '../api/client';
import type { LoginRequest, User } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      
      // Получаем информацию о пользователе
      const userResponse = await apiClient.get<User>('/auth/me');
      set({ 
        isAuthenticated: true, 
        user: userResponse.data,
        isLoading: false,
        isInitializing: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка авторизации',
        isLoading: false,
        isInitializing: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ 
      isAuthenticated: false, 
      user: null,
      isInitializing: false
    });
  },

  initialize: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isInitializing: false, isAuthenticated: false });
      return;
    }
    
    try {
      const userResponse = await apiClient.get<User>('/auth/me');
      set({ 
        isAuthenticated: true, 
        user: userResponse.data,
        isInitializing: false
      });
    } catch (error) {
      localStorage.removeItem('access_token');
      set({ 
        isAuthenticated: false, 
        user: null,
        isInitializing: false
      });
    }
  },
}));