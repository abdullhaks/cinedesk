import { IUserDocument } from '../../entities/userEntity';
import { SafeUserDto } from '../../dto/user.dto';

export interface IUserService {
  listUsers(
    filter: { role?: string; status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: SafeUserDto[]; total: number }>;
  getUserById(id: string): Promise<SafeUserDto>;
  assignRole(userId: string, roleId: string, actorId: string): Promise<SafeUserDto>;
  deactivateUser(userId: string, actorId: string): Promise<SafeUserDto>;
}
