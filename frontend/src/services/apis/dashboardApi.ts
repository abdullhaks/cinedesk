import axiosInstance from '../../utils/axiosFactory';

export interface DashboardStatsResponse {
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

export const dashboardApi = {
  getStats: async (): Promise<DashboardStatsResponse> => {
    const res = await axiosInstance.get('/api/dashboard/stats');
    return res.data.stats;
  },
};
