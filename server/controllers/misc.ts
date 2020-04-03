import {
  JsonController,
  Get,
  Authorized,
  CurrentUser
} from 'routing-controllers';

import { Maker } from '../schemas';
import { IMaker, IUser } from '../interfaces';

@JsonController()
export default class MiscController {
  @Authorized()
  @Get('/api/me')
  getMyProfile(@CurrentUser() user: IUser) {
    if (!user._id) {
      return user;
    }

    return Maker.findById(user._id)
      .then((result) => {
        user.maker = result as IMaker;
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/ping')
  ping() {
    return { 'message': 'Ping Successful.' }
  }
}
