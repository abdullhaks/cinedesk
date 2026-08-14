import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { ICharacterDocument } from '../../entities/characterEntity';
import { ICharacterRepository } from '../interfaces/ICharacterRepository';
import TYPES from '../../config/inversify.types';

@injectable()
export default class CharacterRepository implements ICharacterRepository {
  constructor(
    @inject(TYPES.CharacterModel) private _model: Model<ICharacterDocument>
  ) {}

  async create(data: Partial<ICharacterDocument>): Promise<ICharacterDocument> {
    const doc = new this._model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<ICharacterDocument | null> {
    return await this._model
      .findById(id)
      .populate('castMember', 'fullName email contractorType profilePhoto');
  }

  async findByProduction(productionId: string): Promise<ICharacterDocument[]> {
    return await this._model
      .find({ production: productionId })
      .populate('castMember', 'fullName email contractorType profilePhoto');
  }

  async updateById(
    id: string,
    data: Partial<ICharacterDocument>
  ): Promise<ICharacterDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, data, { new: true })
      .populate('castMember', 'fullName email contractorType profilePhoto');
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this._model.findByIdAndDelete(id);
    return res !== null;
  }
}
