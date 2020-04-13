const fs = require('file-system');

// ----- STORES TOKEN LOCALLY IN JWT.TXT

async function storeToken(token, tokenType, logState) {
  try {
    await fs.writeFile(`./${tokenType}.txt`, token, function (err) {
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
      const data = fs.readFileSync(`${tokenType}.txt`, 'utf8')
      console.log('your token is: ', data);
      return data
    } catch {
      return null;
    }
  } else {
    return null;
  }
}

module.exports = { storeToken, findToken };
