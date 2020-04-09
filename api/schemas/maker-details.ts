import { Schema } from 'mongoose';

export const MakerDetailsSchema = new Schema({
  firstName: String,
  lastName: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  zip: String,
  phone: String
});
