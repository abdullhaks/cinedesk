import { IFundRequestDocument } from '../../entities/fundRequestEntity';
export interface IFundRequestRepository {
  create(data: Partial<IFundRequestDocument>): Promise<IFundRequestDocument>;
  findById(id: string): Promise<IFundRequestDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: IFundRequestDocument[]; total: number }>;
  updateById(id: string, data: Partial<IFundRequestDocument>): Promise<IFundRequestDocument | null>;
  deleteById(id: string): Promise<boolean>;
}
