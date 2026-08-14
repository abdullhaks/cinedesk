import type { User } from './user';
import type { Production } from './production';

export type FundRequestStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';

export interface FundRequestItem {
  _id: string;
  production: Production;
  requester: User;
  amount: number;
  category: string;
  justification: string;
  status: FundRequestStatus;
  approver?: User | null;
  reviewedAt?: string | null;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}
