export default {
  apiPrefix: '/api',
  mongoUri: process.env.MONGODB,
  facebook: {
    id: process.env.FACEBOOK_ID,
    secret: process.env.FACEBOOK_SECRET
  },
  google: {
    id: process.env.GOOGLE_ID,
    secret: process.env.GOOGLE_SECRET
  },
  domainName: process.env.OAUTH_DOMAIN,
  cookieSecret: process.env.COOKIE_SECRET,
  mailgunAPIKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN
};
