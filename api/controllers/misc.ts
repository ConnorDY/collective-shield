import {
  JsonController,
  Get,
  Authorized,
  CurrentUser,
  Body,
  HttpError,
  Put
} from 'routing-controllers';

import { IUser, IMakerDetails } from '../interfaces';
import { User } from '../schemas';

@JsonController()
export default class MiscController {
  @Authorized()
  @Get('/api/me')
  getMyProfile(@CurrentUser() user: IUser) {
    return user;
  }

  @Authorized()
  @Put('/api/me')
  submitMakerDetails(
    @CurrentUser() user: IUser,
    @Body() makerDetails: IMakerDetails
  ) {
    if (user.makerDetails) {
      throw new HttpError(405, 'Maker information already submitted.');
    }

    return User.findOneAndUpdate({ _id: user._id }, { $set: { makerDetails } })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/ping')
  ping() {
    return { message: 'Ping Successful.' };
  }
}
