import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../zustand/authStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  // Request interceptor: attach Authorization header
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401 (refresh token) and 403 (forbidden/logout)
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
      const originalRequest = error.config;

      const isAuthEndpoint =
        originalRequest?.url?.includes('/api/auth/login') ||
        originalRequest?.url?.includes('/api/auth/register') ||
        originalRequest?.url?.includes('/api/auth/refresh') ||
        originalRequest?.url?.includes('/api/auth/logout');

      // Handle 401 Unauthorized for protected resources (excluding login/registration)
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthEndpoint
      ) {
        originalRequest._retry = true;

        try {
          // Hit refresh endpoint
          const refreshRes = await axios.post(
            `${API_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshRes.data.accessToken;
          if (newAccessToken) {
            useAuthStore.getState().setAccessToken(newAccessToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axios(originalRequest);
          }
        } catch (refreshErr) {
          // Token refresh failed — logout and redirect
          useAuthStore.getState().clearAuth();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        }
      }

      // Handle 429 Rate Limit
      if (error.response?.status === 429) {
        import('antd').then(({ message }) => {
          message.error('Too many requests. Please slow down and try again in a minute.');
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();
export default axiosInstance;
