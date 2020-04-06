import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import config from './config';
import { User, UserLogin } from './schemas';
import { getIp } from './utils';

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

//define REST proxy options based on logged in user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
