import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Login } from '../features/auth/Login';
import { SignupContractor } from '../features/auth/SignupContractor';
import { Unauthorized } from '../features/auth/Unauthorized';
import { Dashboard } from '../features/dashboard/Dashboard';
import { RoleManagement } from '../features/admin/RoleManagement';
import { Apply } from '../features/onboarding/Apply';
import { OnboardingWizard } from '../features/onboarding/OnboardingWizard';
import { OnboardingStatusPage } from '../features/onboarding/OnboardingStatus';
import { OnboardingReview } from '../features/admin/OnboardingReview';
import { UserManagement } from '../features/admin/UserManagement';
import { ProductionList } from '../features/productions/ProductionList';
import { ProductionDetail } from '../features/productions/ProductionDetail';
import { LocationList } from '../features/locations/LocationList';
import { FundRequestList } from '../features/funds/FundRequestList';
import { CostumeList } from '../features/costumes/CostumeList';
import { AuditLogList } from '../features/admin/AuditLogList';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PERMISSIONS } from '../constants/permissions';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignupContractor />} />
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Onboarding Routes */}
      <Route
        path={ROUTES.APPLY}
        element={
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ONBOARDING_STATUS}
        element={
          <ProtectedRoute>
            <OnboardingStatusPage />
          </ProtectedRoute>
        }
      />
      <Route path="/onboarding" element={<Navigate to="/onboarding/1" replace />} />
      <Route
        path="/onboarding/:step"
        element={
          <ProtectedRoute>
            <OnboardingWizard />
          </ProtectedRoute>
        }
      />

      {/* Protected App Routes wrapped in DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

        <Route
          path={ROUTES.ADMIN_ROLES}
          element={
            <ProtectedRoute permission={PERMISSIONS.ROLES_VIEW}>
              <RoleManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_ONBOARDING}
          element={
            <ProtectedRoute permission={PERMISSIONS.ONBOARDING_REVIEW}>
              <OnboardingReview />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <ProtectedRoute permission={PERMISSIONS.USERS_VIEW}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PRODUCTIONS}
          element={
            <ProtectedRoute permission={PERMISSIONS.PRODUCTIONS_VIEW}>
              <ProductionList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productions/:id"
          element={
            <ProtectedRoute permission={PERMISSIONS.PRODUCTIONS_VIEW}>
              <ProductionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOCATIONS}
          element={
            <ProtectedRoute permission={PERMISSIONS.LOCATIONS_VIEW}>
              <LocationList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.FUNDS}
          element={
            <ProtectedRoute permission={PERMISSIONS.FUNDS_VIEW}>
              <FundRequestList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.COSTUMES}
          element={
            <ProtectedRoute permission={PERMISSIONS.COSTUMES_VIEW}>
              <CostumeList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_AUDIT_LOGS}
          element={
            <ProtectedRoute permission={PERMISSIONS.AUDIT_LOGS_VIEW}>
              <AuditLogList />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};
