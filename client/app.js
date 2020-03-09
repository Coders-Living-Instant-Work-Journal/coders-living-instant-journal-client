
// Inspired byhttps://www.dev2qa.com/node-js-get-user-input-from-command-line-prompt-example/

// Get process.stdin as the standard input object
let input = process.stdin;

// Set input character encoding
input.setEncoding('utf-8');

// Prompt user to sign up in console
console.log("Sign Up for a CLIWJ Account or type cancel");

// When user inputs name and clicks enter,
input.on('data', userName  => {

  if (userName  === 'cancel\n') {
    console.log("\nUser has canceled sign up, exiting CLIWJ");
    process.exit();
  } else {
    console.log(`\nRegistration Success\n\nThank you, ${userName}`);
  }
});

module.exports = { input };
