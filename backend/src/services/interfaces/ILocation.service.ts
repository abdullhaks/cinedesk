import { ILocationDocument } from '../../entities/locationEntity';

export interface ILocationService {
  createLocation(data: any, actorId: string): Promise<ILocationDocument>;
  getLocationById(id: string): Promise<ILocationDocument>;
  listLocations(
    filter: { status?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ items: ILocationDocument[]; total: number }>;
  updateLocation(id: string, data: any, actorId: string): Promise<ILocationDocument>;
  bookLocation(
    locationId: string,
    productionId: string,
    startDate: string,
    endDate: string,
    actorId: string
  ): Promise<ILocationDocument>;
  approveLocation(locationId: string, actorId: string): Promise<ILocationDocument>;
  deleteLocation(id: string): Promise<boolean>;
}
