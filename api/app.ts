require('dotenv').config();
import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import { useExpressServer, Action } from 'routing-controllers';
import cookieParser from 'cookie-parser';
import session, { SessionOptions } from 'express-session';
import { connect } from 'mongoose';
import path from 'path';
// import SparkPost from 'sparkpost';
import passport from 'passport';
import { createProxyMiddleware } from 'http-proxy-middleware';

import './passport';
import config from './config';
import { IUser } from './interfaces';
import {
  LoginController,
  MiscController,
  RequestsController
} from './controllers';

const portNumber = process.env.PORT || 3050;
const cookieSession: SessionOptions = {
  secret: config.cookieSecret!,
  cookie: {}
};
const parseForm = bodyParser.urlencoded({ extended: false });
// const sparkpostClient = new SparkPost(config.sparkpostKey);

connect(
  config.mongoUri!,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error(err.message);
      console.error(err);
    } else {
      console.log('Connected to MongoDb');
    }
  }
);

const app = express();

// apply middleware
if (process.env.NODE_ENV === 'development') {
  process.on('SIGTERM', () => process.kill(process.pid, 'SIGINT'));
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, csrf-token'
      );
      res.header('Access-Control-Allow-Methods', '*');
      next();
    }
  );
} else {
  // TODO: re-enable this when we're using HTTPS
  // cookieSession.cookie!.secure = true;
}

app.use(cookieParser());
app.use(session(cookieSession));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(parseForm);

// setup routing-controllers
useExpressServer(app, {
  controllers: [LoginController, MiscController, RequestsController],
  classTransformer: false,
  currentUserChecker: async (action: Action) => {
    return action.request.user;
  },
  authorizationChecker: async (action: Action, roles: string[]) => {
    // check if the user is logged in
    const user = action.request.user as IUser;
    if (!user) return false;

    // if no roles are provided, allow the logged-in
    // user to access the endpoint
    if (!roles || !roles.length) return true;

    // role checks
    if (roles.includes('admin') && user.isSuperAdmin) return true;
    if (roles.includes('verified') && user.isVerifiedMaker) return true;

    // return false if they don't have the required roles
    return false;
  }
});

app.get('/api/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie('connect.sid');
    res.send('You have successfully logged out');
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === 'development') {
  app.use(
    '*',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      ws: true
    })
  );
} else {
  app.use(express.static(path.join(__dirname, '../ui'), { index: false }));
  app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../ui/index.html'));
  });
}

// start listening
app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});
