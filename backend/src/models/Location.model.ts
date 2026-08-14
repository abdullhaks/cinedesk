import { Schema, model } from 'mongoose';
import { ILocationDocument } from '../entities/locationEntity';
import { LocationStatus } from '../utils/enum';

const locationSchema = new Schema<ILocationDocument>(
  {
    name: { type: String, required: true },
    address: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    contactPerson: { type: String, default: '' },
    contactNumber: { type: String, default: '' },
    images: [{ type: String }],
    permits: [{ type: String }],
    documents: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    rentalCost: { type: Number, default: 0 },
    permitInfo: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(LocationStatus),
      default: LocationStatus.REQUESTED,
    },
    bookingCalendar: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        production: { type: Schema.Types.ObjectId, ref: 'Production', required: true },
        bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Location = model<ILocationDocument>('Location', locationSchema);
export default Location;
