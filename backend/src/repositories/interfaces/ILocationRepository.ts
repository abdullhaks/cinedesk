import { ILocationDocument } from '../../entities/locationEntity';
export interface ILocationRepository {
  create(data: Partial<ILocationDocument>): Promise<ILocationDocument>;
  findById(id: string): Promise<ILocationDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: ILocationDocument[]; total: number }>;
  updateById(id: string, data: Partial<ILocationDocument>): Promise<ILocationDocument | null>;
  deleteById(id: string): Promise<boolean>;
  hasConflict(locationId: string, startDate: Date, endDate: Date): Promise<boolean>;
}
