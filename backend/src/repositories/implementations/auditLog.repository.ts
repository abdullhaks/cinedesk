import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IAuditLogDocument } from '../../entities/auditLogEntity';
import { IAuditLogRepository } from '../interfaces/IAuditLogRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class AuditLogRepository implements IAuditLogRepository {
  constructor(
    @inject(TYPES.AuditLogModel) private _model: Model<IAuditLogDocument>
  ) {}

  async create(data: Partial<IAuditLogDocument>): Promise<IAuditLogDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: IAuditLogDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('actor', 'fullName email contractorType profilePhoto')
        .sort({ timestamp: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }
}
