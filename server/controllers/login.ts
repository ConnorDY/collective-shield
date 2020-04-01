import express from 'express';
import { JsonController, Get, Req, Res } from 'routing-controllers';
import passport from 'passport';

import config from '../config';

@JsonController(`${config.apiPrefix}/login`)
export default class LoginController {
  @Get('/facebook')
  facebook(@Req() req: express.Request, @Res() res: express.Response) {
    return passport.authenticate('facebook', { scope: 'email' })(req, res);
  }

  @Get('/facebook/callback')
  facebookCallback(@Req() req: express.Request, @Res() res: express.Response) {
    return passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res);
  }

  @Get('/google')
  google(@Req() req: express.Request, @Res() res: express.Response) {
    return passport.authenticate('google', { scope: ['profile', 'email'] })(
      req,
      res
    );
  }

  @Get('/google/callback')
  googleCallback(@Req() req: express.Request, @Res() res: express.Response) {
    return passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res);
  }
}
