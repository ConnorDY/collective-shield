module.exports = {
    mongoUri: process.env.MONGODB || "***REMOVED***",
    facebook: {
        id: process.env.FACEBOOK_ID || "***REMOVED***",
        secret: process.env.FACEBOOK_SECRET || "***REMOVED***"
    },
    google: {
        id: process.env.GOOGLE_ID || "***REMOVED***",
        secret: process.env.GOOGLE_SECRET || "***REMOVED***"
    },
    domainName: process.env.OAUTH_DOMAIN || "http://localhost:3050",
    cookieSecret: process.env.COOKIE_SECRET || "***REMOVED***",
    sparkpostKey: process.env.SPARKPOST_KEY || "***REMOVED***"
};