import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IAuthController } from '../interfaces/IAuth.controller';
import { IAuthService } from '../../services/interfaces/IAuth.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';

@injectable()
export default class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.IAuthService) private _authService: IAuthService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const { fullName, email, password } = req.body;
    const result = await this._authService.register(fullName, email, password);

    // Set refresh token as httpOnly cookie
    res.cookie('cinedesk_refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(HttpStatusCode.CREATED).json({
      message: MESSAGES.auth.registrationSuccess,
      user: result.user,
      accessToken: result.accessToken,
    });
  }

  async registerContractor(req: Request, res: Response): Promise<void> {
    const { fullName, email, password, contractorType } = req.body;
    const result = await this._authService.registerContractor(
      fullName,
      email,
      password,
      contractorType || 'Freelancer'
    );

    // Set refresh token as httpOnly cookie
    res.cookie('cinedesk_refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(HttpStatusCode.CREATED).json({
      message: 'Contractor registered successfully. Please proceed with onboarding.',
      user: result.user,
      accessToken: result.accessToken,
      application: result.application,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this._authService.login(email, password);

    // Set refresh token as httpOnly cookie
    res.cookie('cinedesk_refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.auth.loginSuccess,
      user: result.user,
      accessToken: result.accessToken,
    });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.cinedesk_refreshToken;
    const result = await this._authService.refresh(refreshToken);

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.auth.tokenRefreshed,
      accessToken: result.accessToken,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?._id?.toString() || '';
    await this._authService.logout(userId);

    res.clearCookie('cinedesk_refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.auth.logoutSuccess,
    });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user._id.toString();
    const user = await this._authService.getMe(userId);

    res.status(HttpStatusCode.OK).json({ user });
  }
}
