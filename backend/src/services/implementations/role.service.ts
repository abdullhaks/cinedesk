import { injectable, inject } from 'inversify';
import { IRoleService } from '../interfaces/IRole.service';
import { IRoleRepository } from '../../repositories/interfaces/IRoleRepository';
import { IPermissionRepository } from '../../repositories/interfaces/IPermissionRepository';
import { IRoleDocument } from '../../entities/roleEntity';
import { IPermissionDocument } from '../../entities/permissionEntity';
import TYPES from '../../config/inversify.types';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';

@injectable()
export default class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.IRoleRepository) private _roleRepository: IRoleRepository,
    @inject(TYPES.IPermissionRepository) private _permissionRepository: IPermissionRepository
  ) {}

  async listRoles(): Promise<IRoleDocument[]> {
    return await this._roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<IRoleDocument> {
    const role = await this._roleRepository.findById(id);
    if (!role) {
      throw ApiError.notFound(MESSAGES.role.notFound);
    }
    return role;
  }

  async createRole(name: string, permissionKeys: string[]): Promise<IRoleDocument> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const existing = await this._roleRepository.findBySlug(slug);
    if (existing) {
      throw ApiError.conflict('A role with this name already exists');
    }

    const permissions = await this._permissionRepository.findByKeys(permissionKeys);
    const permissionIds = permissions.map((p) => p._id);

    return await this._roleRepository.create({
      name,
      slug,
      permissions: permissionIds,
      isSystemRole: false,
    } as any);
  }

  async updatePermissions(
    roleId: string,
    permissionKeys: string[],
    _actorId: string
  ): Promise<IRoleDocument> {
    const role = await this._roleRepository.findById(roleId);
    if (!role) {
      throw ApiError.notFound(MESSAGES.role.notFound);
    }

    let permissionIds: any[] = [];
    if (permissionKeys.includes('*')) {
      const allPerms = await this._permissionRepository.findAll();
      permissionIds = allPerms.map((p) => p._id);
    } else {
      const permissions = await this._permissionRepository.findByKeys(permissionKeys);
      permissionIds = permissions.map((p) => p._id);
    }

    const updated = await this._roleRepository.updateById(roleId, {
      permissions: permissionIds,
    } as any);

    if (!updated) {
      throw ApiError.internal('Failed to update role permissions');
    }

    return updated;
  }

  async listPermissions(): Promise<IPermissionDocument[]> {
    return await this._permissionRepository.findAll();
  }
}
