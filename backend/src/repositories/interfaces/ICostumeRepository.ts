import { ICostumeDocument } from '../../entities/costumeEntity';
export interface ICostumeRepository {
  create(data: Partial<ICostumeDocument>): Promise<ICostumeDocument>;
  findById(id: string): Promise<ICostumeDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: ICostumeDocument[]; total: number }>;
  updateById(id: string, data: Partial<ICostumeDocument>): Promise<ICostumeDocument | null>;
  deleteById(id: string): Promise<boolean>;
}
