import { Schema, model } from 'mongoose';

import { IProduct } from '../interfaces';

export const ProductSchema = new Schema({
  name: String,
  description: String,
  imageUrl: String,
  packingUrl: String,
  modelUrl: String,
  isArchived: Boolean
});

const Product = model<IProduct>('product', ProductSchema);
export default Product;
