const fs = require('file-system');

// ----- STORES TOKEN LOCALLY IN JWT.TXT

function storeToken(token, logState) {
  fs.writeFile('./jwt.txt', token, function (err) {
    if (err) throw err;
    console.log(
      `You have successfully ${logState}.\nType in clij to start your journey.`
    );
  });
}

// ----- CHECKS IF USER HAS JWT TOKEN
function findToken() {
  if (fs.existsSync('jwt.txt')) {
    // Retrieves JWT token from jwt.txt
    try {
      return fs.readFileSync('jwt.txt').toString();
    } catch {
      return null
    }
  } else {
    return null
  }
}

module.exports = { storeToken, findToken };
