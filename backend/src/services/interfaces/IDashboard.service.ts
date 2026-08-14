export interface IDashboardStats {
  activeProductionsCount: number;
  totalFundRequestedAmount: number;
  totalFundApprovedAmount: number;
  approvedPercentage: number;
  bookedLocationsCount: number;
  costumeInventoryCount: number;
  assignedCostumesCount: number;
  assignedCharactersCount: number;
  pendingOnboardingsCount: number;
  pendingFundRequestsCount: number;
  activeRolesCount: number;
  monthlyExpenses: Array<{ month: string; val: number; label: string; primary?: boolean }>;
}

export interface IDashboardService {
  getStats(userId: string): Promise<IDashboardStats>;
}
