import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { ILocationDocument } from '../../entities/locationEntity';
import { ILocationRepository } from '../interfaces/ILocationRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class LocationRepository implements ILocationRepository {
  constructor(
    @inject(TYPES.LocationModel) private _model: Model<ILocationDocument>
  ) {}

  async create(data: Partial<ILocationDocument>): Promise<ILocationDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<ILocationDocument | null> {
    return await this._model
      .findById(id)
      .populate('submittedBy', 'fullName email contractorType profilePhoto')
      .populate('bookingCalendar.production', 'title status')
      .populate('bookingCalendar.bookedBy', 'fullName email');
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: ILocationDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('submittedBy', 'fullName email contractorType profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(
    id: string,
    data: Partial<ILocationDocument>
  ): Promise<ILocationDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('submittedBy', 'fullName email contractorType profilePhoto')
      .populate('bookingCalendar.production', 'title status')
      .populate('bookingCalendar.bookedBy', 'fullName email');
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this._model.findByIdAndDelete(id);
    return res !== null;
  }

  async hasConflict(locationId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const loc = await this._model.findById(locationId);
    if (!loc || !loc.bookingCalendar) return false;
    return loc.bookingCalendar.some(
      (b) => new Date(b.startDate) <= endDate && new Date(b.endDate) >= startDate
    );
  }
}
