import { Request, Response } from 'express';

export interface IRoleController {
  listRoles(req: Request, res: Response): Promise<void>;
  createRole(req: Request, res: Response): Promise<void>;
  updatePermissions(req: Request, res: Response): Promise<void>;
  listPermissions(req: Request, res: Response): Promise<void>;
}
