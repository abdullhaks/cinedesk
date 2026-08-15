import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../utils/messages';
import { IPermissionDocument } from '../entities/permissionEntity';
import { IRoleDocument } from '../entities/roleEntity';


export function requireOwnershipOrElevated(
  getResourceOwnerId: (req: Request) => Promise<string | null>,
  elevatedPermission: string
): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        next(ApiError.forbidden(MESSAGES.permission.denied));
        return;
      }

      const userId = user._id.toString();
      const ownerId = await getResourceOwnerId(req);

      // Check ownership
      if (ownerId && ownerId === userId) {
        next();
        return;
      }

      // Check elevated permission
      if (user.role) {
        const role = user.role as IRoleDocument;
        const permissions = (role.permissions || []) as IPermissionDocument[];
        const hasElevated = permissions.some(
          (p: any) => {
            const key = typeof p === 'object' && p.key ? p.key : p.toString();
            return key === '*' || key === elevatedPermission;
          }
        );
        if (hasElevated) {
          next();
          return;
        }
      }

      next(ApiError.forbidden(MESSAGES.permission.denied));
    } catch (error) {
      next(error);
    }
  };
}
