import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IRoleDocument } from '../../entities/roleEntity';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class RoleRepository implements IRoleRepository {
  constructor(
    @inject(TYPES.RoleModel) private _roleModel: Model<IRoleDocument>
  ) {}

  async create(data: Partial<IRoleDocument>): Promise<IRoleDocument> {
    const role = new this._roleModel(data);
    return await role.save();
  }

  async findById(id: string): Promise<IRoleDocument | null> {
    return await this._roleModel.findById(id).populate('permissions');
  }

  async findBySlug(slug: string): Promise<IRoleDocument | null> {
    return await this._roleModel.findOne({ slug }).populate('permissions');
  }

  async findAll(): Promise<IRoleDocument[]> {
    return await this._roleModel.find().populate('permissions');
  }

  async updateById(
    id: string,
    data: Partial<IRoleDocument>
  ): Promise<IRoleDocument | null> {
    return await this._roleModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('permissions');
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this._roleModel.findByIdAndDelete(id);
    return result !== null;
  }
}
