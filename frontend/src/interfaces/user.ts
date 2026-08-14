export interface Permission {
  _id: string;
  key: string;
  module: string;
  description: string;
}

export interface Role {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  permissions: (Permission | string)[];
  isSystemRole: boolean;
}

export type ContractorType =
  | 'Freelancer'
  | 'Cast'
  | 'Supplier'
  | 'Cast-Crew Agent'
  | 'TCS Team'
  | 'Intern';

export type UserStatus = 'pending_onboarding' | 'active' | 'deactivated';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
  contractorType: ContractorType | null;
  status: UserStatus;
  profilePhoto?: string;
  phone?: string;
  department?: string;
  position?: string;
}
