import { Schema, model } from 'mongoose';
import { INotificationDocument } from '../entities/notificationEntity';

const notificationSchema = new Schema<INotificationDocument>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    relatedResource: {
      module: { type: String },
      id: { type: Schema.Types.ObjectId },
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = model<INotificationDocument>('Notification', notificationSchema);
export default Notification;
