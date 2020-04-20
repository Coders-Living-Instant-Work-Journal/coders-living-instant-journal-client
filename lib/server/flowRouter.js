
const githubFlow = require('./oauthFlows/github')

module.exports = {
  close: () => {
    console.log('closed the server')
  },

  start: async (flow) => {
    await githubFlow()
  }
}
