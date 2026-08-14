import type { User } from './user';
import type { Production, Character } from './production';

export type CostumeStatus = 'Available' | 'Assigned' | 'In Cleaning' | 'Damaged' | 'Retired';

export interface CostumeItem {
  _id: string;
  name: string;
  category: string;
  size: string;
  character?: Character | null;
  production: Production;
  status: CostumeStatus;
  images: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CostumeAssignmentItem {
  _id: string;
  costume: CostumeItem;
  actor: User;
  character?: Character | null;
  assignedBy: User;
  assignedAt: string;
  returnedAt?: string | null;
  notes?: string;
}
