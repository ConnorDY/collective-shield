import express from 'express';

import { IUser } from './interfaces';

export function getIp(req: express.Request) {
  console.log(req.headers['x-forwarded-for']);
  return (
    ((req.headers['x-forwarded-for'] as string) || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress
  );
}

export function authorizationChecker(
  user: IUser | null | undefined,
  roles?: string[]
): boolean {
  // check if the user is logged in
  if (!user) return false;

  // if no roles are provided, allow the logged-in
  // user to access the endpoint
  if (!roles || !roles.length) return true;

  // role checks
  if (roles.includes('admin') && user.isSuperAdmin) return true;
  if (roles.includes('verified') && user.isVerifiedMaker) return true;

  // return false if they don't have any of the required roles
  return false;
}
