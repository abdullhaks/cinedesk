import axiosInstance from '../../utils/axiosFactory';
import type { AuditLogItem } from '../../interfaces/auditLog';

export const auditLogApi = {
  listLogs: async (filter?: { action?: string; targetEntity?: string; actor?: string; search?: string }): Promise<{ items: AuditLogItem[]; total: number }> => {
    const params = new URLSearchParams();
    if (filter?.action) params.append('action', filter.action);
    if (filter?.targetEntity) params.append('targetEntity', filter.targetEntity);
    if (filter?.actor) params.append('actor', filter.actor);
    if (filter?.search) params.append('search', filter.search);

    const res = await axiosInstance.get(`/api/audit-logs?${params.toString()}`);
    return res.data;
  },
};
