export interface NotificationItem {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link: string;
  isRead: boolean;
  createdAt: string;
}
