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
import { Maker } from './schemas';
import { IMaker, IUser } from './interfaces';
import {
  MakersController,
  RequestsController,
  LoginController
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
  cookieSession.cookie!.secure = true;
}

app.use(cookieParser());
app.use(session(cookieSession));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(parseForm);
app.use(express.static(path.join(__dirname, 'build'), { index: false }));

// setup routing-controllers
useExpressServer(app, {
  controllers: [LoginController, MakersController, RequestsController],
  classTransformer: false,
  currentUserChecker: async (action: Action) => {
    return action.request.user;
  },
  authorizationChecker: async (action: Action, roles: string[]) => {
    if (!action.request.user) return false;
    if (roles.includes('admin')) return action.request.user.isSuperAdmin;
    return true;
  }
});

// start listening
app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});

app.get('/api/me', (req: express.Request, res: express.Response) => {
  const user = req.user as IUser;
  if (!user || !user._id) {
    return res.send(user);
  }

  Maker.findById(user._id)
    .then((result) => {
      user.maker = result as IMaker;
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      throw err;
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
  app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
  });
}
