import { Schema, model } from 'mongoose';

import { IUser } from '../interfaces';
import { UserLoginSchema } from './user-login';
import { MakerDetailsSchema } from './maker-details';

const oauthProviders = {
  facebook: String,
  google: String
};

export const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  providers: oauthProviders,
  isSuperAdmin: Boolean,
  isVerifiedMaker: Boolean,
  login: UserLoginSchema,
  makerDetails: MakerDetailsSchema
});

const User = model<IUser>('user', UserSchema);
export default User;
