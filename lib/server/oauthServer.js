const app = require('express')();

const port = 3000;

module.exports = (cb) => {

  const callbackUrl = 'http://localhost:3000/callback'

  app.listen(port, (err) => {
    if (err) return console.err(err);
  })

  return cb({
    app,
    callbackUrl,
  })
}