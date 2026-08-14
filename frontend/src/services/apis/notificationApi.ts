import axiosInstance from '../../utils/axiosFactory';
import type { NotificationItem } from '../../interfaces/notification';

export const notificationApi = {
  getMyNotifications: async (unreadOnly = false): Promise<NotificationItem[]> => {
    const res = await axiosInstance.get(`/api/notifications?unreadOnly=${unreadOnly}`);
    return res.data.items;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const res = await axiosInstance.patch(`/api/notifications/${id}/read`);
    return res.data.notification;
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch('/api/notifications/read-all');
  },
};
