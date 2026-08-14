import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IFundRequestController } from '../interfaces/IFundRequest.controller';
import { IFundRequestService } from '../../services/interfaces/IFundRequest.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/pagination';

@injectable()
export default class FundRequestController implements IFundRequestController {
  constructor(
    @inject(TYPES.IFundRequestService) private _fundService: IFundRequestService
  ) {}

  async createRequest(req: Request, res: Response): Promise<void> {
    const actorId = (req as any).user._id.toString();
    const fundRequest = await this._fundService.createRequest(req.body, actorId);
    res.status(HttpStatusCode.CREATED).json({
      message: MESSAGES.fundRequest.created,
      fundRequest,
    });
  }

  async getRequestById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const fundRequest = await this._fundService.getRequestById(id);
    res.status(HttpStatusCode.OK).json({ fundRequest });
  }

  async listRequests(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      status: req.query.status as string,
      production: req.query.production as string,
      category: req.query.category as string,
      search: req.query.search as string,
    };

    const result = await this._fundService.listRequests(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }

  async submitRequest(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();
    const fundRequest = await this._fundService.submitRequest(id, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.fundRequest.submitted,
      fundRequest,
    });
  }

  async approveRequest(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const approverId = (req as any).user._id.toString();
    const { comments } = req.body;

    const fundRequest = await this._fundService.approveRequest(id, approverId, comments);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.fundRequest.approved,
      fundRequest,
    });
  }

  async rejectRequest(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const approverId = (req as any).user._id.toString();
    const { comments } = req.body;

    const fundRequest = await this._fundService.rejectRequest(id, approverId, comments);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.fundRequest.rejected,
      fundRequest,
    });
  }

  async disburseRequest(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const fundRequest = await this._fundService.disburseRequest(id, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.fundRequest.disbursed,
      fundRequest,
    });
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this._fundService.deleteRequest(id);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.fundRequest.deleted,
    });
  }
}
