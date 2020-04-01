Lango
===

Lango runs at [www.lango.fi](https://www.lango.fi/).

Development
---

Install the dependencies by running `yarn`. Development environment variables are stored in a `.env` file and more info about it can be found in the main documentation.

Facebook requires HTTPS when using their login functionality even in the development environment. Therefore, an HTTPS proxy is needed. To start the development server and proxy run the following commands in separate terminals:

    yarn start
    yarn proxy

Facebook login works only for https://localhost:4449.

If you want to work on push notifications, keep in mind they won't probably work with a fake HTTPS certificate. You have to use http://localhost:3000/ to go around that. Sometimes webpack-dev-server doesn't work either so you have to build the thing manually with `yarn run build:dev` and run it with e.g. `python3 -m http.server` while inside `build/`.

Production
---

To run Lango in production mode, run:

    yarn start:production

To build Lango for production deployment, run:

    yarn build

Versioning and Branches
---

Whatever is the tip of `master` should be what is running in production. The main branch for development is `dev`. Nothing ever gets committed to `master` directly – all new commits have to go through `dev` to ensure that `master` is a subset of `dev`.

Deploying
---

The objective is to make CodeBuild listen to the Lango GitHub repo and deploy `master` and `dev` to S3 and CloudFront automatically. The buildspec files in the repo root are there to tell CodeBuild what to do. The prod and dev project configurations (managed via AWS console) are pretty much identical except for the few tier-specific settings and a bunch of dev-specific environment variables only found in dev.

Integration Tests for AppSync
---

To run integration tests, GraphQL queries and mutations are made in AppSync. However, to do this, you need a test user access token to let the code pretend that it is making commands on behalf of the user.

To obtain a token and its expiration time, open up Lango, log in as a test user, open the console and enter `` `TEST_FB_ACCESS_TOKEN=${FB.getAuthResponse().accessToken} TEST_FB_EXPIRES_AT=${FB.getAuthResponse().data_access_expiration_time}`;`` That should return a string that you can copy.

To run the tests, execute `[the string copied in the previous step] npm run test:appsync`. The code should complain should anything go wrong or the string be copied wrong.
