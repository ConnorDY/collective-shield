import { Document } from 'mongoose';

import { IOauthProviders, IUserLogin } from '.';

export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  providers: IOauthProviders;
  isSuperAdmin?: boolean;
  isVerifiedMaker?: boolean;
  login?: IUserLogin;
}
