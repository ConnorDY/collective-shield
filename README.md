# Collective Shield

## Development

To start the API and UI together, use: `npm run start-dev`.

## API

### Environment Variables

Environment variables are loaded in via a `.env` file in the root of the project.

The following variables are available:

| Variable        | Type     | Required | Description                                               |
| --------------- | -------- | -------- | --------------------------------------------------------- |
| COOKIE_SECRET   | `String` | ✓        | Secret used for encoding cookies                          |
| FACEBOOK_ID     | `String` | ✓        | Facebook client ID                                        |
| FACEBOOK_SECRET | `String` | ✓        | Facebook client secret                                    |
| GOOGLE_ID       | `String` | ✓        | Google client ID                                          |
| GOOGLE_SECRET   | `String` | ✓        | Google client secret                                      |
| MONGODB         | URI      | ✓        | A MongoDB connection URL. Should start with `mongodb://`. |
| OAUTH_DOMAIN    | URI      | ✓        | URL for OAuth                                             |
