import type { User } from './user';

export type ProductionStatus =
  | 'Development'
  | 'Pre-Production'
  | 'Production'
  | 'Post-Production'
  | 'Completed'
  | 'Archived';

export interface Production {
  _id: string;
  title: string;
  description: string;
  status: ProductionStatus;
  startDate: string;
  endDate: string;
  productionManager: User | string;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  assignedCast: User[];
  assignedCrew: {
    user: User;
    department: string;
    position: string;
  }[];
  locations: string[];
  notes: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  _id: string;
  production: string;
  name: string;
  description: string;
  castMember?: User | null;
}
