import { Schema, model } from 'mongoose';

import { IRequest } from '../interfaces';

export const RequestSchema = new Schema({
  maskShieldCount: Number,
  jobRole: String,
  email: String,
  facilityName: String,
  addressLine1: String,
  addressLine2: String,
  addressCity: String,
  addressState: String,
  addressZip: String,
  details: String,
  createDate: Date,
  makerID: String,
  status: String,
  updateDate: Date,
  requestorID: String
});

const Request = model<IRequest>('request', RequestSchema);
export default Request;
