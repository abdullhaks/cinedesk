import { Schema, model } from 'mongoose';
import { IProductionDocument } from '../entities/productionEntity';
import { ProductionStatus } from '../utils/enum';

const productionSchema = new Schema<IProductionDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(ProductionStatus),
      default: ProductionStatus.DEVELOPMENT,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    productionManager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    budget: {
      total: { type: Number, default: 0 },
      spent: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    assignedCast: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    assignedCrew: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        department: { type: String },
        position: { type: String },
      },
    ],
    locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    notes: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Production = model<IProductionDocument>('Production', productionSchema);
export default Production;
