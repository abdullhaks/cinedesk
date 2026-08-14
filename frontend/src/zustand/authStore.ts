import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../interfaces/user';
import { authApi } from '../services/apis/authApi';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerContractor: (
    fullName: string,
    email: string,
    password: string,
    contractorType: string
  ) => Promise<any>;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.login(email, password);
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      registerContractor: async (fullName, email, password, contractorType) => {
        set({ isLoading: true });
        try {
          const data = await authApi.registerContractor(
            fullName,
            email,
            password,
            contractorType
          );
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (_) {
          // ignore logout network errors
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      fetchMe: async () => {
        if (!get().accessToken) return;
        set({ isLoading: true });
        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (_) {
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        }
      },

      hasPermission: (permissionKey: string) => {
        const user = get().user;
        if (!user || !user.role || !Array.isArray(user.role.permissions)) {
          return false;
        }
        // Super Admin wildcard check
        return user.role.permissions.some(
          (p) => p === '*' || p === permissionKey
        );
      },
    }),
    {
      name: 'cinidesk_auth_store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
