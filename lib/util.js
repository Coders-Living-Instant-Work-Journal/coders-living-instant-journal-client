
// MISCELLANEOUS HANDLERS
// CREATES DATE RANGE FOR FILTER TO BE SENT TO API

function dateHandler (answer) {
  let endDate = new Date()
  const startDate = new Date(endDate.setDate(endDate.getDate() - answer.day_selector))
  endDate = new Date()
  return { startDate: startDate, endDate: endDate }
}

function checkForEmail (credentials) {
  return !!credentials.email
}

module.exports = {
  dateHandler,
  checkForEmail
}
