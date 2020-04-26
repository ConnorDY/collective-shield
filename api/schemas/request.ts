import { Schema, model } from 'mongoose';

import { IRequest } from '../interfaces';
import FKHelper from './helpers/foreign-key-helper';

export const RequestSchema = new Schema(
  {
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
    requestorID: String,
    homePickUp: Boolean,
    makerNotes: String,
    productID: {
  		type: String,
  		ref: 'product',
  		validate: {
  			isAsync: true,
  			validator: function(v) {
  				return FKHelper(model('product'), v);
  			},
  			message: `Product doesn't exist`
  		}
  	}
  },
  { toJSON: { virtuals: true } }
);

RequestSchema.virtual('maker', {
  ref: 'user',
  localField: 'makerID',
  foreignField: '_id',
  justOne: true
});

RequestSchema.virtual('requestor', {
  ref: 'user',
  localField: 'requestorID',
  foreignField: '_id',
  justOne: true
});

RequestSchema.virtual('product', {
  ref: 'product',
  localField: 'productID',
  foreignField: '_id',
  justOne: true
});

const Request = model<IRequest>('request', RequestSchema);
export default Request;
