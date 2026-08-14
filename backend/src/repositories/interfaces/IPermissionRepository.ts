import { IPermissionDocument } from '../../entities/permissionEntity';

export interface IPermissionRepository {
  create(data: Partial<IPermissionDocument>): Promise<IPermissionDocument>;
  findById(id: string): Promise<IPermissionDocument | null>;
  findByKey(key: string): Promise<IPermissionDocument | null>;
  findByKeys(keys: string[]): Promise<IPermissionDocument[]>;
  findAll(): Promise<IPermissionDocument[]>;
  findByModule(module: string): Promise<IPermissionDocument[]>;
  deleteAll(): Promise<void>;
  insertMany(data: Partial<IPermissionDocument>[]): Promise<IPermissionDocument[]>;
}
