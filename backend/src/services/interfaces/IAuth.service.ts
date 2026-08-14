import { SafeUserDto } from '../../dto/user.dto';
import { ContractorType } from '../../utils/enum';

export interface IAuthService {
  register(fullName: string, email: string, password: string): Promise<{ user: SafeUserDto; accessToken: string; refreshToken: string }>;
  registerContractor(
    fullName: string,
    email: string,
    password: string,
    contractorType: ContractorType
  ): Promise<{ user: SafeUserDto; accessToken: string; refreshToken: string; application: any }>;
  login(email: string, password: string): Promise<{ user: SafeUserDto; accessToken: string; refreshToken: string }>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
  logout(userId: string): Promise<void>;
  getMe(userId: string): Promise<SafeUserDto>;
}
