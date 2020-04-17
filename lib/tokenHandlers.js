const fs = require('fs')

// ----- STORES TOKEN LOCALLY IN JWT.TXT

function storeToken (token, tokenType = 'jwt') {
  try {
    fs.writeFileSync(`./${tokenType}.txt`, token, function (err) {
      if (err) throw err
      if (tokenType === 'jwt') {
        console.log(
          'You have successfully logged in.\nType in clij to start your journey.'
        )
      }
    })
  } catch (err) {
    console.error('Could not write token to file')
  }
}

// ----- CHECKS IF USER HAS JWT TOKEN
function findToken (tokenType = 'jwt') {
  if (fs.existsSync(`${tokenType}.txt`)) {
    // Retrieves JWT token from jwt.txt
    try {
      const result = fs.readFileSync(`${tokenType}.txt`, 'utf8')
      return result
    } catch (err) {
      return null
    }
  } else {
    return null
  }
}

module.exports = { storeToken, findToken }
