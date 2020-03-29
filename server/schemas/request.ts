import { Schema, model } from 'mongoose';

import address from './address';
import { IRequest } from '../interfaces';

export const RequestSchema = new Schema({
  address,
  details: String,
  count: Number,
  createDate: Date,
  coordinates: [Number],
  name: String,
  email: String,
  position: String,
  makerId: String
});

const Request = model<IRequest>('request', RequestSchema);
export default Request;
