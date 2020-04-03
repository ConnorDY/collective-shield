import { Document } from 'mongoose';

import { IAddress } from '.';

export default interface Request extends Document {
  address: IAddress;
  details: string;
  count: number;
  createDate?: Date;
  coordinates: number[];
  name: string;
  email: string;
  status: string;
  position: string;
  makerId: string;
}
