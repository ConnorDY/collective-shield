import { Document } from 'mongoose';

import IAddress from './address';

export default interface Request extends Document {
  address: IAddress;
  details: string;
  count: number;
  createDate: Date;
  coordinates: number[];
  name: string;
  email: string;
  position: string;
  makerId: string;
}
