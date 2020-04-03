export default interface User {
  makerId: string;
  firstName: string;
  lastName: string;
  maker?: boolean;
  isSuperAdmin?: boolean;
  roles: string[];
  email: string;
}
