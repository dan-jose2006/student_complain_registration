import { apiRequest } from './api';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<User> {
    return apiRequest<User>('/auth/me');
  },
};
