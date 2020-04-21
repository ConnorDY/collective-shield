import { Document } from 'mongoose';

export default interface IProduct extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  packingUrl?: string;
  modelUrl?: string;
  isArchived?: boolean;
  createDate?: Date;
  updateDate?: Date;
}

export interface IProductPatch extends Document {
  name?: string;
  description?: string;
  imageUrl?: string;
  packingUrl?: string;
  modelUrl?: string;
  isArchived?: boolean;
  createDate?: Date;
  updateDate?: Date;
}
