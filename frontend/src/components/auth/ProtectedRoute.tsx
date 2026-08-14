import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../zustand/authStore';
import { usePermission } from '../../hooks/usePermission';
import { ROUTES } from '../../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { hasPermission } = usePermission();

  // 1. Unauthenticated -> redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 2. Pending onboarding -> allow access to onboarding wizard, status page, and apply flow
  const isOnboardingRoute =
    location.pathname.startsWith('/onboarding') || location.pathname === ROUTES.APPLY;

  if (user.status === 'pending_onboarding' && !isOnboardingRoute) {
    return <Navigate to={ROUTES.ONBOARDING_STATUS} replace />;
  }

  // 3. Permission check -> redirect to /unauthorized if missing permission
  if (permission && !hasPermission(permission)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
