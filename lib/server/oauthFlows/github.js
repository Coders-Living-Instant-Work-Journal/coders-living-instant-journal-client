
const open = require('open')
require('dotenv').config()
const superagent = require('superagent')
const { storeToken } = require('../../tokenHandlers')

const createApplication = require('../')
const simpleOauthModule = require('simple-oauth2')

module.exports = () => {
  return new Promise((resolve, reject) => {
    createApplication(({ app, callbackUrl, server }) => {
      const oauth2 = simpleOauthModule.create({
        client: {
          id: process.env.GITHUB_CLIENT_ID,
          secret: process.env.GITHUB_APP_CLIENT_SECRET
        },
        auth: {
          tokenHost: 'https://github.com',
          tokenPath: '/login/oauth/access_token',
          authorizePath: '/login/oauth/authorize'
        }
      })

      // Authorization uri definition
      const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: callbackUrl,
        scope: 'read:user',
        state: 'thisIsMyState'
      })

      // Initial page redirecting to Github
      app.get('/auth', (req, res) => {
        res.status(302).redirect(authorizationUri)
      })

      // import the oauth handshake logic.
      app.get('/gitHubOauth', async (req, res) => {
        const { code } = req.query
        const options = {
          code
        }

        try {
          // make second request to github to get the token with the code.
          const result = await oauth2.authorizationCode.getToken(options)

          // exchange this token for some user data.
          const response = await superagent.get('https://api.github.com/user').set({
            Authorization: `token ${result.access_token}`,
            'user-agent': 'express-app'
          })

          // store token and resolve promise.
          const dataToStore = {
            provider: 'github',
            token: result.access_token,
            email: response.body.email
          }

          await storeToken(JSON.stringify(dataToStore), 'oauth')

          // send response to user in browser.
          res.status(200).send('Authentication successful! You can now close this window and return to the terminal.')
          resolve()

          // on any error, fail authentication and reject.
        } catch (error) {
          console.error('Access Token Error', error.message)
          reject()
          res.status(500).json('Authentication failed')

          // close the server in any case.
        } finally {
          server.close()
        }
      })

      // open the browser to /auth
      open(`http://localhost:${process.env.MINIPORT}/auth`)
      // open(`http://localhost:${process.env.MINIPORT}/auth`)
    })
  })
}
