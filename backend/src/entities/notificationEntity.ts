import { Document, Types } from 'mongoose';

export interface INotificationDocument extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  relatedResource: {
    module: string;
    id: Types.ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
