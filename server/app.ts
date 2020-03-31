require('dotenv').config();
import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import { createExpressServer } from 'routing-controllers';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import session, { SessionOptions } from 'express-session';
import { connect } from 'mongoose';
import path from 'path';
import SparkPost from 'sparkpost';
import passport from 'passport';
import { createProxyMiddleware } from 'http-proxy-middleware';

import './passport';
import config from './config';
import { Maker, Request } from './schemas';
import { IMaker } from './interfaces';
import { LoginController, RequestsController } from './controllers';
import { ensureAuthenticated, getUser } from './utils';

const portNumber = process.env.PORT || 3050;
const cookieSession: SessionOptions = {
  secret: config.cookieSecret!,
  cookie: {}
};
const csrfProtection = csurf({
  cookie: {
    key: 'XSRF-TOKEN',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600 // 1-hour
  }
});
const parseForm = bodyParser.urlencoded({ extended: false });
const sparkpostClient = new SparkPost(config.sparkpostKey);

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

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  process.on('SIGTERM', () => process.kill(process.pid, 'SIGINT'));
  middlewares.push(function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, csrf-token'
    );
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });
} else {
  cookieSession.cookie!.secure = true;
}

middlewares.push(
  cookieParser(),
  session(cookieSession),
  passport.initialize(),
  passport.session(),
  bodyParser.json(),
  parseForm,
  express.static(path.join(__dirname, 'build'), { index: false })
);

const app: express.Application = createExpressServer({
  controllers: [LoginController, RequestsController],
  middlewares
});
const server = require('http').Server(app);

server.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});

// app.all("*", csrfProtection, (req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken())
//   next()
// })

if (process.env.NODE_ENV != null && process.env.NODE_ENV !== 'development') {
  app.all(
    '/api/*',
    ensureAuthenticated,
    (req: express.Request, res: express.Response) => {}
  );

  // app.use(sslRedirect());
}

app.post('/public/request', (req: express.Request, res: express.Response) => {
  const data = req.body;
  if (data.count == null) {
    data.count = 4;
  }
  data.createDate = new Date();

  const request = new Request({
    address: {
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      state: data.state,
      zip: data.zip
    },
    details: data.details,
    count: data.count,
    createDate: new Date(),
    name: data.name,
    email: data.email
  });

  request
    .save()
    .then((result) => {
      sparkpostClient.transmissions
        .send({
          content: {
            template_id: 'request-confirmation'
          },
          recipients: [{ address: data.email }]
        })
        .then((data) => {
          return res.send(result);
        })
        .catch((err) => {
          console.log('Whoops! Something went wrong');
          console.error(err);
          return res.send(result);
        });
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
});

app.get('/api/me', (req: express.Request, res: express.Response) => {
  const user = getUser(req);

  if (!user || !user.makerId) {
    return res.send(user);
  }

  Maker.findById(user.makerId)
    .then((result) => {
      user.maker = result as IMaker;
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
});

app.get('/api/makers', (req: express.Request, res: express.Response) => {
  const user = getUser(req);

  if (!user || !user.isSuperAdmin) {
    return res.send([]);
  }

  Maker.find({}).exec((err, results) => {
    if (err) {
      console.error(err);
    }
    return res.send(results);
  });
});

app.get('/api/makers/:id', (req: express.Request, res: express.Response) => {
  Maker.findById(req.params.id)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
});

app.get(
  '/api/makers/:id/work',
  (req: express.Request, res: express.Response) => {
    Request.find({ makerId: req.params.id })
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
);

app.put('/api/makers/:id', (req: express.Request, res: express.Response) => {
  Maker.findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
    if (err) {
      console.error(err);
    }
    return res.send(result);
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
