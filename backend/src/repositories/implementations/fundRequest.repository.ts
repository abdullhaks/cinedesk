import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IFundRequestDocument } from '../../entities/fundRequestEntity';
import { IFundRequestRepository } from '../interfaces/IFundRequestRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class FundRequestRepository implements IFundRequestRepository {
  constructor(
    @inject(TYPES.FundRequestModel) private _model: Model<IFundRequestDocument>
  ) {}

  async create(data: Partial<IFundRequestDocument>): Promise<IFundRequestDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IFundRequestDocument | null> {
    return await this._model
      .findById(id)
      .populate('production', 'title status budget')
      .populate('requester', 'fullName email contractorType profilePhoto')
      .populate('approver', 'fullName email profilePhoto');
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: IFundRequestDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('production', 'title status')
        .populate('requester', 'fullName email contractorType profilePhoto')
        .populate('approver', 'fullName email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(
    id: string,
    data: Partial<IFundRequestDocument>
  ): Promise<IFundRequestDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('production', 'title status budget')
      .populate('requester', 'fullName email contractorType profilePhoto')
      .populate('approver', 'fullName email profilePhoto');
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this._model.findByIdAndDelete(id);
    return res !== null;
  }
}
