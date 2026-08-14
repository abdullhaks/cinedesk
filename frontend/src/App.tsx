import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './zustand/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      fetchMe();
    }
  }, [accessToken, fetchMe]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#3B82F6',
            borderRadius: 12,
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
