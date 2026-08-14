import { ROUTES } from './routes';
import { PERMISSIONS } from './permissions';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  iconName: string;
  permission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    iconName: 'LayoutDashboard',
  },
  {
    key: 'admin-users',
    label: 'Users',
    path: ROUTES.ADMIN_USERS,
    iconName: 'Users',
    permission: PERMISSIONS.USERS_VIEW,
  },
  {
    key: 'admin-roles',
    label: 'Roles & Permissions',
    path: ROUTES.ADMIN_ROLES,
    iconName: 'ShieldCheck',
    permission: PERMISSIONS.ROLES_VIEW,
  },
  {
    key: 'admin-onboarding',
    label: 'Onboarding Approvals',
    path: ROUTES.ADMIN_ONBOARDING,
    iconName: 'ClipboardCheck',
    permission: PERMISSIONS.ONBOARDING_REVIEW,
  },
  {
    key: 'productions',
    label: 'Productions',
    path: ROUTES.PRODUCTIONS,
    iconName: 'Film',
    permission: PERMISSIONS.PRODUCTIONS_VIEW,
  },
  {
    key: 'locations',
    label: 'Locations',
    path: ROUTES.LOCATIONS,
    iconName: 'MapPin',
    permission: PERMISSIONS.LOCATIONS_VIEW,
  },
  {
    key: 'funds',
    label: 'Fund Requests',
    path: ROUTES.FUNDS,
    iconName: 'DollarSign',
    permission: PERMISSIONS.FUNDS_VIEW,
  },
  {
    key: 'costumes',
    label: 'Costumes',
    path: ROUTES.COSTUMES,
    iconName: 'Shirt',
    permission: PERMISSIONS.COSTUMES_VIEW,
  },
  {
    key: 'admin-audit-logs',
    label: 'Audit Logs',
    path: ROUTES.ADMIN_AUDIT_LOGS,
    iconName: 'History',
    permission: PERMISSIONS.AUDIT_LOGS_VIEW,
  },
];
