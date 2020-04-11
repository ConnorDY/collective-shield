export default interface Request {
  _id: string;
  maskShieldCount: number;
  jobRole: string;
  otherJobRole?: string;
  email: string;
  facilityName?: string;
  addressLine1: string;
  addressLine2?: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  details: string;
  status: string;
  createDate?: Date;
  updateDate?: Date;
  makerID?: string;
  requestorID: string;
}
