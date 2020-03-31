import { JsonController, Get } from 'routing-controllers';
import passport from 'passport';

import config from '../config';

@JsonController(`${config.apiPrefix}/login`)
export default class LoginController {
  @Get('/facebook')
  facebook = passport.authenticate('facebook', { scope: 'email' });

  @Get('/facebook/callback')
  facebookCallback = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  });

  @Get('/google')
  google = passport.authenticate('google', { scope: ['profile', 'email'] });

  @Get('/google/callback')
  googleCallback = passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  });
}
