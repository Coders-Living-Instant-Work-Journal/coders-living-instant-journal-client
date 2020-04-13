const fs = require('fs');
const path = require('path')

// ----- STORES TOKEN LOCALLY IN JWT.TXT

function storeToken(token, tokenType = 'jwt', logState) {
  try {
    fs.writeFileSync(`./${tokenType}.txt`, token, function (err) {
      if (err) throw err;
      if (tokenType === 'jwt') {
        console.log(
          `You have successfully ${logState}.\nType in clij to start your journey.`
        );
      }
    });
  } catch (err) {
    console.error('Could not write token to file')
  }
}

// ----- CHECKS IF USER HAS JWT TOKEN
function findToken(tokenType = 'jwt') {
  if (fs.existsSync(`${tokenType}.txt`)) {
    // Retrieves JWT token from jwt.txt
    try {
      console.log('finding token... type:', tokenType);
      const result = fs.readFileSync(`${tokenType}.txt`, 'utf8');
      console.log('found token.. ', result)
      return result
    } catch (err) {
      console.log('error', err)
      return null;
    }
  } else {
    return null;
  }
}

module.exports = { storeToken, findToken };
