import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IUserController } from '../interfaces/IUser.controller';
import { IUserService } from '../../services/interfaces/IUser.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/pagination';

@injectable()
export default class UserController implements IUserController {
  constructor(
    @inject(TYPES.IUserService) private _userService: IUserService
  ) {}

  async listUsers(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      role: req.query.role as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };

    const result = await this._userService.listUsers(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const user = await this._userService.getUserById(id);
    res.status(HttpStatusCode.OK).json({ user });
  }

  async assignRole(req: Request, res: Response): Promise<void> {
    const userId = req.params.id as string;
    const { roleId } = req.body;
    const actorId = (req as any).user._id.toString();

    const user = await this._userService.assignRole(userId, roleId, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.user.roleAssigned,
      user,
    });
  }

  async deactivateUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const user = await this._userService.deactivateUser(userId, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.user.deactivated,
      user,
    });
  }
}
