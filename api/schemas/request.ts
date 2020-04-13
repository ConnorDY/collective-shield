import { Schema, model } from 'mongoose';

import { IRequest } from '../interfaces';

export const RequestSchema = new Schema({
  maskShieldCount: Number,
  jobRole: String,
  otherJobRole: String,
  email: String,
  facilityName: String,
  firstName: String,
  lastName: String,
  addressLine1: String,
  addressLine2: String,
  addressCity: String,
  addressState: String,
  addressZip: String,
  phone: String,
  details: String,
  createDate: Date,
  makerID: String,
  status: String,
  updateDate: Date,
  requestorID: String
});

const Request = model<IRequest>('request', RequestSchema);
export default Request;
