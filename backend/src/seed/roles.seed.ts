// Role seed data per plan.md Section 6.2
// The `*` wildcard means all permissions (Super Admin only)
export const ROLE_SEEDS = [
  {
    name: 'Super Admin',
    slug: 'super_admin',
    permissionKeys: ['*'],
    isSystemRole: true,
  },
  {
    name: 'Production Admin',
    slug: 'production_admin',
    permissionKeys: [
      'users.view', 'users.update', 'users.assign_role',
      'productions.view', 'productions.create', 'productions.update', 'productions.delete',
      'onboarding.review',
      'reports.view',
      'audit_logs.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Production Manager',
    slug: 'production_manager',
    permissionKeys: [
      'productions.view', 'productions.update',
      'locations.view',
      'funds.request', 'funds.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Finance Manager',
    slug: 'finance_manager',
    permissionKeys: [
      'funds.view', 'funds.approve', 'funds.reject',
      'productions.view',
      'reports.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Location Manager',
    slug: 'location_manager',
    permissionKeys: [
      'locations.view', 'locations.create', 'locations.update',
      'locations.approve', 'locations.book',
      'productions.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Costume Manager',
    slug: 'costume_manager',
    permissionKeys: [
      'costumes.view', 'costumes.create', 'costumes.update', 'costumes.assign',
      'productions.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Cast',
    slug: 'cast',
    permissionKeys: [
      'productions.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Crew',
    slug: 'crew',
    permissionKeys: [
      'productions.view',
    ],
    isSystemRole: true,
  },
];
