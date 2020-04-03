export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  maker?: boolean;
  isSuperAdmin?: boolean;
  roles: string[];
  email: string;
}
