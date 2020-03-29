import { Document } from 'mongoose';

import IOauthProviders from './oauth-providers';

export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  providers: IOauthProviders;
  makerId: string;
  isSuperAdmin: boolean;
}
