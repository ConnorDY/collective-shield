import { JsonController, Get, UseBefore } from 'routing-controllers';
import passport from 'passport';

@JsonController('/login')
export default class LoginController {
  @Get('/facebook')
  @UseBefore(passport.authenticate('facebook', { scope: 'email' }))
  facebook() {}

  @Get('/facebook/callback')
  @UseBefore(
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )
  facebookCallback() {}

  @Get('/google')
  @UseBefore(passport.authenticate('google', { scope: ['profile', 'email'] }))
  google() {}

  @Get('/google/callback')
  @UseBefore(
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )
  googleCallback() {}
}
