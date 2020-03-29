import { Schema, model } from 'mongoose';

import { IUser } from '../interfaces';

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
  isSuperAdmin: Boolean
});

const User = model<IUser>('user', UserSchema);
export default User;
