
const inquirer = require('inquirer');
// import password from '@inquirer/password';

// QUESTIONS

const greeting = [
  {
    type: 'list',
    name: 'signup_or_in',
    message: "What would you like to do?",
    choices: ['SIGN UP', new inquirer.Separator(), 'SIGN IN', new inquirer.Separator(), 'EXIT']
  }
]

const signUpPrompts = [
  {
    type: 'input',
    name: 'new_user_email',
    message: "Please enter your email address.",
    validate: function (value) {
      var pass = value.match(
        // /^[A-z]+(\.[A-z]+)?@[A-z]+\.(net|com|org)$/i
        /^[A-z0-9_.-]*@[A-z0-9_.-]+\.(net|com|org)$/i
      );
      if (pass) return true;
      return 'Please enter a valid email address';
    },
  },
  {
    type: 'input',
    name: 'new_user_name',
    message: "Please enter your first and last name",
    validate: function (value) {
      var pass = value.match(
        /^[a-z ,.'-]+$/i
      )
      if (pass) return true;
      return 'Make sure to enter a first and last name'
    }
  },
  {
    type: 'password',
    name: 'new_user_password',
    message: "Please enter a password.",
  }
]

const signInPrompts = [
  {
    type: 'input',
    name: 'user_email',
    message: "Please enter your email address",
    validate: function (value) {
      var pass = value.match(
        /^[A-z]+(\.[A-z]+)?@[A-z]+\.(net|com|org)$/i
      );
      if (pass) return true;
      return 'Please enter a valid email address';
    },
  },
  {
    type: 'password',
    name: 'user_password',
    message: "Please enter your password",
  }
]

// Prompt functions

module.exports = { greeting, signUpPrompts, signInPrompts }
