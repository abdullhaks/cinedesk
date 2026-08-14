import { useAuthStore } from '../zustand/authStore';

export const usePermission = () => {
  const user = useAuthStore((state) => state.user);
  const hasPermissionInStore = useAuthStore((state) => state.hasPermission);

  const hasPermission = (permissionKey: string): boolean => {
    return hasPermissionInStore(permissionKey);
  };

  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    if (!user || !user.role || !Array.isArray(user.role.permissions)) return false;
    return permissionKeys.some((key) => hasPermission(key));
  };

  const hasAllPermissions = (permissionKeys: string[]): boolean => {
    if (!user || !user.role || !Array.isArray(user.role.permissions)) return false;
    return permissionKeys.every((key) => hasPermission(key));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: user?.role?.permissions || [],
    roleName: user?.role?.name || null,
  };
};
