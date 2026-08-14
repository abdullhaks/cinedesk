export const PERMISSIONS = {
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DEACTIVATE: 'users.deactivate',
  USERS_ASSIGN_ROLE: 'users.assign_role',

  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',

  PRODUCTIONS_VIEW: 'productions.view',
  PRODUCTIONS_CREATE: 'productions.create',
  PRODUCTIONS_UPDATE: 'productions.update',
  PRODUCTIONS_DELETE: 'productions.delete',

  ONBOARDING_VIEW_OWN: 'onboarding.view_own',
  ONBOARDING_SUBMIT: 'onboarding.submit',
  ONBOARDING_REVIEW: 'onboarding.review',

  LOCATIONS_VIEW: 'locations.view',
  LOCATIONS_CREATE: 'locations.create',
  LOCATIONS_UPDATE: 'locations.update',
  LOCATIONS_APPROVE: 'locations.approve',
  LOCATIONS_BOOK: 'locations.book',

  FUNDS_VIEW: 'funds.view',
  FUNDS_REQUEST: 'funds.request',
  FUNDS_APPROVE: 'funds.approve',
  FUNDS_REJECT: 'funds.reject',

  COSTUMES_VIEW: 'costumes.view',
  COSTUMES_CREATE: 'costumes.create',
  COSTUMES_UPDATE: 'costumes.update',
  COSTUMES_ASSIGN: 'costumes.assign',

  REPORTS_VIEW: 'reports.view',
  AUDIT_LOGS_VIEW: 'audit_logs.view',
  NOTIFICATIONS_VIEW_OWN: 'notifications.view_own',
} as const;
