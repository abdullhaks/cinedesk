import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IOnboardingController } from '../interfaces/IOnboarding.controller';
import { IOnboardingService } from '../../services/interfaces/IOnboarding.service';
import TYPES from '../../config/inversify.types';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/pagination';
import { uploadBufferToCloudinary } from '../../utils/cloudinary';

@injectable()
export default class OnboardingController implements IOnboardingController {
  constructor(
    @inject(TYPES.IOnboardingService) private _onboardingService: IOnboardingService
  ) {}

  async createDraft(req: Request, res: Response): Promise<void> {
    const actorId = (req as any).user._id.toString();
    const { contractorType } = req.body;

    const application = await this._onboardingService.createDraft(actorId, contractorType);
    res.status(HttpStatusCode.CREATED).json({
      message: 'Onboarding application initialized',
      application,
    });
  }

  async updateStep(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const stepName = req.params.stepName as string;
    const actorId = (req as any).user._id.toString();

    const application = await this._onboardingService.updateStep(
      id,
      stepName,
      req.body,
      actorId
    );
    res.status(HttpStatusCode.OK).json({
      message: `Step ${stepName} updated successfully`,
      application,
    });
  }

  async submit(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const application = await this._onboardingService.submit(id, actorId);
    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.onboarding.submitted,
      application,
    });
  }

  async getMyApplication(req: Request, res: Response): Promise<void> {
    const actorId = (req as any).user._id.toString();
    const application = await this._onboardingService.getByApplicant(actorId);

    res.status(HttpStatusCode.OK).json({ application });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const actorId = (req as any).user._id.toString();

    const user = (req as any).user;
    const permissions = user?.role?.permissions || [];
    const hasReviewPermission = permissions.some(
      (p: any) => (typeof p === 'object' && p.key ? p.key : p.toString()) === '*' ||
                  (typeof p === 'object' && p.key ? p.key : p.toString()) === 'onboarding.review'
    );

    const application = await this._onboardingService.getById(id, actorId, hasReviewPermission);
    res.status(HttpStatusCode.OK).json({ application });
  }

  async review(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const reviewerId = (req as any).user._id.toString();
    const { action, comments, rejectionReason } = req.body;

    const application = await this._onboardingService.reviewApplication(
      id,
      action,
      reviewerId,
      comments,
      rejectionReason
    );

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.onboarding.reviewed,
      application,
    });
  }

  async list(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePagination(req.query);
    const filter = {
      contractorType: req.query.contractorType as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };

    const result = await this._onboardingService.list(filter, page, limit);
    res.status(HttpStatusCode.OK).json(result);
  }

  async uploadDocument(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (!file) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'No file uploaded' });
      return;
    }

    const uploadResult = await uploadBufferToCloudinary(
      file.buffer,
      'cinedesk/onboarding',
      file.originalname,
      file.mimetype
    );

    res.status(HttpStatusCode.OK).json({
      message: 'Document uploaded successfully',
      fileUrl: uploadResult.fileUrl,
      publicId: uploadResult.publicId,
      fileName: uploadResult.fileName,
      mimetype: uploadResult.mimetype,
    });
  }
}
