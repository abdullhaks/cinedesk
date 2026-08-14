import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { INotificationController } from '../interfaces/INotification.controller';
import { INotificationService } from '../../services/interfaces/INotification.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';

@injectable()
export default class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.INotificationService) private _notifService: INotificationService
  ) {}

  async getMyNotifications(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user._id.toString();
    const unreadOnly = req.query.unreadOnly === 'true';
    const notifications = await this._notifService.listNotificationsForUser(userId, unreadOnly);
    res.status(HttpStatusCode.OK).json({ items: notifications });
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const userId = (req as any).user._id.toString();
    const notification = await this._notifService.markAsRead(id, userId);
    res.status(HttpStatusCode.OK).json({ notification });
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user._id.toString();
    await this._notifService.markAllAsRead(userId);
    res.status(HttpStatusCode.OK).json({ message: 'All notifications marked as read' });
  }
}
