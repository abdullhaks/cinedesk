import { IProductionDocument } from '../../entities/productionEntity';

export interface IProductionRepository {
  create(data: Partial<IProductionDocument>): Promise<IProductionDocument>;
  findById(id: string): Promise<IProductionDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: IProductionDocument[]; total: number }>;
  updateById(id: string, data: Partial<IProductionDocument>): Promise<IProductionDocument | null>;
  deleteById(id: string): Promise<boolean>;
  findByManager(managerId: string, page: number, limit: number): Promise<{ items: IProductionDocument[]; total: number }>;
}
