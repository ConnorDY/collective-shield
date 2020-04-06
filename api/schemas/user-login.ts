import { Schema, model } from 'mongoose';

import { IUserLogin } from '../interfaces';

export const UserLoginSchema = new Schema({
  userId: String,
  accessToken: String,
  refreshToken: String,
  remoteIp: String,
  createDate: Date
});

const UserLogin = model<IUserLogin>('userlogin', UserLoginSchema);
export default UserLogin;
