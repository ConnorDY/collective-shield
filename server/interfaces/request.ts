import { Document } from 'mongoose';

export default interface Request extends Document {
  maskShieldCount: number;
  jobRole: string;
  email: string;
  facilityName: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  details?: string;
  status?: string;
  createDate?: Date;
  updateDate?: Date;
  makerID?: string;
  requestorID: string;
}
