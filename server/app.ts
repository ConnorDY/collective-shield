import bodyParser from 'body-parser';
import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import SparkPost from 'sparkpost';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import config from './config.js';
import makerSchema from './schemas/maker';
import requestSchema from './schemas/request';
import userSchema from './schemas/user';
import userLoginSchema from './schemas/userLogin';

const portNumber = process.env.PORT || 3050;
const app = express();
const cookieSession = {
  secret: config.cookieSecret,
  cookie: {} as { secure: boolean }
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

const server = require('http').Server(app);

mongoose.connect(
  config.mongoUri,
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
      clientID: config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL: `${config.domainName}/login/facebook/callback`,
      profileFields: ['id', 'email', 'first_name', 'last_name'],
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      if (profile == null) {
        return done(null, null);
      }

      const email = profile.emails[0].value;

      userSchema.User.findOne({
        $or: [{ email: email }, { providers: { facebook: profile.id } }]
      })
        .then((user) => {
          if (user == null) {
            user = new userSchema.User();
          }
          if (user.providers == null) {
            user.providers = {};
          }

          user.email = email;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
          user.providers.facebook = profile.id;

          user
            .save()
            .then((user) => {
              new userLoginSchema.UserLogin({
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
      clientID: config.google.id,
      clientSecret: config.google.secret,
      callbackURL: `${config.domainName}/login/google/callback`,
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      if (profile == null) {
        return done(null, null);
      }

      const email = profile.emails[0].value;

      userSchema.User.findOne({
        $or: [{ email: email }, { providers: { google: profile.id } }]
      })
        .then((user) => {
          if (user == null) {
            user = new userSchema.User();
          }
          if (user.providers == null) {
            user.providers = {};
          }

          user.email = email;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
          user.providers.google = profile.id;

          user
            .save()
            .then((user) => {
              new userLoginSchema.UserLogin({
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

if (process.env.NODE_ENV === 'development') {
  process.on('SIGTERM', () => process.kill(process.pid, 'SIGINT'));
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, csrf-token'
    );
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });
} else {
  cookieSession.cookie.secure = true;
}

//define REST proxy options based on logged in user
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next(null);
  }
  res.redirect(401, '/login');
}

function getIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
}

function getUser(req) {
  let user = req.user;

  if (process.env.NODE_ENV === 'development') {
    user = {
      _id: 'TEST',
      firstName: 'Test',
      lastName: 'Test',
      makerId: '5e781b3ee7179a17e21a89e1'
    };
  }

  return user;
}

app.use(cookieParser());
app.use(session(cookieSession));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(parseForm);
app.use(express.static(path.join(__dirname, 'build'), { index: false }));

server.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});

// app.all("*", csrfProtection, (req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken())
//   next()
// })

if (process.env.NODE_ENV != null && process.env.NODE_ENV !== 'development') {
  app.all('/api/*', ensureAuthenticated, (req, res) => {});

  // app.use(sslRedirect());
}

app.post('/public/request', (req, res) => {
  const data = req.body;
  if (data.count == null) {
    data.count = 4;
  }
  data.createDate = new Date();

  const request = new requestSchema.Request({
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

app.get('/api/me', (req, res) => {
  const user = getUser(req);

  if (!user || !user.makerId) {
    return res.send(user);
  }

  makerSchema.Maker.findById(user.makerId)
    .then((result) => {
      user.maker = result;
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      return res.error(err);
    });
});

app.get('/api/makers', (req, res) => {
  const user = getUser(req);

  if (!user || !user.isSuperAdmin) {
    return res.send([]);
  }

  makerSchema.Maker.find({}).exec((err, results) => {
    if (err) {
      console.error(err);
    }
    return res.send(results);
  });
});

app.get('/api/makers/:id', (req, res) => {
  makerSchema.Maker.findById(req.params.id)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
});

app.get('/api/makers/:id/work', (req, res) => {
  requestSchema.Request.find({ makerId: req.params.id })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.put('/api/makers/:id', (req, res) => {
  makerSchema.Maker.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, result) => {
      if (err) {
        console.error(err);
      }
      return res.send(result);
    }
  );
});

app.get('/api/requests', (req, res) => {
  requestSchema.Request.find({}).exec((err, results) => {
    if (err) {
      console.error(err);
    }
    return res.send(results);
  });
});

app.get('/api/requests/me', (req, res) => {
  const user = getUser(req);

  if (!user || !user.makerId) {
    return res.send([]);
  }

  requestSchema.Request.find({ userId: user._id })
    .then((results) => {
      results.forEach((r) => {
        r.createDate = new Date(r.createDate);
      });

      results.sort((a, b) => a.start - b.start);

      return res.send(results);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
});

app.get('/api/requests/open', (req, res) => {
  requestSchema.Request.find({ makerId: null })
    .then((results) => {
      results.forEach((r) => {
        r.createDate = new Date(r.createDate);
      });

      results.sort((a, b) => a.start - b.start);

      return res.send(results);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
});

app.post('/api/requests', (req, res) => {
  requestSchema.Request.create(req.body, (err, result) => {
    if (err) {
      console.error(err);
    }
    return res.send(result);
  });
});

app.get('api/requests/:id', (req, res) => {
  requestSchema.Request.findById(req.params.id).exec((err, result) => {
    if (err) {
      console.error(err);
    }
    return res.send(result);
  });
});

app.put('api/requests/:id', (req, res) => {
  requestSchema.Request.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, result) => {
      if (err) {
        console.error(err);
      }
      return res.send(result);
    }
  );
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
  (req, res) => {
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
  (req, res) => {
    console.log('google logged in');
    res.send('Logged In.');
  }
);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});
