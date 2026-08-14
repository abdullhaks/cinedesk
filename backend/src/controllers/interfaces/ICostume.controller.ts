import { Request, Response } from 'express';

export interface ICostumeController {
  createCostume(req: Request, res: Response): Promise<void>;
  getCostumeById(req: Request, res: Response): Promise<void>;
  listCostumes(req: Request, res: Response): Promise<void>;
  updateCostume(req: Request, res: Response): Promise<void>;
  deleteCostume(req: Request, res: Response): Promise<void>;
  assignCostume(req: Request, res: Response): Promise<void>;
  returnCostume(req: Request, res: Response): Promise<void>;
  uploadMedia(req: Request, res: Response): Promise<void>;
}
