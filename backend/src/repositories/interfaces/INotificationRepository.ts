import { INotificationDocument } from '../../entities/notificationEntity';
export interface INotificationRepository {
  create(data: Partial<INotificationDocument>): Promise<INotificationDocument>;
  findByUser(userId: string, unreadOnly?: boolean): Promise<INotificationDocument[]>;
  findByRecipient(recipientId: string, page: number, limit: number): Promise<{ items: INotificationDocument[]; total: number }>;
  markAsRead(id: string, userId?: string): Promise<INotificationDocument | null>;
  markAllAsRead(userId: string): Promise<boolean>;
}
