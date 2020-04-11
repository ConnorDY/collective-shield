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
          subject: 'Welcome to the Collective Shield community of makers!',
          body: `<p>
            Dear ${user.firstName} ${user.lastName},
          </p>

          <p>
            We are so pleased you joined us to create these much-needed items for those on frontlines of the battle against coronavirus.
            This is a very engaged community and we welcome your participation.
          </p>
          
          <p>
            Please always remember to follow our guiding principles and treat those who request your products with the upmost care.
          </p>

          <p>
            Join our
            <a href="https://join.slack.com/t/3dprintedshields-tech/shared_invite/zt-cx21coci-T28PdkLkZDdRIAKih825Zw">
              slack workspace
            </a>
            to share design suggestions, get help with technical maker problems, and collaborate on new solutions
            (for issues connecting to slack, email
            <a href="mailto:amy@collectiveshield.org">Amy@CollectiveShield.org</a>
            ).
          </p>

          <p style="font-style: italic;">
            <span style="font-weight: bold">Note:</span>
            When you return to the Collective Shield website, you may need to log out and log back in to activate your account.
          </p>

          <p>
            We are all in this together.<br />
            <span style="font-weight: bold">The Collective Shield team</span>
          </p>`
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
