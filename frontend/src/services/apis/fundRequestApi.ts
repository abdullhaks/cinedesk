import axiosInstance from '../../utils/axiosFactory';
import type { FundRequestItem } from '../../interfaces/fundRequest';

export const fundRequestApi = {
  listRequests: async (filter?: { status?: string; production?: string; category?: string; search?: string }): Promise<{ items: FundRequestItem[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.production) params.append('production', filter.production);
    if (filter?.category) params.append('category', filter.category);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/fund-requests?${params.toString()}`);
    return res.data;
  },

  getRequestById: async (id: string): Promise<FundRequestItem> => {
    const res = await axiosInstance.get(`/api/fund-requests/${id}`);
    return res.data.fundRequest;
  },

  createRequest: async (data: { productionId: string; amount: number; category: string; justification?: string }): Promise<FundRequestItem> => {
    const res = await axiosInstance.post('/api/fund-requests', data);
    return res.data.fundRequest;
  },

  submitRequest: async (id: string): Promise<FundRequestItem> => {
    const res = await axiosInstance.post(`/api/fund-requests/${id}/submit`);
    return res.data.fundRequest;
  },

  approveRequest: async (id: string, comments?: string): Promise<FundRequestItem> => {
    const res = await axiosInstance.patch(`/api/fund-requests/${id}/approve`, { comments });
    return res.data.fundRequest;
  },

  rejectRequest: async (id: string, comments?: string): Promise<FundRequestItem> => {
    const res = await axiosInstance.patch(`/api/fund-requests/${id}/reject`, { comments });
    return res.data.fundRequest;
  },

  disburseRequest: async (id: string): Promise<FundRequestItem> => {
    const res = await axiosInstance.patch(`/api/fund-requests/${id}/disburse`);
    return res.data.fundRequest;
  },

  deleteRequest: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/fund-requests/${id}`);
  },
};
