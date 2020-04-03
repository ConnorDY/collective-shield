import express from 'express';

import { IUser } from './interfaces';

export function getUser(req: express.Request) {
  let user = req.user;

  if (process.env.NODE_ENV === 'development') {
    user = {
      _id: 'TEST',
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@email.com',
      makerId: '5e781b3ee7179a17e21a89e1'
    };
  }

  return user as IUser;
}

export function ensureAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next(null);
  }
  res.redirect(401, '/login');
}

export function getIp(req: express.Request) {
  console.log(req.headers['x-forwarded-for']);
  return (
    ((req.headers['x-forwarded-for'] as string) || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress
  );
}
