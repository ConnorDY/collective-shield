import {
  JsonController,
  Get,
  Authorized,
  CurrentUser
} from 'routing-controllers';

import { IUser } from '../interfaces';

@JsonController()
export default class MiscController {
  @Authorized()
  @Get('/api/me')
  getMyProfile(@CurrentUser() user: IUser) {
    return user;
  }

  @Get('/ping')
  ping() {
    return { message: 'Ping Successful.' };
  }
}
