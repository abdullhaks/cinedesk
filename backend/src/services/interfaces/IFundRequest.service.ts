import { IFundRequestDocument } from '../../entities/fundRequestEntity';

export interface IFundRequestService {
  createRequest(data: any, requesterId: string): Promise<IFundRequestDocument>;
  getRequestById(id: string): Promise<IFundRequestDocument>;
  listRequests(
    filter: { status?: string; production?: string; category?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IFundRequestDocument[]; total: number }>;
  submitRequest(id: string, actorId: string): Promise<IFundRequestDocument>;
  approveRequest(id: string, approverId: string, comments?: string): Promise<IFundRequestDocument>;
  rejectRequest(id: string, approverId: string, comments?: string): Promise<IFundRequestDocument>;
  disburseRequest(id: string, actorId: string): Promise<IFundRequestDocument>;
  deleteRequest(id: string): Promise<boolean>;
}
