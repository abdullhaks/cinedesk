import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IDashboardController } from '../interfaces/IDashboard.controller';
import { IDashboardService } from '../../services/interfaces/IDashboard.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';

@injectable()
export default class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.IDashboardService) private _dashboardService: IDashboardService
  ) {}

  async getStats(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user._id ? (req as any).user._id.toString() : (req as any).user.id;
    const stats = await this._dashboardService.getStats(userId);
    res.status(HttpStatusCode.OK).json({ stats });
  }
}
