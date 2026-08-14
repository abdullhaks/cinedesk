import { IUserDocument } from '../../entities/userEntity';

export interface IUserRepository {
  create(data: Partial<IUserDocument>): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: IUserDocument[]; total: number }>;
  updateById(id: string, data: Partial<IUserDocument>): Promise<IUserDocument | null>;
  deleteById(id: string): Promise<boolean>;
}
