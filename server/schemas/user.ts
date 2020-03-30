import { Schema, model } from 'mongoose';

import { IUser } from '../interfaces';
import { MakerSchema } from './maker';
import { UserLoginSchema } from './user-login';

const oauthProviders = {
  facebook: String,
  google: String
};

export const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  providers: oauthProviders,
  makerId: String,
  maker: MakerSchema,
  isSuperAdmin: Boolean,
  login: UserLoginSchema
});

const User = model<IUser>('user', UserSchema);
export default User;
