import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { INotificationDocument } from '../../entities/notificationEntity';
import { INotificationRepository } from '../interfaces/INotificationRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class NotificationRepository implements INotificationRepository {
  constructor(
    @inject(TYPES.NotificationModel) private _model: Model<INotificationDocument>
  ) {}

  async create(data: Partial<INotificationDocument>): Promise<INotificationDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findByUser(userId: string, unreadOnly = false): Promise<INotificationDocument[]> {
    const query: any = { recipient: userId };
    if (unreadOnly) query.isRead = false;
    return await this._model.find(query).sort({ createdAt: -1 }).limit(50);
  }

  async findByRecipient(recipientId: string, page: number, limit: number): Promise<{ items: INotificationDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model.find({ recipient: recipientId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments({ recipient: recipientId }),
    ]);
    return { items, total };
  }

  async markAsRead(id: string, userId?: string): Promise<INotificationDocument | null> {
    const query: any = { _id: id };
    if (userId) query.recipient = userId;
    return await this._model.findOneAndUpdate(
      query,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    await this._model.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    return true;
  }
}
