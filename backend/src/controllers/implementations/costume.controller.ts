import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ICostumeController } from '../interfaces/ICostume.controller';
import { ICostumeService } from '../../services/interfaces/ICostume.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/pagination';
import { uploadBufferToCloudinary } from '../../utils/cloudinary';

@injectable()
export default class CostumeController implements ICostumeController {
  constructor(
    @inject(TYPES.ICostumeService) private _costumeService: ICostumeService
  ) {}

  async createCostume(req: Request, res: Response): Promise<void> {
    const actorId = (req as any).user._id.toString();
    const costume = await this._costumeService.createCostume(req.body, actorId);
    res.status(HttpStatusCode.CREATED).json({
      message: 'Costume created successfully',
      costume,
    });
  }

  async getCostumeById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const costume = await this._costumeService.getCostumeById(id);
    res.status(HttpStatusCode.OK).json({ costume });
  }

  async listCostumes(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      status: req.query.status as string,
      production: req.query.production as string,
      category: req.query.category as string,
      search: req.query.search as string,
    };

    const result = await this._costumeService.listCostumes(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }

  async updateCostume(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const costume = await this._costumeService.updateCostume(id, req.body, actorId);
    res.status(HttpStatusCode.OK).json({
      message: 'Costume updated successfully',
      costume,
    });
  }

  async deleteCostume(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this._costumeService.deleteCostume(id);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.costume.deleted,
    });
  }

  async uploadMedia(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (!file) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'No file uploaded' });
      return;
    }

    const uploadResult = await uploadBufferToCloudinary(
      file.buffer,
      'cinedesk/costumes',
      file.originalname,
      file.mimetype
    );

    res.status(HttpStatusCode.OK).json({
      message: 'Costume file uploaded successfully',
      fileUrl: uploadResult.fileUrl,
      publicId: uploadResult.publicId,
      fileName: uploadResult.fileName,
      mimetype: uploadResult.mimetype,
    });
  }

  async assignCostume(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { actorUserId, characterId, notes } = req.body;
    const assignedByUserId = (req as any).user._id.toString();

    const result = await this._costumeService.assignCostume(
      id,
      actorUserId,
      characterId,
      notes,
      assignedByUserId
    );

    res.status(HttpStatusCode.OK).json({
      message: 'Costume assigned successfully',
      ...result,
    });
  }

  async returnCostume(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string; // assignmentId or costumeId
    const { notes } = req.body;
    const returnedByUserId = (req as any).user._id.toString();

    const result = await this._costumeService.returnCostume(
      id,
      notes,
      returnedByUserId
    );

    res.status(HttpStatusCode.OK).json({
      message: 'Costume returned successfully',
      ...result,
    });
  }
}
