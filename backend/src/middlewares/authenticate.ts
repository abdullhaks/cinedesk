import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../utils/messages';
import User from '../models/User.model';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized(MESSAGES.auth.unauthorized);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw ApiError.unauthorized(MESSAGES.auth.unauthorized);
    }

    //DB lookup for permissions...
    const user = await User.findById(decoded.userId).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });

    if (!user) {
      throw ApiError.unauthorized(MESSAGES.auth.unauthorized);
    }

    // Attach the full user with populated role+permissions to request
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
