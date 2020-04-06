import { Schema, model } from 'mongoose';

import address from './address';
import { IMaker } from '../interfaces';

export const MakerSchema = new Schema({
  address,
  printers: [String],
  prints: Number,
  joinDate: Date,
  lastLoggedInDate: Date,
  name: String,
  email: String,
  localPickup: Boolean,
  multiship: Boolean
});

const Maker = model<IMaker>('maker', MakerSchema);
export default Maker;
