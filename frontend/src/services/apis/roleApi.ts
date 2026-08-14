import axiosInstance from '../../utils/axiosFactory';
import type { Role, Permission } from '../../interfaces/user';

export const roleApi = {
  listRoles: async (): Promise<Role[]> => {
    const res = await axiosInstance.get('/api/roles');
    return res.data.items;
  },

  createRole: async (name: string, permissions: string[]): Promise<Role> => {
    const res = await axiosInstance.post('/api/roles', { name, permissions });
    return res.data.role;
  },

  updatePermissions: async (roleId: string, permissions: string[]): Promise<Role> => {
    const res = await axiosInstance.patch(`/api/roles/${roleId}/permissions`, { permissions });
    return res.data.role;
  },

  listPermissions: async (): Promise<Permission[]> => {
    const res = await axiosInstance.get('/api/roles/permissions');
    return res.data.items;
  },
};
