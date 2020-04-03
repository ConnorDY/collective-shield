import { Document } from 'mongoose';

export default interface Request extends Document {
  maskShieldCount: number;
  jobRole: string;
  email: string;
  facilityName: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  details: string;
  createDate?: Date;
  makerID?: string;
  status: string;
  updateDate?: Date;
  requestorID: string;
}
