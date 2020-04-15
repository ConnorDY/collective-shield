import { Document } from 'mongoose';

export default interface Request extends Document {
  maskShieldCount: number;
  jobRole: string;
  email: string;
  facilityName: string;
  firstName: string;
  lastName: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  phone: string;
  details?: string;
  status?: string;
  createDate?: Date;
  updateDate?: Date;
  makerID?: string;
  requestorID: string;
  homePickUp: boolean;
}
