import {
  JsonController,
  Authorized,
  Put,
  Param,
  Get
} from 'routing-controllers';

import config from '../config';
import { User } from '../schemas';
import { sendEmail } from '../mailer';

@JsonController(`${config.apiPrefix}/makers`)
export default class MakersController {
  @Authorized(['admin'])
  @Get('')
  getAll() {
    return User.find({
      $or: [{ isVerifiedMaker: true }, { makerDetails: { $ne: undefined } }]
    })
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Authorized(['admin'])
  @Get('/unapproved')
  getUnapproved() {
    return User.find({
      $or: [{ isVerifiedMaker: false }, { isVerifiedMaker: undefined }],
      makerDetails: { $not: undefined }
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
        return sendEmail({
          to: result.email,
          subject: "You've been approved",
          body: 'Placeholder body'
        })
          .then(() => {
            return result;
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }
}
