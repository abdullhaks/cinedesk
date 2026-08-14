import { injectable, inject } from 'inversify';
import { ILocationService } from '../interfaces/ILocation.service';
import { ILocationRepository } from '../../repositories/interfaces/ILocationRepository';
import { IProductionRepository } from '../../repositories/interfaces/IProductionRepository';
import { ILocationDocument } from '../../entities/locationEntity';
import TYPES from '../../config/inversify.types';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { LocationStatus } from '../../utils/enum';

@injectable()
export default class LocationService implements ILocationService {
  constructor(
    @inject(TYPES.ILocationRepository) private _locationRepo: ILocationRepository,
    @inject(TYPES.IProductionRepository) private _productionRepo: IProductionRepository
  ) {}

  async createLocation(data: any, actorId: string): Promise<ILocationDocument> {
    const loc = await this._locationRepo.create({
      name: data.name,
      address: data.address,
      coordinates: {
        lat: data.lat || 0,
        lng: data.lng || 0,
      },
      status: LocationStatus.REQUESTED,
      submittedBy: actorId as any,
      images: data.images || [],
      permits: data.permits || [],
      notes: data.notes || '',
      bookingCalendar: [],
    } as any);

    return (await this._locationRepo.findById(loc._id.toString()))!;
  }

  async getLocationById(id: string): Promise<ILocationDocument> {
    const loc = await this._locationRepo.findById(id);
    if (!loc) {
      throw ApiError.notFound(MESSAGES.location.notFound);
    }
    return loc;
  }

  async listLocations(
    filter: { status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: ILocationDocument[]; total: number }> {
    const queryFilter: any = {};
    if (filter.status) queryFilter.status = filter.status;
    if (filter.search) {
      queryFilter.name = { $regex: filter.search, $options: 'i' };
    }

    return await this._locationRepo.findMany(queryFilter, page, limit);
  }

  async updateLocation(id: string, data: any, _actorId: string): Promise<ILocationDocument> {
    const loc = await this._locationRepo.findById(id);
    if (!loc) {
      throw ApiError.notFound(MESSAGES.location.notFound);
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.address) updateData.address = data.address;
    if (data.status) updateData.status = data.status;
    if (data.lat !== undefined && data.lng !== undefined) {
      updateData.coordinates = { lat: data.lat, lng: data.lng };
    }
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.images) updateData.images = data.images;
    if (data.permits) updateData.permits = data.permits;

    const updated = await this._locationRepo.updateById(id, updateData);
    return updated!;
  }

  async bookLocation(
    locationId: string,
    productionId: string,
    startDate: string,
    endDate: string,
    actorId: string
  ): Promise<ILocationDocument> {
    const loc = await this._locationRepo.findById(locationId);
    if (!loc) {
      throw ApiError.notFound(MESSAGES.location.notFound);
    }

    const prod = await this._productionRepo.findById(productionId);
    if (!prod) {
      throw ApiError.notFound('Production not found for booking');
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime()) || newStart >= newEnd) {
      throw ApiError.badRequest('Invalid booking date range');
    }

    // Booking Conflict Check (Section 11 edge case table)
    // Overlap condition: (existingStart <= newEnd) && (existingEnd >= newStart)
    const existingBookings = loc.bookingCalendar || [];
    const hasConflict = existingBookings.some((b) => {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      return bStart <= newEnd && bEnd >= newStart;
    });

    if (hasConflict) {
      throw ApiError.conflict(MESSAGES.location.conflict);
    }

    // Add booking to calendar
    existingBookings.push({
      startDate: newStart,
      endDate: newEnd,
      production: productionId as any,
      bookedBy: actorId as any,
    });

    const updated = await this._locationRepo.updateById(locationId, {
      bookingCalendar: existingBookings,
      status: LocationStatus.BOOKED,
    } as any);

    return updated!;
  }

  async approveLocation(locationId: string, _actorId: string): Promise<ILocationDocument> {
    const loc = await this._locationRepo.findById(locationId);
    if (!loc) {
      throw ApiError.notFound(MESSAGES.location.notFound);
    }

    const updated = await this._locationRepo.updateById(locationId, {
      status: LocationStatus.APPROVED,
    } as any);

    return updated!;
  }

  async deleteLocation(id: string): Promise<boolean> {
    const loc = await this._locationRepo.findById(id);
    if (!loc) {
      throw ApiError.notFound(MESSAGES.location.notFound);
    }
    return await this._locationRepo.deleteById(id);
  }
}
