import {
  JsonController,
  Authorized,
  Put,
  Param,
  Get
} from 'routing-controllers';

import config from '../config';
import { User } from '../schemas';

@JsonController(`${config.apiPrefix}/makers`)
export default class MakersController {
  @Authorized(['admin'])
  @Get('/unapproved')
  getUnapproved() {
    return User.find({
      $or: [{ isVerifiedMaker: false }, { isVerifiedMaker: undefined }],
      makerDetails: undefined
    })
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Authorized(['admin'])
  @Put('/approve/:id')
  approveMaker(@Param('id') id: string) {
    return User.findOneAndUpdate(
      { _id: id },
      { $set: { isVerifiedMaker: true } }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }
}
