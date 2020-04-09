export default interface MakerDetails {
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
}
