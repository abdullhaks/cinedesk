import { injectable, inject } from 'inversify';
import { IDashboardService, IDashboardStats } from '../interfaces/IDashboard.service';
import TYPES from '../../config/inversify.types';
import { Model } from 'mongoose';
import { IProductionDocument } from '../../entities/productionEntity';
import { IFundRequestDocument } from '../../entities/fundRequestEntity';
import { ILocationDocument } from '../../entities/locationEntity';
import { ICostumeDocument } from '../../entities/costumeEntity';
import { ICharacterDocument } from '../../entities/characterEntity';
import { IOnboardingApplicationDocument } from '../../entities/onboardingApplicationEntity';
import { IRoleDocument } from '../../entities/roleEntity';
import { FundRequestStatus, CostumeStatus, LocationStatus, OnboardingStatus } from '../../utils/enum';

@injectable()
export default class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.ProductionModel) private _productionModel: Model<IProductionDocument>,
    @inject(TYPES.FundRequestModel) private _fundRequestModel: Model<IFundRequestDocument>,
    @inject(TYPES.LocationModel) private _locationModel: Model<ILocationDocument>,
    @inject(TYPES.CostumeModel) private _costumeModel: Model<ICostumeDocument>,
    @inject(TYPES.CharacterModel) private _characterModel: Model<ICharacterDocument>,
    @inject(TYPES.OnboardingApplicationModel) private _onboardingModel: Model<IOnboardingApplicationDocument>,
    @inject(TYPES.RoleModel) private _roleModel: Model<IRoleDocument>
  ) {}

  async getStats(userId: string): Promise<IDashboardStats> {
    const [
      activeProductionsCount,
      totalFundReqDocs,
      bookedLocationsCount,
      costumeInventoryCount,
      assignedCostumesCount,
      assignedCharactersCount,
      pendingOnboardingsCount,
      pendingFundRequestsCount,
      activeRolesCount,
    ] = await Promise.all([
      this._productionModel.countDocuments({ status: { $ne: 'Archived' } } as any),
      this._fundRequestModel.find({}),
      this._locationModel.countDocuments({ status: LocationStatus.BOOKED } as any),
      this._costumeModel.countDocuments({}),
      this._costumeModel.countDocuments({ status: CostumeStatus.ASSIGNED } as any),
      this._characterModel.countDocuments({ assignedCastUser: userId } as any),
      this._onboardingModel.countDocuments({ status: OnboardingStatus.PENDING_REVIEW } as any),
      this._fundRequestModel.countDocuments({ status: { $in: [FundRequestStatus.SUBMITTED, FundRequestStatus.UNDER_REVIEW] } } as any),
      this._roleModel.countDocuments({}),
    ]);

    let totalFundRequestedAmount = 0;
    let totalFundApprovedAmount = 0;
    const monthTotals: { [key: string]: number } = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    totalFundReqDocs.forEach((fr) => {
      const amt = Number(fr.amount) || 0;
      totalFundRequestedAmount += amt;
      if (fr.status === FundRequestStatus.APPROVED || fr.status === FundRequestStatus.PAID) {
        totalFundApprovedAmount += amt;
      }
      if ((fr as any).createdAt) {
        const monthIndex = new Date((fr as any).createdAt).getMonth();
        const monthName = monthNames[monthIndex];
        if (monthName && monthTotals[monthName] !== undefined) {
          monthTotals[monthName] += amt;
        }
      }
    });

    const approvedPercentage = totalFundRequestedAmount > 0
      ? Math.round((totalFundApprovedAmount / totalFundRequestedAmount) * 1000) / 10
      : 0;

    // Monthly expenditure trend bars
    const displayMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const maxVal = Math.max(...displayMonths.map(m => monthTotals[m]), 1);

    const monthlyExpenses = displayMonths.map((month) => {
      const valAmount = monthTotals[month];
      const percent = Math.min(100, Math.max(10, Math.round((valAmount / maxVal) * 100)));
      return {
        month,
        val: percent,
        label: `$${(valAmount / 1000).toFixed(1)}k`,
        primary: month === 'Mar',
      };
    });

    return {
      activeProductionsCount,
      totalFundRequestedAmount,
      totalFundApprovedAmount,
      approvedPercentage,
      bookedLocationsCount,
      costumeInventoryCount,
      assignedCostumesCount,
      assignedCharactersCount,
      pendingOnboardingsCount,
      pendingFundRequestsCount,
      activeRolesCount,
      monthlyExpenses,
    };
  }
}
