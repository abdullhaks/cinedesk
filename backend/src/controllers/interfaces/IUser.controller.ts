import { Request, Response } from 'express';

export interface IUserController {
  listUsers(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
  assignRole(req: Request, res: Response): Promise<void>;
  deactivateUser(req: Request, res: Response): Promise<void>;
}
