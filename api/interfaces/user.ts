import { Document } from 'mongoose';

import { IMaker, IOauthProviders, IUserLogin } from '.';

export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  providers: IOauthProviders;
  maker?: IMaker;
  isSuperAdmin: boolean;
  isVerifiedMaker: boolean;
  login?: IUserLogin;
  roles: string[];
}
