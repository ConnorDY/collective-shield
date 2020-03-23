const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./server/config.js");
const makerSchema = require("./server/schemas/maker");
const requestSchema = require("./server/schemas/request");
const userSchema = require("./server/schemas/user");
const userLoginSchema = require("./server/schemas/userLogin");
const moment = require('moment');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const portNumber = process.env.PORT || 3050;
const app = express();
const cookieSession = {
  secret: config.cookieSecret,
  cookie: {}
}

const server = require("http").Server(app);

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.error(err.message);
    console.error(err);
  }
  else {
    console.log("Connected to MongoDb");
  }
});

passport.use(new FacebookStrategy({
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

    const email = profile.emails[0].value

    userSchema.User
      .findOne({ $or: [{ email: email }, { providers: { facebook: profile.id } }] })
      .then((user) => {
        if (user == null) {
          user = new userSchema.User()
        }
        if (user.providers == null) {
          user.providers = {}
        }

        user.email = email
        user.firstName = profile.name.givenName
        user.lastName = profile.name.familyName
        user.providers.facebook = profile.id

        user.save()
          .then((user) => {
            new userLoginSchema.UserLogin({
              userId: user._id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              createDate: new Date(),
              remoteIp: getIp(req)
            }).save()
              .then((login) => {
                user.login = login
                return done(null, user)
              })
              .catch((err) => {
                console.error(err)
                return done(err, null)
              })
          })
          .catch((err) => {
            console.error(err)
            return done(err, null)
          })
      })
      .catch((err) => {
        console.error(err)
        return done(err, null)
      })
  }
));

passport.use(new GoogleStrategy({
  clientID: config.google.id,
  clientSecret: config.google.secret,
  callbackURL: `${config.domainName}/login/google/callback`,
  passReqToCallback: true
},
  (req, accessToken, refreshToken, profile, done) => {
    if (profile == null) {
      return done(null, null);
    }

    const email = profile.emails[0].value

    userSchema.User
      .findOne({ $or: [{ email: email }, { providers: { google: profile.id } }] })
      .then((user) => {
        if (user == null) {
          user = new userSchema.User()
        }
        if (user.providers == null) {
          user.providers = {}
        }

        user.email = email
        user.firstName = profile.name.givenName
        user.lastName = profile.name.familyName
        user.providers.google = profile.id

        user.save()
          .then((user) => {
            new userLoginSchema.UserLogin({
              userId: user._id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              createDate: new Date(),
              remoteIp: getIp(req)
            }).save()
              .then((login) => {
                user.login = login
                return done(null, user)
              })
              .catch((err) => {
                console.error(err)
                return done(err, null)
              })
          })
          .catch((err) => {
            console.error(err)
            return done(err, null)
          })
      })
      .catch((err) => {
        console.error(err)
        return done(err, null)
      })
  }
));

if (process.env.NODE_ENV === "development") {
  process.on("SIGTERM", () => process.kill(process.pid, "SIGINT"));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
} else {
  cookieSession.cookie.secure = true
}

//define REST proxy options based on logged in user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(null)
  }
  res.redirect('/login')
}

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}

app.use(cookieParser());
app.use(session(cookieSession));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));

server.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});


if (process.env.NODE_ENV !== "development") {
  app.all("/api/*", ensureAuthenticated, (req, res) => {

  })
}

app.get("/api/me", (req, res) => {
  console.log(req.user)
  return res.send(req.user)
})

app.get("/api/makers", (req, res) => {
  makerSchema.Maker
    .find({})
    .exec((err, results) => {
      if (err) {
        console.error(err)
      }
      return res.send(results)
    })
})

app.get("/api/makers/:id", (req, res) => {
  makerSchema.Maker
    .findById(req.params.id)
    .exec((err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.put("/api/makers/:id", (req, res) => {
  makerSchema.Maker
    .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get("/api/requests", (req, res) => {
  requestSchema.Request
    .find({})
    .exec((err, results) => {
      if (err) {
        console.error(err)
      }
      return res.send(results)
    })
})

app.post("/api/requests", (req, res) => {
  requestSchema.Request
    .create(req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get("api/requests/:id", (req, res) => {
  requestSchema.Request
    .findById(req.params.id)
    .exec((err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.put("api/requests/:id", (req, res) => {
  requestSchema.Request
    .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get('/login/facebook', passport.authenticate('facebook', { scope: 'email' }))

app.get('/login/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {
  res.send('Logged In.')
})

app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/login/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {
  res.send('Logged In.');
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});