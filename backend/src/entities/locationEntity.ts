import { Document, Types } from 'mongoose';
import { LocationStatus } from '../utils/enum';

export interface ILocationDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  submittedBy?: Types.ObjectId;
  contactPerson?: string;
  contactNumber?: string;
  images: string[];
  permits?: string[];
  documents?: Array<{
    name: string;
    url: string;
  }>;
  rentalCost?: number;
  permitInfo?: string;
  notes: string;
  status: LocationStatus;
  bookingCalendar?: Array<{
    startDate: Date;
    endDate: Date;
    production: Types.ObjectId;
    bookedBy: Types.ObjectId;
  }>;
  bookings?: Array<{
    production: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
