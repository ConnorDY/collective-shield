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
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import config from './config';
import { Maker, Request, User, UserLogin } from './schemas';
import { IMaker } from './interfaces';
import { RequestsController } from './controllers';
import { ensureAuthenticated, getIp, getUser } from './utils';

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

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.id!,
      clientSecret: config.facebook.secret!,
      callbackURL: `${config.domainName}/login/facebook/callback`,
      profileFields: ['id', 'email', 'first_name', 'last_name'],
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      if (!profile) {
        return done(null, null);
      }

      const email = profile.emails![0].value;

      User.findOne({
        $or: [{ email: email }, { providers: { facebook: profile.id } }]
      })
        .then((user) => {
          if (!user) {
            user = new User();
          }

          if (!user.providers) {
            user.providers = {};
          }

          user.email = email;
          user.firstName = profile.name!.givenName;
          user.lastName = profile.name!.familyName;
          user.providers.facebook = profile.id;

          user
            .save()
            .then((user) => {
              new UserLogin({
                userId: user._id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                createDate: new Date(),
                remoteIp: getIp(req)
              })
                .save()
                .then((login) => {
                  user.login = login;
                  return done(null, user);
                })
                .catch((err) => {
                  console.error(err);
                  return done(err, null);
                });
            })
            .catch((err) => {
              console.error(err);
              return done(err, null);
            });
        })
        .catch((err) => {
          console.error(err);
          return done(err, null);
        });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.id!,
      clientSecret: config.google.secret!,
      callbackURL: `${config.domainName}/login/google/callback`,
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      if (profile == null) {
        return done(null, null);
      }

      const email = profile.emails![0].value;

      User.findOne({
        $or: [{ email: email }, { providers: { google: profile.id } }]
      })
        .then((user) => {
          if (user == null) {
            user = new User();
          }
          if (user.providers == null) {
            user.providers = {};
          }

          user.email = email;
          user.firstName = profile.name!.givenName;
          user.lastName = profile.name!.familyName;
          user.providers.google = profile.id;

          user
            .save()
            .then((user) => {
              new UserLogin({
                userId: user._id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                createDate: new Date(),
                remoteIp: getIp(req)
              })
                .save()
                .then((login) => {
                  user.login = login;
                  return done(null, user);
                })
                .catch((err) => {
                  console.error(err);
                  return done(err, null);
                });
            })
            .catch((err) => {
              console.error(err);
              return done(err, null);
            });
        })
        .catch((err) => {
          console.error(err);
          return done(err, null);
        });
    }
  )
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

//define REST proxy options based on logged in user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

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
  controllers: [RequestsController],
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

app.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

app.get(
  '/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  (req: express.Request, res: express.Response) => {
    console.log('facebook logged in');
    res.send('Logged In.');
  }
);

app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/login/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  (req: express.Request, res: express.Response) => {
    console.log('google logged in');
    res.send('Logged In.');
  }
);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});
