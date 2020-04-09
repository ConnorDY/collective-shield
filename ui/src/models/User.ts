export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  maker?: boolean;
  isSuperAdmin?: boolean;
  isVerifiedMaker?: boolean;
  makerDetails?: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    homePickUp: boolean;
    willShip: boolean;
    willDeliver: boolean;
  };
}
