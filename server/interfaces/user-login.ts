import { Document } from 'mongoose';

export default interface IUserLogin extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  remoteIp: string;
  createDate: Date;
}
