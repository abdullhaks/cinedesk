import axiosInstance from '../../utils/axiosFactory';
import type { User } from '../../interfaces/user';

export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
    const res = await axiosInstance.post('/api/auth/login', { email, password });
    return res.data;
  },

  registerContractor: async (
    fullName: string,
    email: string,
    password: string,
    contractorType: string
  ): Promise<{ user: User; accessToken: string; application: any }> => {
    const res = await axiosInstance.post('/api/auth/register-contractor', {
      fullName,
      email,
      password,
      contractorType,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/api/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await axiosInstance.get('/api/auth/me');
    return res.data.user;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const res = await axiosInstance.post('/api/auth/refresh');
    return res.data;
  },
};
