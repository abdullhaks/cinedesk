import { Request, Response } from 'express';

export interface IOnboardingController {
  createDraft(req: Request, res: Response): Promise<void>;
  updateStep(req: Request, res: Response): Promise<void>;
  submit(req: Request, res: Response): Promise<void>;
  getMyApplication(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  review(req: Request, res: Response): Promise<void>;
  list(req: Request, res: Response): Promise<void>;
  uploadDocument(req: Request, res: Response): Promise<void>;
}
