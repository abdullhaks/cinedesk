import { INotificationDocument } from '../../entities/notificationEntity';

export interface INotificationService {
  createNotification(
    recipientId: string,
    title: string,
    messageText: string,
    type?: 'info' | 'warning' | 'success' | 'error',
    link?: string
  ): Promise<INotificationDocument>;
  listNotificationsForUser(userId: string, unreadOnly?: boolean): Promise<INotificationDocument[]>;
  markAsRead(id: string, userId: string): Promise<INotificationDocument | null>;
  markAllAsRead(userId: string): Promise<boolean>;
}
