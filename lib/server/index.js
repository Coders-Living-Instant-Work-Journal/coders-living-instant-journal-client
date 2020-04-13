const app = require('express')();
require('dotenv').config();

const port = process.env.MINIPORT || 3001

module.exports = (cb) => {
  
  const callbackUrl = `http://localhost:${port}/gitHubOAuth`
  
  const server = app.listen(port, (err) => {
      console.log('listening on ', port)
      if (err) return console.err(err);
    })

  return cb({
    app,
    callbackUrl,
    server
  })
}