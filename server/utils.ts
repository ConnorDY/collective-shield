import express from 'express';

export function getIp(req: express.Request) {
  console.log(req.headers['x-forwarded-for']);
  return (
    ((req.headers['x-forwarded-for'] as string) || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress
  );
}
