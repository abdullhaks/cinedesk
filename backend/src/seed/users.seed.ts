import { UserStatus } from '../utils/enum';

// User seed data per plan.md Section 12 step 3
// All passwords: Password123!
export const USER_SEEDS = [
  {
    fullName: 'Super Admin',
    email: 'superadmin@tendagon.test',
    password: 'Password123!',
    roleSlug: 'super_admin',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Production Admin',
    email: 'prodadmin@tendagon.test',
    password: 'Password123!',
    roleSlug: 'production_admin',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Production Manager',
    email: 'pm@tendagon.test',
    password: 'Password123!',
    roleSlug: 'production_manager',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Finance Manager',
    email: 'finance@tendagon.test',
    password: 'Password123!',
    roleSlug: 'finance_manager',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Location Manager',
    email: 'location@tendagon.test',
    password: 'Password123!',
    roleSlug: 'location_manager',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Costume Manager',
    email: 'costume@tendagon.test',
    password: 'Password123!',
    roleSlug: 'costume_manager',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Cast Member',
    email: 'cast@tendagon.test',
    password: 'Password123!',
    roleSlug: 'cast',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Crew Member',
    email: 'crew@tendagon.test',
    password: 'Password123!',
    roleSlug: 'crew',
    status: UserStatus.ACTIVE,
  },
  {
    fullName: 'Deactivated User',
    email: 'deactivated@tendagon.test',
    password: 'Password123!',
    roleSlug: 'crew',
    status: UserStatus.DEACTIVATED,
  },
  {
    fullName: 'David Miller (Applicant)',
    email: 'applicant@tendagon.test',
    password: 'Password123!',
    roleSlug: '',
    status: UserStatus.PENDING_ONBOARDING,
    contractorType: 'Cast',
  },
  {
    fullName: 'Elena Rostova (Contractor)',
    email: 'changes@tendagon.test',
    password: 'Password123!',
    roleSlug: '',
    status: UserStatus.PENDING_ONBOARDING,
    contractorType: 'Freelancer',
  },
];

