# Collective Shield

## Development

To start the API and UI together, use: `npm run start-dev`. Then, access `http://localhost:3050` in your browser.

## UI

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

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
