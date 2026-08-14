import { Schema, model } from 'mongoose';
import { ICharacterDocument } from '../entities/characterEntity';

const characterSchema = new Schema<ICharacterDocument>(
  {
    production: { type: Schema.Types.ObjectId, ref: 'Production', required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    castMember: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const Character = model<ICharacterDocument>('Character', characterSchema);
export default Character;
