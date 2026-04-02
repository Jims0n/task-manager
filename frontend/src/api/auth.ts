import api from './axios';
import { AuthTokens, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register/', data);
    return response.data;
  },

  logout: async (refresh: string): Promise<void> => {
    await api.post('/auth/logout/', { refresh });
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile/');
    return response.data;
  },

  refreshToken: async (refresh: string): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/token/refresh/', { refresh });
    return response.data;
  },
};
