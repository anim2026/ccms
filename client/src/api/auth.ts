import api from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};
