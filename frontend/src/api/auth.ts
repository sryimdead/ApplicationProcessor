import { apiClient } from './client';
import type { LoginRequest, TokenResponse } from '../types/user';

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', data);
    return response.data;
  },
};