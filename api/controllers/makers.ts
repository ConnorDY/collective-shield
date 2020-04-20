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

@Authorized(['admin'])
@JsonController(`${config.apiPrefix}/makers`)
export default class MakersController {
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

  @Put('/approve/:id')
  approveMaker(@Param('id') id: string) {
    return User.findByIdAndUpdate(id, { $set: { isVerifiedMaker: true } })
      .then((user) => {
        /*
          Disabling email functionality for now per
          https://trello.com/c/biYtz2br/84-remove-automatic-email-to-makers-upon-approval
          Simply remove the "return user" and uncomment the EMAIL CONFIRMATION FUNCTIONALITY
          commented code to restore this functionality.
        */
        // START EMAIL CONFIRMATION FUNCTIONALITY
        /* return sendEmail({
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
            <a href="mailto:amy@collectiveshield.org">Amy@CollectiveShield.org</a>).
          </p>

          <p style="font-style: italic;">
            <span style="font-weight: bold">Note:</span>
            When you return to the <a href="https://connect.collectiveshield.org">Collective Shield</a> website,
            you may need to log out and log back in to activate your account.
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
        */
        // END EMAIL CONFIRMATION FUNCTIONALITY
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }
}
