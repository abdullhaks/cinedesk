import { Document, Types } from 'mongoose';
import { ProductionStatus } from '../utils/enum';

export interface IProductionDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: ProductionStatus;
  startDate: Date;
  endDate: Date;
  productionManager: Types.ObjectId;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  assignedCast: Types.ObjectId[];
  assignedCrew: Array<{
    user: Types.ObjectId;
    department: string;
    position: string;
  }>;
  locations: Types.ObjectId[];
  notes: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
