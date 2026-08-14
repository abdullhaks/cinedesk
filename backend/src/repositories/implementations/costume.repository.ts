import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { ICostumeDocument } from '../../entities/costumeEntity';
import { ICostumeRepository } from '../interfaces/ICostumeRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class CostumeRepository implements ICostumeRepository {
  constructor(
    @inject(TYPES.CostumeModel) private _model: Model<ICostumeDocument>
  ) {}

  async create(data: Partial<ICostumeDocument>): Promise<ICostumeDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<ICostumeDocument | null> {
    return await this._model
      .findById(id)
      .populate('production', 'title status')
      .populate('character', 'name description')
      .populate('createdBy', 'fullName email');
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: ICostumeDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('production', 'title status')
        .populate('character', 'name description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(
    id: string,
    data: Partial<ICostumeDocument>
  ): Promise<ICostumeDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('production', 'title status')
      .populate('character', 'name description');
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this._model.findByIdAndDelete(id);
    return res !== null;
  }
}
