import type { User } from './user';
import type { Production } from './production';

export type LocationStatus = 'Requested' | 'Under Review' | 'Approved' | 'Booked';

export interface LocationBooking {
  startDate: string;
  endDate: string;
  production: Production | string;
  bookedBy?: User | string;
}

export interface LocationItem {
  _id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  submittedBy?: User;
  images: string[];
  permits?: string[];
  notes: string;
  status: LocationStatus;
  bookingCalendar: LocationBooking[];
  createdAt: string;
  updatedAt: string;
}
