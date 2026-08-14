import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IProductionController } from '../interfaces/IProduction.controller';
import { IProductionService } from '../../services/interfaces/IProduction.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/pagination';

@injectable()
export default class ProductionController implements IProductionController {
  constructor(
    @inject(TYPES.IProductionService) private _prodService: IProductionService
  ) {}

  async createProduction(req: Request, res: Response): Promise<void> {
    const actorId = (req as any).user._id.toString();
    const production = await this._prodService.createProduction(req.body, actorId);
    res.status(HttpStatusCode.CREATED).json({
      message: MESSAGES.production.created,
      production,
    });
  }

  async getProductionById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const production = await this._prodService.getProductionById(id);
    res.status(HttpStatusCode.OK).json({ production });
  }

  async listProductions(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      status: req.query.status as string,
      search: req.query.search as string,
    };

    const result = await this._prodService.listProductions(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }

  async updateProduction(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const production = await this._prodService.updateProduction(id, req.body, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.production.updated,
      production,
    });
  }

  async deleteProduction(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this._prodService.deleteProduction(id);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.production.deleted,
    });
  }

  async assignCast(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { userId } = req.body;
    const production = await this._prodService.assignCast(id, userId);
    res.status(HttpStatusCode.OK).json({
      message: 'Cast assigned successfully',
      production,
    });
  }

  async removeCast(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { userId } = req.body;
    const production = await this._prodService.removeCast(id, userId);
    res.status(HttpStatusCode.OK).json({
      message: 'Cast removed successfully',
      production,
    });
  }

  async assignCrew(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { userId, department, position } = req.body;
    const production = await this._prodService.assignCrew(id, userId, department, position);
    res.status(HttpStatusCode.OK).json({
      message: 'Crew assigned successfully',
      production,
    });
  }

  async removeCrew(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { userId } = req.body;
    const production = await this._prodService.removeCrew(id, userId);
    res.status(HttpStatusCode.OK).json({
      message: 'Crew removed successfully',
      production,
    });
  }

  async createCharacter(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { name, description, castMember } = req.body;
    const character = await this._prodService.createCharacter(id, name, description, castMember);
    res.status(HttpStatusCode.CREATED).json({
      message: 'Character created successfully',
      character,
    });
  }

  async listCharacters(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const characters = await this._prodService.listCharacters(id);
    res.status(HttpStatusCode.OK).json({ items: characters });
  }
}
