import { ICostumeDocument } from '../../entities/costumeEntity';
import { ICostumeAssignmentDocument } from '../../entities/costumeAssignmentEntity';

export interface ICostumeService {
  createCostume(data: any, actorId: string): Promise<ICostumeDocument>;
  getCostumeById(id: string): Promise<ICostumeDocument>;
  listCostumes(
    filter: { status?: string; production?: string; category?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: ICostumeDocument[]; total: number }>;
  updateCostume(id: string, data: any, actorId: string): Promise<ICostumeDocument>;
  deleteCostume(id: string): Promise<boolean>;
  assignCostume(
    costumeId: string,
    actorUserId: string,
    characterId?: string,
    notes?: string,
    assignedByUserId?: string
  ): Promise<{ costume: ICostumeDocument; assignment: ICostumeAssignmentDocument }>;
  returnCostume(
    assignmentId: string,
    notes?: string,
    returnedByUserId?: string
  ): Promise<{ costume: ICostumeDocument; assignment: ICostumeAssignmentDocument }>;
}
