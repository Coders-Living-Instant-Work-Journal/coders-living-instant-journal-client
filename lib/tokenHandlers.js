const fs = require("file-system");

// ----- STORES TOKEN LOCALLY IN JWT.TXT

function storeToken(token, tokenType, logState) {
  fs.writeFile(`./${tokenType}.txt`, token, function (err) {
    if (err) throw err;
    if (tokenType === "jwt") {
      console.log(
        `You have successfully ${logState}.\nType in clij to start your journey.`
      );
    }
  });
}

// ----- CHECKS IF USER HAS JWT TOKEN
function findToken(tokenType = 'jwt') {
  if (fs.existsSync(`${tokenType}.txt`)) {
    // Retrieves JWT token from jwt.txt
    try {
      return fs.readFileSync(`${tokenType}.txt`).toString();
    } catch {
      return null;
    }
  } else {
    return null;
  }
}

module.exports = { storeToken, findToken };
