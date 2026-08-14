import axiosInstance from '../../utils/axiosFactory';
import type { LocationItem } from '../../interfaces/location';

export const locationApi = {
  listLocations: async (filter?: { status?: string; search?: string }): Promise<{ items: LocationItem[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/locations?${params.toString()}`);
    return res.data;
  },

  getLocationById: async (id: string): Promise<LocationItem> => {
    const res = await axiosInstance.get(`/api/locations/${id}`);
    return res.data.location;
  },

  createLocation: async (data: { name: string; address: string; lat?: number; lng?: number; notes?: string }): Promise<LocationItem> => {
    const res = await axiosInstance.post('/api/locations', data);
    return res.data.location;
  },

  updateLocation: async (id: string, data: any): Promise<LocationItem> => {
    const res = await axiosInstance.put(`/api/locations/${id}`, data);
    return res.data.location;
  },

  bookLocation: async (id: string, data: { productionId: string; startDate: string; endDate: string }): Promise<LocationItem> => {
    const res = await axiosInstance.post(`/api/locations/${id}/book`, data);
    return res.data.location;
  },

  approveLocation: async (id: string): Promise<LocationItem> => {
    const res = await axiosInstance.patch(`/api/locations/${id}/approve`);
    return res.data.location;
  },

  deleteLocation: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/locations/${id}`);
  },
};
