import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../utils/messages';
import { IPermissionDocument } from '../entities/permissionEntity';
import { IRoleDocument } from '../entities/roleEntity';

/**
 * Permission-based authorization middleware.
 * Checks that the authenticated user's role has the required permission key.
 * Uses the live-populated permissions from authenticate middleware.
 * Per plan.md Section 5.4: requirePermission(permissionKey: string): RequestHandler
 */
export function requirePermission(permissionKey: string): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || !user.role) {
      next(ApiError.forbidden(MESSAGES.permission.denied));
      return;
    }

    const role = user.role as IRoleDocument;
    const permissions = (role.permissions || []) as IPermissionDocument[];

    // Check for wildcard (*) permission (Super Admin)
    const hasPermission = permissions.some(
      (p: any) => {
        const key = typeof p === 'object' && p.key ? p.key : p.toString();
        return key === '*' || key === permissionKey;
      }
    );

    if (!hasPermission) {
      next(ApiError.forbidden(MESSAGES.permission.denied));
      return;
    }

    next();
  };
}
