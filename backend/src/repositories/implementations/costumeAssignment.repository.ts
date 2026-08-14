import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { ICostumeAssignmentDocument } from '../../entities/costumeAssignmentEntity';
import { ICostumeAssignmentRepository } from '../interfaces/ICostumeAssignmentRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class CostumeAssignmentRepository implements ICostumeAssignmentRepository {
  constructor(
    @inject(TYPES.CostumeAssignmentModel) private _model: Model<ICostumeAssignmentDocument>
  ) {}

  async create(data: Partial<ICostumeAssignmentDocument>): Promise<ICostumeAssignmentDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<ICostumeAssignmentDocument | null> {
    return await this._model
      .findById(id)
      .populate('costume', 'name category size status')
      .populate('character', 'name')
      .populate('actor', 'fullName email contractorType profilePhoto')
      .populate('assignedBy', 'fullName email');
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: ICostumeAssignmentDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('costume', 'name category size status')
        .populate('character', 'name')
        .populate('actor', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async findActiveByCostume(costumeId: string): Promise<ICostumeAssignmentDocument | null> {
    return await this._model
      .findOne({ costume: costumeId, returnedAt: null })
      .populate('costume', 'name category size status')
      .populate('actor', 'fullName email');
  }

  async updateById(
    id: string,
    data: Partial<ICostumeAssignmentDocument>
  ): Promise<ICostumeAssignmentDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('costume', 'name category size status')
      .populate('character', 'name')
      .populate('actor', 'fullName email');
  }
}
