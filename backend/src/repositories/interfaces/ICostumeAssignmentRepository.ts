import { ICostumeAssignmentDocument } from '../../entities/costumeAssignmentEntity';
export interface ICostumeAssignmentRepository {
  create(data: Partial<ICostumeAssignmentDocument>): Promise<ICostumeAssignmentDocument>;
  findById(id: string): Promise<ICostumeAssignmentDocument | null>;
  findMany(filter: any, page: number, limit: number): Promise<{ items: ICostumeAssignmentDocument[]; total: number }>;
  updateById(id: string, data: Partial<ICostumeAssignmentDocument>): Promise<ICostumeAssignmentDocument | null>;
}
