import { IRoleDocument } from '../../entities/roleEntity';

export interface IRoleRepository {
  create(data: Partial<IRoleDocument>): Promise<IRoleDocument>;
  findById(id: string): Promise<IRoleDocument | null>;
  findBySlug(slug: string): Promise<IRoleDocument | null>;
  findAll(): Promise<IRoleDocument[]>;
  updateById(id: string, data: Partial<IRoleDocument>): Promise<IRoleDocument | null>;
  deleteById(id: string): Promise<boolean>;
}
