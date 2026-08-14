import axiosInstance from '../../utils/axiosFactory';
import type { CostumeItem, CostumeAssignmentItem } from '../../interfaces/costume';

export const costumeApi = {
  listCostumes: async (filter?: { status?: string; production?: string; category?: string; search?: string }): Promise<{ items: CostumeItem[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.production) params.append('production', filter.production);
    if (filter?.category) params.append('category', filter.category);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/costumes?${params.toString()}`);
    return res.data;
  },

  getCostumeById: async (id: string): Promise<CostumeItem> => {
    const res = await axiosInstance.get(`/api/costumes/${id}`);
    return res.data.costume;
  },

  createCostume: async (data: { name: string; productionId: string; category?: string; size?: string; notes?: string }): Promise<CostumeItem> => {
    const res = await axiosInstance.post('/api/costumes', data);
    return res.data.costume;
  },

  updateCostume: async (id: string, data: any): Promise<CostumeItem> => {
    const res = await axiosInstance.put(`/api/costumes/${id}`, data);
    return res.data.costume;
  },

  assignCostume: async (costumeId: string, data: { actorUserId: string; characterId?: string; notes?: string }): Promise<{ costume: CostumeItem; assignment: CostumeAssignmentItem }> => {
    const res = await axiosInstance.post(`/api/costumes/${costumeId}/assign`, data);
    return res.data;
  },

  returnCostume: async (assignmentId: string, notes?: string): Promise<{ costume: CostumeItem; assignment: CostumeAssignmentItem }> => {
    const res = await axiosInstance.post(`/api/costumes/${assignmentId}/return`, { notes });
    return res.data;
  },

  deleteCostume: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/costumes/${id}`);
  },
};
