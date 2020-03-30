import express from 'express';
import { IUser } from './interfaces';

export function getUser(req: express.Request) {
  let user = req.user;

  if (process.env.NODE_ENV === 'development') {
    user = {
      _id: 'TEST',
      firstName: 'Test',
      lastName: 'Test',
      makerId: '5e781b3ee7179a17e21a89e1'
    };
  }

  return user as IUser;
}
