import express from 'express';

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
