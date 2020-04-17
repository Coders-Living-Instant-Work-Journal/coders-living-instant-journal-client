// functions
const { findToken } = require('./tokenHandlers')
const { greetingMenu, startMenu } = require('./promptsHandlers')

bootstrap()

function bootstrap () {
  const jwt = findToken()
  if (jwt !== null) {
    startMenu()
  } else {
    greetingMenu()
  }
}
