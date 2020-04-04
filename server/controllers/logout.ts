import { JsonController, Get, Req, Res } from 'routing-controllers';
import passport from 'passport';

@JsonController('/logout')
export default class LogoutController {
  @Get("/")
  getLogout(@Req() req: any, @Res() res: any) {
    // TODO - tried a few different things here and can't get it to work
    req.logout(() => res.redirect('https://www.collectiveshield.org'));
  }
}
