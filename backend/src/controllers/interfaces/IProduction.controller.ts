import { Request, Response } from 'express';

export interface IProductionController {
  createProduction(req: Request, res: Response): Promise<void>;
  getProductionById(req: Request, res: Response): Promise<void>;
  listProductions(req: Request, res: Response): Promise<void>;
  updateProduction(req: Request, res: Response): Promise<void>;
  deleteProduction(req: Request, res: Response): Promise<void>;
  assignCast(req: Request, res: Response): Promise<void>;
  removeCast(req: Request, res: Response): Promise<void>;
  assignCrew(req: Request, res: Response): Promise<void>;
  removeCrew(req: Request, res: Response): Promise<void>;
  createCharacter(req: Request, res: Response): Promise<void>;
  listCharacters(req: Request, res: Response): Promise<void>;
}
