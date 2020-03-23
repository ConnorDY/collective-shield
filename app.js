const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./server/config.js");
const Maker = require("./server/schemas/maker");
const Request = require("./server/schemas/request");
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
  callbackURL: 'http://localhost:' + portNumber + '/login/facebook/callback'
},
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: config.google.id,
  clientSecret: config.google.secret,
  callbackURL: 'http://localhost:' + portNumber + '/login/google/callback'
},
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
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

app.get("/api/makers", (req, res) => {
  Maker.Maker
    .find({})
    .exec((err, results) => {
      if (err) {
        console.error(err)
      }
      return res.send(results)
    })
})

app.get("/api/makers/:id", (req, res) => {
  Maker.Maker
    .findById(req.params.id)
    .exec((err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.put("/api/makers/:id", (req, res) => {
  Maker.Maker
    .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get("/api/requests", (req, res) => {
  Request.Request
    .find({})
    .exec((err, results) => {
      if (err) {
        console.error(err)
      }
      return res.send(results)
    })
})

app.post("/api/requests", (req, res) => {
  Request.Request
    .create(req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get("api/requests/:id", (req, res) => {
  Request.Request
    .findById(req.params.id)
    .exec((err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.put("api/requests/:id", (req, res) => {
  Request.Request
    .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get('/login/facebook', passport.authenticate('facebook'))

app.get('/login/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {
  res.send('Logged In.');
})

app.get('/login/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }))

app.get('/login/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {
  res.send('Logged In.');
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});