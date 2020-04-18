import { Document } from 'mongoose';

export default interface IProduct extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  packingUrl?: string;
  modelUrl?: string;
  isArchived?: boolean;
}

export interface IProductPatch extends Document {
  name?: string;
  description?: string;
  imageUrl?: string;
  packingUrl?: string;
  modelUrl?: string;
  isArchived?: boolean;
}
