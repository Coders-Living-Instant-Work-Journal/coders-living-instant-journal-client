function exitHandler (message) {
  console.clear()
  if (message) console.log(message)
  process.exit()
}

module.exports = exitHandler