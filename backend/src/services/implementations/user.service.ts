import { injectable, inject } from 'inversify';
import { IUserService } from '../interfaces/IUser.service';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IRoleRepository } from '../../repositories/interfaces/IRoleRepository';
import TYPES from '../../config/inversify.types';
import { SafeUserDto } from '../../dto/user.dto';
import { toSafeUserDto } from '../../dtoMappers/user.mapper';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { UserStatus } from '../../utils/enum';

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IRoleRepository) private _roleRepo: IRoleRepository
  ) {}

  async listUsers(
    filter: { role?: string; status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: SafeUserDto[]; total: number }> {
    const queryFilter: any = {};
    if (filter.status) queryFilter.status = filter.status;
    if (filter.role) queryFilter.role = filter.role;
    if (filter.search) {
      queryFilter.$or = [
        { fullName: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
      ];
    }

    const { items, total } = await this._userRepo.findMany(queryFilter, page, limit);
    return {
      items: items.map(toSafeUserDto),
      total,
    };
  }

  async getUserById(id: string): Promise<SafeUserDto> {
    const user = await this._userRepo.findById(id);
    if (!user) {
      throw ApiError.notFound(MESSAGES.user.notFound);
    }
    return toSafeUserDto(user);
  }

  async assignRole(userId: string, roleId: string, _actorId: string): Promise<SafeUserDto> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw ApiError.notFound(MESSAGES.user.notFound);
    }

    const role = await this._roleRepo.findById(roleId);
    if (!role) {
      throw ApiError.notFound(MESSAGES.role.notFound);
    }

    const updated = await this._userRepo.updateById(userId, {
      role: role._id as any,
    } as any);

    return toSafeUserDto(updated!);
  }

  async deactivateUser(userId: string, _actorId: string): Promise<SafeUserDto> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw ApiError.notFound(MESSAGES.user.notFound);
    }

    const updated = await this._userRepo.updateById(userId, {
      status: UserStatus.DEACTIVATED,
    } as any);

    return toSafeUserDto(updated!);
  }
}
