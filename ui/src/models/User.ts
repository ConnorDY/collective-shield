import MakerDetails from './MakerDetails';

export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  maker?: boolean;
  isSuperAdmin?: boolean;
  isVerifiedMaker?: boolean;
  makerDetails?: MakerDetails;
}
