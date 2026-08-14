import { Schema, model } from 'mongoose';
import { ICostumeAssignmentDocument } from '../entities/costumeAssignmentEntity';

const costumeAssignmentSchema = new Schema<ICostumeAssignmentDocument>(
  {
    costume: { type: Schema.Types.ObjectId, ref: 'Costume', required: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    castMember: { type: Schema.Types.ObjectId, ref: 'User' },
    character: { type: Schema.Types.ObjectId, ref: 'Character', default: null },
    production: { type: Schema.Types.ObjectId, ref: 'Production' },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAt: { type: Date, default: Date.now },
    assignedDate: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null },
    returnDate: { type: Date, default: null },
    notes: { type: String, default: '' },
    status: { type: String, default: 'Active' },
    conditionBefore: { type: String, default: '' },
    conditionAfter: { type: String, default: '' },
  },
  { timestamps: true }
);

const CostumeAssignment = model<ICostumeAssignmentDocument>(
  'CostumeAssignment',
  costumeAssignmentSchema
);
export default CostumeAssignment;
