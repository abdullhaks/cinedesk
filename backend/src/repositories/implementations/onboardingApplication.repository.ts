import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IOnboardingApplicationDocument } from '../../entities/onboardingApplicationEntity';
import { IOnboardingApplicationRepository } from '../interfaces/IOnboardingApplicationRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class OnboardingApplicationRepository
  implements IOnboardingApplicationRepository
{
  constructor(
    @inject(TYPES.OnboardingApplicationModel)
    private _model: Model<IOnboardingApplicationDocument>
  ) {}

  async create(
    data: Partial<IOnboardingApplicationDocument>
  ): Promise<IOnboardingApplicationDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IOnboardingApplicationDocument | null> {
    return await this._model
      .findById(id)
      .populate('applicant', 'fullName email contractorType status profilePhoto phone department position')
      .populate('reviewer', 'fullName email');
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: IOnboardingApplicationDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._model
        .find(filter)
        .populate('applicant', 'fullName email contractorType status profilePhoto phone department position')
        .populate('reviewer', 'fullName email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(
    id: string,
    data: Partial<IOnboardingApplicationDocument>
  ): Promise<IOnboardingApplicationDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('applicant', 'fullName email contractorType status profilePhoto phone department position')
      .populate('reviewer', 'fullName email');
  }

  async findByApplicant(
    applicantId: string
  ): Promise<IOnboardingApplicationDocument | null> {
    return await this._model
      .findOne({ applicant: applicantId })
      .populate('applicant', 'fullName email contractorType status profilePhoto phone department position')
      .populate('reviewer', 'fullName email');
  }
}
