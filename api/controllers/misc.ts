import {
  JsonController,
  Get,
  Authorized,
  CurrentUser,
  Body,
  HttpError,
  Put,
  UseBefore
} from 'routing-controllers';
import { celebrate, Segments } from 'celebrate';

import config from '../config';
import { IUser, IMakerDetails } from '../interfaces';
import { User } from '../schemas';
import { makerDetailsValidator } from '../validators';

@JsonController()
export default class MiscController {
  @Authorized()
  @Get(`${config.apiPrefix}/me`)
  getMyProfile(@CurrentUser() user: IUser) {
    return user;
  }

  @Authorized()
  @UseBefore(celebrate({ [Segments.BODY]: makerDetailsValidator }))
  @Put(`${config.apiPrefix}/me`)
  submitMakerDetails(
    @CurrentUser() user: IUser,
    @Body() makerDetails: IMakerDetails
  ) {
    console.log(makerDetails);

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
