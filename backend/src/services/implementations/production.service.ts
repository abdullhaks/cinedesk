import { injectable, inject } from 'inversify';
import { IProductionService } from '../interfaces/IProduction.service';
import { IProductionRepository } from '../../repositories/interfaces/IProductionRepository';
import { ICharacterRepository } from '../../repositories/interfaces/ICharacterRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IProductionDocument } from '../../entities/productionEntity';
import { ICharacterDocument } from '../../entities/characterEntity';
import TYPES from '../../config/inversify.types';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../utils/messages';
import { ProductionStatus } from '../../utils/enum';

@injectable()
export default class ProductionService implements IProductionService {
  constructor(
    @inject(TYPES.IProductionRepository) private _productionRepo: IProductionRepository,
    @inject(TYPES.ICharacterRepository) private _characterRepo: ICharacterRepository,
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository
  ) {}

  async createProduction(data: any, actorId: string): Promise<IProductionDocument> {
    const managerId = data.productionManager || actorId;
    const manager = await this._userRepo.findById(managerId);
    if (!manager) {
      throw ApiError.notFound('Production Manager user not found');
    }

    const prod = await this._productionRepo.create({
      title: data.title,
      description: data.description || '',
      status: data.status || ProductionStatus.DEVELOPMENT,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      productionManager: managerId as any,
      budget: {
        total: data.budgetTotal || 0,
        spent: 0,
        currency: data.currency || 'USD',
      },
      assignedCast: [],
      assignedCrew: [],
      locations: [],
      notes: data.notes || '',
      createdBy: actorId as any,
    } as any);

    return (await this._productionRepo.findById(prod._id.toString()))!;
  }

  async getProductionById(id: string): Promise<IProductionDocument> {
    const prod = await this._productionRepo.findById(id);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }
    return prod;
  }

  async listProductions(
    filter: { status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: IProductionDocument[]; total: number }> {
    const queryFilter: any = {};
    if (filter.status) queryFilter.status = filter.status;
    if (filter.search) {
      queryFilter.title = { $regex: filter.search, $options: 'i' };
    }

    return await this._productionRepo.findMany(queryFilter, page, limit);
  }

  async updateProduction(id: string, data: any, actorId: string): Promise<IProductionDocument> {
    const prod = await this._productionRepo.findById(id);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    if (actorId) {
      const user = await this._userRepo.findById(actorId);
      if (user && user.role) {
        const role = user.role as any;
        const permissions = role.permissions || [];
        const isElevated = permissions.some(
          (p: any) => {
            const key = typeof p === 'object' && p.key ? p.key : p.toString();
            return key === '*' || key === 'productions.delete' || key === 'roles.manage';
          }
        );
        const prodManagerId =
          (prod.productionManager as any)?._id?.toString() ||
          prod.productionManager?.toString();
        const createdById =
          (prod.createdBy as any)?._id?.toString() ||
          prod.createdBy?.toString();

        if (!isElevated && prodManagerId !== actorId && createdById !== actorId) {
          throw ApiError.forbidden('You can only modify productions you manage.');
        }
      }
    }

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.budgetTotal !== undefined) {
      updateData.budget = {
        ...prod.budget,
        total: data.budgetTotal,
      };
    }

    const updated = await this._productionRepo.updateById(id, updateData);
    return updated!;
  }

  async deleteProduction(id: string): Promise<boolean> {
    const prod = await this._productionRepo.findById(id);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }
    return await this._productionRepo.deleteById(id);
  }

  async assignCast(productionId: string, castUserId: string): Promise<IProductionDocument> {
    const prod = await this._productionRepo.findById(productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    const castUser = await this._userRepo.findById(castUserId);
    if (!castUser) {
      throw ApiError.notFound('Cast user not found');
    }

    const currentCast = (prod.assignedCast || []).map((c: any) => c._id?.toString() || c.toString());
    if (!currentCast.includes(castUserId)) {
      currentCast.push(castUserId);
    }

    const updated = await this._productionRepo.updateById(productionId, {
      assignedCast: currentCast as any,
    } as any);

    return updated!;
  }

  async removeCast(productionId: string, castUserId: string): Promise<IProductionDocument> {
    const prod = await this._productionRepo.findById(productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    const currentCast = (prod.assignedCast || [])
      .map((c: any) => c._id?.toString() || c.toString())
      .filter((id: string) => id !== castUserId);

    const updated = await this._productionRepo.updateById(productionId, {
      assignedCast: currentCast as any,
    } as any);

    return updated!;
  }

  async assignCrew(
    productionId: string,
    crewUserId: string,
    department: string,
    position: string
  ): Promise<IProductionDocument> {
    const prod = await this._productionRepo.findById(productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    const crewUser = await this._userRepo.findById(crewUserId);
    if (!crewUser) {
      throw ApiError.notFound('Crew user not found');
    }

    const currentCrew = prod.assignedCrew || [];
    const existingIdx = currentCrew.findIndex(
      (item: any) => (item.user?._id?.toString() || item.user?.toString()) === crewUserId
    );

    if (existingIdx >= 0) {
      currentCrew[existingIdx] = { user: crewUserId as any, department, position };
    } else {
      currentCrew.push({ user: crewUserId as any, department, position });
    }

    const updated = await this._productionRepo.updateById(productionId, {
      assignedCrew: currentCrew,
    } as any);

    return updated!;
  }

  async removeCrew(productionId: string, crewUserId: string): Promise<IProductionDocument> {
    const prod = await this._productionRepo.findById(productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    const currentCrew = (prod.assignedCrew || []).filter(
      (item: any) => (item.user?._id?.toString() || item.user?.toString()) !== crewUserId
    );

    const updated = await this._productionRepo.updateById(productionId, {
      assignedCrew: currentCrew,
    } as any);

    return updated!;
  }

  async createCharacter(
    productionId: string,
    name: string,
    description?: string,
    castMemberId?: string
  ): Promise<ICharacterDocument> {
    const prod = await this._productionRepo.findById(productionId);
    if (!prod) {
      throw ApiError.notFound(MESSAGES.production.notFound);
    }

    return await this._characterRepo.create({
      production: productionId as any,
      name,
      description: description || '',
      castMember: castMemberId ? (castMemberId as any) : null,
    } as any);
  }

  async listCharacters(productionId: string): Promise<ICharacterDocument[]> {
    return await this._characterRepo.findByProduction(productionId);
  }
}
