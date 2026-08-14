import axiosInstance from '../../utils/axiosFactory';
import type { User } from '../../interfaces/user';

export const userApi = {
  listUsers: async (filter?: { role?: string; status?: string; search?: string }): Promise<{ items: User[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.role) params.append('role', filter.role);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/users?${params.toString()}`);
    return res.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const res = await axiosInstance.get(`/api/users/${id}`);
    return res.data.user;
  },

  assignRole: async (userId: string, roleId: string): Promise<User> => {
    const res = await axiosInstance.patch(`/api/users/${userId}/role`, { roleId });
    return res.data.user;
  },

  deactivateUser: async (userId: string): Promise<User> => {
    const res = await axiosInstance.patch(`/api/users/${userId}/deactivate`);
    return res.data.user;
  },
};
