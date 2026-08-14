import axiosInstance from '../../utils/axiosFactory';
import type { OnboardingApplication } from '../../interfaces/onboarding';
import type { ContractorType } from '../../interfaces/user';

export const onboardingApi = {
  getMyApplication: async (): Promise<OnboardingApplication | null> => {
    const res = await axiosInstance.get('/api/onboarding/my-application');
    return res.data.application;
  },

  createDraft: async (contractorType: ContractorType): Promise<OnboardingApplication> => {
    const res = await axiosInstance.post('/api/onboarding', { contractorType });
    return res.data.application;
  },

  updateStep: async (
    id: string,
    stepName: string,
    stepData: any
  ): Promise<OnboardingApplication> => {
    const res = await axiosInstance.put(`/api/onboarding/${id}/step/${stepName}`, stepData);
    return res.data.application;
  },

  submit: async (id: string): Promise<OnboardingApplication> => {
    const res = await axiosInstance.post(`/api/onboarding/${id}/submit`);
    return res.data.application;
  },

  getById: async (id: string): Promise<OnboardingApplication> => {
    const res = await axiosInstance.get(`/api/onboarding/${id}`);
    return res.data.application;
  },

  uploadDocument: async (file: File): Promise<{ fileUrl: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post('/api/onboarding/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  listApplications: async (filter?: { status?: string; contractorType?: string; search?: string }): Promise<{ items: OnboardingApplication[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.contractorType) params.append('contractorType', filter.contractorType);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/onboarding?${params.toString()}`);
    return res.data;
  },

  reviewApplication: async (
    id: string,
    action: 'approve' | 'reject' | 'request_changes',
    reviewComments?: string,
    rejectionReason?: string
  ): Promise<OnboardingApplication> => {
    const res = await axiosInstance.patch(`/api/onboarding/${id}/review`, {
      action,
      comments: reviewComments,
      rejectionReason,
    });
    return res.data.application;
  },
};
