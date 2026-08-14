import { Request, Response } from 'express';

export interface ILocationController {
  createLocation(req: Request, res: Response): Promise<void>;
  getLocationById(req: Request, res: Response): Promise<void>;
  listLocations(req: Request, res: Response): Promise<void>;
  updateLocation(req: Request, res: Response): Promise<void>;
  bookLocation(req: Request, res: Response): Promise<void>;
  approveLocation(req: Request, res: Response): Promise<void>;
  deleteLocation(req: Request, res: Response): Promise<void>;
  uploadMedia(req: Request, res: Response): Promise<void>;
}
