import { IRoleDocument } from '../../entities/roleEntity';
import { IPermissionDocument } from '../../entities/permissionEntity';

export interface IRoleService {
  listRoles(): Promise<IRoleDocument[]>;
  getRoleById(id: string): Promise<IRoleDocument>;
  createRole(name: string, permissionKeys: string[]): Promise<IRoleDocument>;
  updatePermissions(roleId: string, permissionKeys: string[], actorId: string): Promise<IRoleDocument>;
  listPermissions(): Promise<IPermissionDocument[]>;
}
