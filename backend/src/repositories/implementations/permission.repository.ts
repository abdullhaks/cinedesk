import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { IPermissionDocument } from '../../entities/permissionEntity';
import { IPermissionRepository } from '../interfaces/IPermissionRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class PermissionRepository implements IPermissionRepository {
  constructor(
    @inject(TYPES.PermissionModel) private _permissionModel: Model<IPermissionDocument>
  ) {}

  async create(data: Partial<IPermissionDocument>): Promise<IPermissionDocument> {
    const permission = new this._permissionModel(data);
    return await permission.save();
  }

  async findById(id: string): Promise<IPermissionDocument | null> {
    return await this._permissionModel.findById(id);
  }

  async findByKey(key: string): Promise<IPermissionDocument | null> {
    return await this._permissionModel.findOne({ key });
  }

  async findByKeys(keys: string[]): Promise<IPermissionDocument[]> {
    return await this._permissionModel.find({ key: { $in: keys } });
  }

  async findAll(): Promise<IPermissionDocument[]> {
    return await this._permissionModel.find().sort({ module: 1, key: 1 });
  }

  async findByModule(module: string): Promise<IPermissionDocument[]> {
    return await this._permissionModel.find({ module });
  }

  async deleteAll(): Promise<void> {
    await this._permissionModel.deleteMany({});
  }

  async insertMany(data: Partial<IPermissionDocument>[]): Promise<IPermissionDocument[]> {
    return await this._permissionModel.insertMany(data) as IPermissionDocument[];
  }
}
