import { Request, Response } from 'express';

export interface IFundRequestController {
  createRequest(req: Request, res: Response): Promise<void>;
  getRequestById(req: Request, res: Response): Promise<void>;
  listRequests(req: Request, res: Response): Promise<void>;
  submitRequest(req: Request, res: Response): Promise<void>;
  approveRequest(req: Request, res: Response): Promise<void>;
  rejectRequest(req: Request, res: Response): Promise<void>;
  disburseRequest(req: Request, res: Response): Promise<void>;
  deleteRequest(req: Request, res: Response): Promise<void>;
}
