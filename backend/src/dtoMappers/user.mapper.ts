import { IUserDocument } from '../entities/userEntity';
import { IPermissionDocument } from '../entities/permissionEntity';
import { IRoleDocument } from '../entities/roleEntity';
import { SafeUserDto } from '../dto/user.dto';

export const toSafeUserDto = (user: IUserDocument): SafeUserDto => {
  const role = user.role as IRoleDocument | null;

  let roleDto: SafeUserDto['role'] = null;
  if (role && typeof role === 'object' && '_id' in role) {
    const permissions = (role.permissions || []) as (IPermissionDocument | any)[];
    roleDto = {
      id: role._id.toString(),
      name: role.name,
      permissions: permissions.map((p: any) =>
        typeof p === 'object' && p.key ? p.key : p.toString()
      ),
    };
  }

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: roleDto,
    contractorType: user.contractorType,
    status: user.status,
    profilePhoto: user.profilePhoto || '',
    phone: user.phone || '',
    department: user.department || '',
    position: user.position || '',
  };
};
