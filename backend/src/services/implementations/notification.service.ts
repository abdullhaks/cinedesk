import { injectable, inject } from 'inversify';
import { INotificationService } from '../interfaces/INotification.service';
import { INotificationRepository } from '../../repositories/interfaces/INotificationRepository';
import { INotificationDocument } from '../../entities/notificationEntity';
import TYPES from '../../config/inversify.types';

@injectable()
export default class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository) private _notifRepo: INotificationRepository
  ) {}

  async createNotification(
    recipientId: string,
    title: string,
    messageText: string,
    type: 'info' | 'warning' | 'success' | 'error' = 'info',
    link = ''
  ): Promise<INotificationDocument> {
    return await this._notifRepo.create({
      recipient: recipientId as any,
      title,
      message: messageText,
      type,
      link,
      isRead: false,
    } as any);
  }

  async listNotificationsForUser(userId: string, unreadOnly = false): Promise<INotificationDocument[]> {
    return await this._notifRepo.findByUser(userId, unreadOnly);
  }

  async markAsRead(id: string, userId: string): Promise<INotificationDocument | null> {
    return await this._notifRepo.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this._notifRepo.markAllAsRead(userId);
  }
}
