import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IRoleController } from '../interfaces/IRole.controller';
import { IRoleService } from '../../services/interfaces/IRole.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';

@injectable()
export default class RoleController implements IRoleController {
  constructor(
    @inject(TYPES.IRoleService) private _roleService: IRoleService
  ) {}

  async listRoles(_req: Request, res: Response): Promise<void> {
    const roles = await this._roleService.listRoles();
    res.status(HttpStatusCode.OK).json({ items: roles });
  }

  async createRole(req: Request, res: Response): Promise<void> {
    const { name, permissions } = req.body;
    const role = await this._roleService.createRole(name, permissions || []);
    res.status(HttpStatusCode.CREATED).json({
      message: MESSAGES.role.created,
      role,
    });
  }

  async updatePermissions(req: Request, res: Response): Promise<void> {
    const roleId = req.params.id as string;
    const { permissions } = req.body;
    const actorId = (req as any).user._id.toString();

    const role = await this._roleService.updatePermissions(roleId, permissions || [], actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.role.permissionsUpdated,
      role,
    });
  }

  async listPermissions(_req: Request, res: Response): Promise<void> {
    const permissions = await this._roleService.listPermissions();
    res.status(HttpStatusCode.OK).json({ items: permissions });
  }
}
