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
  @Get('/approved')
  getApproved() {
    return User.find({
      isVerifiedMaker: true
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
      makerDetails: { $ne: undefined }
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
    return User.findByIdAndUpdate(id, { $set: { isVerifiedMaker: true } })
      .then((user) => {
        return sendEmail({
          to: user.email,
          subject: "You've been approved",
          body: 'Placeholder body'
        })
          .then(() => {
            return user;
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
