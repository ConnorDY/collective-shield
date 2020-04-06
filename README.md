# Collective Shield

## Getting started

### Step 1: Install linting dependencies

Run `npm install` in the root directory of the project to install the development dependencies used for linting.

### Step 2: Install project dependencies

Run the following command from the root project directory to install the API and UI dependencies:

```bash
cd api && npm install && cd ../ui && npm install
```

### Step 3: Create your API `.env` file

Create a file called `api/.env` with the following contents:

```
COOKIE_SECRET=XXXXX
MONGODB=XXXXX
FACEBOOK_ID=XXXXX
FACEBOOK_SECRET=XXXXX
GOOGLE_ID=XXXXX
GOOGLE_SECRET=XXXXX
OAUTH_DOMAIN=http://localhost:3050
```

Replace `XXXXX` with the respective values.<br>
See [here](#environment-variables) for more information about these variables.

### Step 4: Run the API

To start the API, run the following command:

```bash
cd api && npm start
```

You should see something resembling the following outputted to your console:

```
Using ts-node version 8.8.2, typescript version 3.8.3
[HPM] Proxy created: /  -> http://localhost:3000
Express web server started: http://localhost:3050
Connected to MongoDb
```

### Step 5: Run the UI

While the API is still running, open up a new terminal and run the following command to start the UI:

```bash
cd ui && npm start
```

After the UI finishes starting up, navigate to `http://localhost:3050/` to view the app.

## API

### Building for Production

To transpile the TypeScript code into plain JavaScript that Node can run, use the following command:

```bash
cd api && npm run build
```

This outputs to: `api/build`.

### Environment Variables

Environment variables are loaded in via the `.env` file in the `api` folder.

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

## UI

### Building for Production

Run the following command to build the app for production to the `ui/build` folder:

```bash
cd ui && npm run build
```

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
