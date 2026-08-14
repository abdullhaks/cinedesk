import { IProductionDocument } from '../../entities/productionEntity';
import { ICharacterDocument } from '../../entities/characterEntity';

export interface IProductionService {
  createProduction(data: any, actorId: string): Promise<IProductionDocument>;
  getProductionById(id: string): Promise<IProductionDocument>;
  listProductions(
    filter: { status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IProductionDocument[]; total: number }>;
  updateProduction(id: string, data: any, actorId: string): Promise<IProductionDocument>;
  deleteProduction(id: string): Promise<boolean>;
  assignCast(productionId: string, castUserId: string): Promise<IProductionDocument>;
  removeCast(productionId: string, castUserId: string): Promise<IProductionDocument>;
  assignCrew(
    productionId: string,
    crewUserId: string,
    department: string,
    position: string
  ): Promise<IProductionDocument>;
  removeCrew(productionId: string, crewUserId: string): Promise<IProductionDocument>;
  createCharacter(
    productionId: string,
    name: string,
    description?: string,
    castMemberId?: string
  ): Promise<ICharacterDocument>;
  listCharacters(productionId: string): Promise<ICharacterDocument[]>;
}
