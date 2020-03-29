import { Document } from 'mongoose';

import IAddress from './address';

export default interface IMaker extends Document {
  address: IAddress;
  printers: string[];
  prints: number;
  joinDate: Date;
  lastLoggedInDate: Date;
  name: string;
  email: string;
  localPickup: boolean;
  multiship: boolean;
}
