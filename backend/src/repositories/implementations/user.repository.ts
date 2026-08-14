import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IUserDocument } from '../../entities/userEntity';
import { IUserRepository } from '../interfaces/IUserRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.UserModel) private _userModel: Model<IUserDocument>
  ) {}

  async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
    const user = new this._userModel(data);
    return await user.save();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return await this._userModel.findById(id).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await this._userModel.findOne({ email }).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
  }

  async findMany(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ items: IUserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this._userModel
        .find(filter)
        .populate('role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this._userModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(
    id: string,
    data: Partial<IUserDocument>
  ): Promise<IUserDocument | null> {
    return await this._userModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this._userModel.findByIdAndDelete(id);
    return result !== null;
  }
}
