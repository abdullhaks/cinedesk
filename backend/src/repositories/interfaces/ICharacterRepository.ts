import { ICharacterDocument } from '../../entities/characterEntity';
export interface ICharacterRepository {
  create(data: Partial<ICharacterDocument>): Promise<ICharacterDocument>;
  findById(id: string): Promise<ICharacterDocument | null>;
  findByProduction(productionId: string): Promise<ICharacterDocument[]>;
  updateById(id: string, data: Partial<ICharacterDocument>): Promise<ICharacterDocument | null>;
  deleteById(id: string): Promise<boolean>;
}
