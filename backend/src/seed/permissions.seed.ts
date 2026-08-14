// Permission seed data per plan.md Section 6.1
export const PERMISSION_SEEDS = [
  // Users module
  { key: 'users.view', module: 'users', description: 'View users' },
  { key: 'users.create', module: 'users', description: 'Create users' },
  { key: 'users.update', module: 'users', description: 'Update users' },
  { key: 'users.deactivate', module: 'users', description: 'Deactivate users' },
  { key: 'users.assign_role', module: 'users', description: 'Assign roles to users' },

  // Roles module
  { key: 'roles.view', module: 'roles', description: 'View roles' },
  { key: 'roles.manage', module: 'roles', description: 'Create and manage roles and permissions' },

  // Productions module
  { key: 'productions.view', module: 'productions', description: 'View productions' },
  { key: 'productions.create', module: 'productions', description: 'Create productions' },
  { key: 'productions.update', module: 'productions', description: 'Update productions' },
  { key: 'productions.delete', module: 'productions', description: 'Delete productions' },

  // Onboarding module
  { key: 'onboarding.view_own', module: 'onboarding', description: 'View own onboarding application' },
  { key: 'onboarding.submit', module: 'onboarding', description: 'Submit onboarding application' },
  { key: 'onboarding.review', module: 'onboarding', description: 'Review onboarding applications' },

  // Locations module
  { key: 'locations.view', module: 'locations', description: 'View locations' },
  { key: 'locations.create', module: 'locations', description: 'Create locations' },
  { key: 'locations.update', module: 'locations', description: 'Update locations' },
  { key: 'locations.approve', module: 'locations', description: 'Approve locations' },
  { key: 'locations.book', module: 'locations', description: 'Book locations' },

  // Funds module
  { key: 'funds.view', module: 'funds', description: 'View fund requests' },
  { key: 'funds.request', module: 'funds', description: 'Create fund requests' },
  { key: 'funds.approve', module: 'funds', description: 'Approve fund requests' },
  { key: 'funds.reject', module: 'funds', description: 'Reject fund requests' },

  // Costumes module
  { key: 'costumes.view', module: 'costumes', description: 'View costumes' },
  { key: 'costumes.create', module: 'costumes', description: 'Create costumes' },
  { key: 'costumes.update', module: 'costumes', description: 'Update costumes' },
  { key: 'costumes.assign', module: 'costumes', description: 'Assign costumes' },

  // Reports module
  { key: 'reports.view', module: 'reports', description: 'View reports' },

  // Audit logs module
  { key: 'audit_logs.view', module: 'audit_logs', description: 'View audit logs' },

  // Notifications module
  { key: 'notifications.view_own', module: 'notifications', description: 'View own notifications' },
];
