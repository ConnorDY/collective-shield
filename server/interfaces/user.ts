import { Document } from 'mongoose';

import { IMaker, IOauthProviders, IUserLogin } from '.';

export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  providers: IOauthProviders;
  makerId: string;
  maker?: IMaker;
  isSuperAdmin: boolean;
  login?: IUserLogin;
}
