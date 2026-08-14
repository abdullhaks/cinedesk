import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import { IAuthService } from '../interfaces/IAuth.service';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IOnboardingApplicationRepository } from '../../repositories/interfaces/IOnboardingApplicationRepository';
import TYPES from '../../config/inversify.types';
import { SafeUserDto } from '../../dto/user.dto';
import { toSafeUserDto } from '../../dtoMappers/user.mapper';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { UserStatus, ContractorType, OnboardingStatus } from '../../utils/enum';

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IOnboardingApplicationRepository)
    private _onboardingRepository: IOnboardingApplicationRepository
  ) {}

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<{ user: SafeUserDto; accessToken: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict(MESSAGES.auth.emailExists);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user — status is active for admin-created accounts (register is internal use only per plan.md)
    const user = await this._userRepository.create({
      fullName,
      email,
      passwordHash,
      status: UserStatus.ACTIVE,
    } as any);

    // Re-fetch with populated role
    const populatedUser = await this._userRepository.findById(user._id.toString());
    if (!populatedUser) {
      throw ApiError.internal('Failed to create user');
    }

    const accessToken = generateAccessToken({ userId: populatedUser._id.toString() });
    const refreshToken = generateRefreshToken({ userId: populatedUser._id.toString() });

    return {
      user: toSafeUserDto(populatedUser),
      accessToken,
      refreshToken,
    };
  }

  async registerContractor(
    fullName: string,
    email: string,
    password: string,
    contractorType: ContractorType
  ): Promise<{ user: SafeUserDto; accessToken: string; refreshToken: string; application: any }> {
    // Check if user already exists
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict(MESSAGES.auth.emailExists);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with PENDING_ONBOARDING status and contractorType
    const user = await this._userRepository.create({
      fullName,
      email,
      passwordHash,
      status: UserStatus.PENDING_ONBOARDING,
      contractorType,
    } as any);

    // Automatically create the initial draft onboarding application
    const app = await this._onboardingRepository.create({
      applicant: user._id as any,
      contractorType,
      status: OnboardingStatus.DRAFT,
      steps: {
        yourInformation: {
          name: fullName,
          photo: '',
          contact: email,
          department: '',
          position: '',
          experience: '',
        },
        financial: {
          paymentType: 'Direct Deposit',
          bankDetails: '',
          taxInfo: '',
        },
        documents: [],
        sign: {
          agreedAt: null,
          signatureText: '',
        },
      },
      resubmissionCount: 0,
    } as any);

    // Link application to user
    await this._userRepository.updateById(user._id.toString(), {
      onboardingApplication: app._id as any,
    } as any);

    const populatedUser = await this._userRepository.findById(user._id.toString());
    if (!populatedUser) {
      throw ApiError.internal('Failed to create contractor account');
    }

    const accessToken = generateAccessToken({ userId: populatedUser._id.toString() });
    const refreshToken = generateRefreshToken({ userId: populatedUser._id.toString() });

    return {
      user: toSafeUserDto(populatedUser),
      accessToken,
      refreshToken,
      application: app,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: SafeUserDto; accessToken: string; refreshToken: string }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized(MESSAGES.auth.invalidCredentials);
    }

    // Check if user is deactivated — per plan.md Section 11
    if (user.status === UserStatus.DEACTIVATED) {
      throw ApiError.forbidden(MESSAGES.auth.userDeactivated);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized(MESSAGES.auth.invalidCredentials);
    }

    // Update lastLoginAt
    await this._userRepository.updateById(user._id.toString(), {
      lastLoginAt: new Date(),
    } as any);

    const accessToken = generateAccessToken({ userId: user._id.toString() });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    return {
      user: toSafeUserDto(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw ApiError.unauthorized(MESSAGES.auth.refreshTokenMissing);
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw ApiError.unauthorized(MESSAGES.auth.refreshTokenInvalid);
    }

    const user = await this._userRepository.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized(MESSAGES.auth.refreshTokenInvalid);
    }

    if (user.status === UserStatus.DEACTIVATED) {
      throw ApiError.forbidden(MESSAGES.auth.userDeactivated);
    }

    const accessToken = generateAccessToken({ userId: user._id.toString() });
    return { accessToken };
  }

  async logout(_userId: string): Promise<void> {
    // Stateless JWT — logout is handled client-side by clearing cookies
    // In a production system, you might maintain a token blacklist
    return;
  }

  async getMe(userId: string): Promise<SafeUserDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound(MESSAGES.user.notFound);
    }
    return toSafeUserDto(user);
  }
}
