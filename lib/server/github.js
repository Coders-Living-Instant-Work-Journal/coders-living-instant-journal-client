// const { storeToken } = require('../tokenHandlers');
const fs = require('file-system');
const open = require('open');
require('dotenv').config();
const superagent = require('superagent');

const createApplication = require('./oauthServer');
const simpleOauthModule = require('simple-oauth2');

createApplication(({ app, callbackUrl }) => {
  const oauth2 = simpleOauthModule.create({
    client: {
      id: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_APP_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });

  // Authorization uri definition
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: callbackUrl,
    scope: 'read:user',
    state: 'thisIsMyState',
  });

  // Initial page redirecting to Github
  app.get('/auth', (req, res) => {
    console.log('auth uri', authorizationUri);
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/gitHubOAuth', async (req, res) => {
    const { code } = req.query;
    const options = {
      code,
    };

    try {
      //make second request to github to get the token with the code.
      const result = await oauth2.authorizationCode.getToken(options);

      console.log('The resulting token: ', result);

      const response = await superagent
        .get('https://api.github.com/user')
        .set({
          Authorization: `token ${result.access_token}`,
          'user-agent': 'express-app',
        });
      console.log('response: ', response.body);
      // await fs.writeFile('response.txt', JSON.stringify(response));

      res.status(200).json({
          message: 'You logged in! You can close this window. ',
          token: result.access_token,
        });

      // //store the token.
      // storeToken(token);

      // exchange this github token for a clij bearer token...
      //1. send that github token to our server (eugene)
      //2. server exchanges it for a freshly signed clij jwt.
      //3. we store that token .

      return;
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });
});

open('http://localhost:3000/auth');
