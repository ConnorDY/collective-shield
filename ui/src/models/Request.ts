import User from './User';

export default interface Request {
  _id: string;
  maskShieldCount: number;
  jobRole: string;
  otherJobRole?: string;
  email: string;
  facilityName?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  phone: string;
  details: string;
  status: string;
  createDate?: Date;
  updateDate?: Date;
  makerID?: string;
  requestorID: string;
  maker?: User;
  requestor?: User;
  homePickUp: boolean;
}
