import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILocationController } from '../interfaces/ILocation.controller';
import { ILocationService } from '../../services/interfaces/ILocation.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/pagination';
import { uploadBufferToCloudinary } from '../../utils/cloudinary';

@injectable()
export default class LocationController implements ILocationController {
  constructor(
    @inject(TYPES.ILocationService) private _locService: ILocationService
  ) {}

  async createLocation(req: Request, res: Response): Promise<void> {
    const actorId = (req as any).user._id.toString();
    const location = await this._locService.createLocation(req.body, actorId);
    res.status(HttpStatusCode.CREATED).json({
      message: MESSAGES.location.created,
      location,
    });
  }

  async getLocationById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const location = await this._locService.getLocationById(id);
    res.status(HttpStatusCode.OK).json({ location });
  }

  async listLocations(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      status: req.query.status as string,
      search: req.query.search as string,
    };

    const result = await this._locService.listLocations(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }

  async updateLocation(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const location = await this._locService.updateLocation(id, req.body, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.location.updated,
      location,
    });
  }

  async bookLocation(req: Request, res: Response): Promise<void> {
    const locationId = req.params.id as string;
    const { productionId, startDate, endDate } = req.body;
    const actorId = (req as any).user._id.toString();

    const location = await this._locService.bookLocation(
      locationId,
      productionId,
      startDate,
      endDate,
      actorId
    );

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.location.booked,
      location,
    });
  }

  async approveLocation(req: Request, res: Response): Promise<void> {
    const locationId = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const location = await this._locService.approveLocation(locationId, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.location.approved,
      location,
    });
  }

  async deleteLocation(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this._locService.deleteLocation(id);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.location.deleted,
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
      'cinedesk/locations',
      file.originalname,
      file.mimetype
    );

    res.status(HttpStatusCode.OK).json({
      message: 'Location file uploaded successfully',
      fileUrl: uploadResult.fileUrl,
      publicId: uploadResult.publicId,
      fileName: uploadResult.fileName,
      mimetype: uploadResult.mimetype,
    });
  }
}
