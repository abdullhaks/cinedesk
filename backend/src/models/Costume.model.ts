import { Schema, model } from 'mongoose';
import { ICostumeDocument } from '../entities/costumeEntity';
import { CostumeStatus } from '../utils/enum';

const costumeSchema = new Schema<ICostumeDocument>(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    size: { type: String, default: 'M' },
    character: { type: Schema.Types.ObjectId, ref: 'Character', default: null },
    production: { type: Schema.Types.ObjectId, ref: 'Production', required: true },
    status: {
      type: String,
      enum: Object.values(CostumeStatus),
      default: CostumeStatus.AVAILABLE,
    },
    images: [{ type: String }],
    notes: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Costume = model<ICostumeDocument>('Costume', costumeSchema);
export default Costume;
