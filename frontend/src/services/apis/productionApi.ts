import axiosInstance from '../../utils/axiosFactory';
import type { Production, Character } from '../../interfaces/production';

export const productionApi = {
  listProductions: async (filter?: { status?: string; search?: string }): Promise<{ items: Production[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/productions?${params.toString()}`);
    return res.data;
  },

  getProductionById: async (id: string): Promise<Production> => {
    const res = await axiosInstance.get(`/api/productions/${id}`);
    return res.data.production;
  },

  createProduction: async (data: any): Promise<Production> => {
    const res = await axiosInstance.post('/api/productions', data);
    return res.data.production;
  },

  updateProduction: async (id: string, data: any): Promise<Production> => {
    const res = await axiosInstance.put(`/api/productions/${id}`, data);
    return res.data.production;
  },

  deleteProduction: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/productions/${id}`);
  },

  assignCast: async (id: string, userId: string): Promise<Production> => {
    const res = await axiosInstance.post(`/api/productions/${id}/cast`, { userId });
    return res.data.production;
  },

  removeCast: async (id: string, userId: string): Promise<Production> => {
    const res = await axiosInstance.delete(`/api/productions/${id}/cast`, { data: { userId } });
    return res.data.production;
  },

  assignCrew: async (id: string, userId: string, department: string, position: string): Promise<Production> => {
    const res = await axiosInstance.post(`/api/productions/${id}/crew`, { userId, department, position });
    return res.data.production;
  },

  removeCrew: async (id: string, userId: string): Promise<Production> => {
    const res = await axiosInstance.delete(`/api/productions/${id}/crew`, { data: { userId } });
    return res.data.production;
  },

  createCharacter: async (id: string, data: { name: string; description?: string; castMember?: string }): Promise<Character> => {
    const res = await axiosInstance.post(`/api/productions/${id}/characters`, data);
    return res.data.character;
  },

  listCharacters: async (id: string): Promise<Character[]> => {
    const res = await axiosInstance.get(`/api/productions/${id}/characters`);
    return res.data.items;
  },
};
