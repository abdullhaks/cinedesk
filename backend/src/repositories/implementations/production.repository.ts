import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IProductionDocument } from '../../entities/productionEntity';
import { IProductionRepository } from '../interfaces/IProductionRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class ProductionRepository implements IProductionRepository {
  constructor(
    @inject(TYPES.ProductionModel) private _model: Model<IProductionDocument>
  ) {}

  async create(data: Partial<IProductionDocument>): Promise<IProductionDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IProductionDocument | null> {
    return await this._model
      .findById(id)
      .populate('productionManager', 'fullName email status profilePhoto')
      .populate('assignedCast', 'fullName email status contractorType profilePhoto')
      .populate('assignedCrew.user', 'fullName email status contractorType profilePhoto')
      .populate('createdBy', 'fullName email');
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: IProductionDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('productionManager', 'fullName email status profilePhoto')
        .populate('assignedCast', 'fullName email status contractorType profilePhoto')
        .populate('assignedCrew.user', 'fullName email status contractorType profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(
    id: string,
    data: Partial<IProductionDocument>
  ): Promise<IProductionDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('productionManager', 'fullName email status profilePhoto')
      .populate('assignedCast', 'fullName email status contractorType profilePhoto')
      .populate('assignedCrew.user', 'fullName email status contractorType profilePhoto');
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this._model.findByIdAndDelete(id);
    return res !== null;
  }

  async findByManager(
    managerId: string,
    page: number,
    limit: number
  ): Promise<{ items: IProductionDocument[]; total: number }> {
    return await this.findMany({ productionManager: managerId }, page, limit);
  }
}
