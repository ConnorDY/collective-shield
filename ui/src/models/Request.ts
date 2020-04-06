export default interface Request {
  _id: string;
  maskShieldCount: number;
  jobRole: string;
  email: string;
  facilityName: string;
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
