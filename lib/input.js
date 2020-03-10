
const inquirer = require('inquirer');
const chalk = require('chalk');
const { greeting, signUpPrompts, signInPrompts } = require('./prompts');
const bcrypt = require('bcrypt');
const superagent = require('superagent');

// api server uri
const api_server_uri = 'localhost:3000';

// AUTH CHECK

// If already signed in, minimist is used to quickly add journal entries or call entries explicitly quickly
// If not signed in, offer the Sign Up/In screen for ease of account work and returns to 

// GREETING

function greetingMenu() {
  headerCLIJ();
  try {
    inquirer.prompt(greeting)
      .then(answer => {
        if (answer.signup_or_in === 'SIGN UP') signUp();
        if (answer.signup_or_in === 'SIGN IN') signIn();
        if (answer.signup_or_in === 'EXIT') process.exit();
      });
  } catch (error) {
    console.log('error', error);
  }
}
greetingMenu();

// SIGN UP

function signUp(command) {
  headerCLIJ();
  try {
    console.log(chalk.keyword('orange')('----- SIGN UP -----\n'));
    inquirer.prompt(signUpPrompts)
      .then(async answer => {
        answer.new_user_password = await bcrypt.hash(answer.new_user_password, 5);
        return answer;
      })
      .then(answer => {
        console.log(answer)
        superagent
          .post(api_server_uri)
          .send(answer)
          .then(res => console.log(res))
          .catch(err => console.error('__err from signUp()__', err))
      }); // S3ND 1T T0 B4CK 3ND
  } catch (error) {
    console.log('error', error);
  }
}

// SIGN IN

function signIn(command) {
  headerCLIJ();
  try {
    console.log(chalk.keyword('orange')('----- SIGN UI -----\n'));
    inquirer.prompt(signInPrompts)
      .then(async answer => {
        answer.user_password = await bcrypt.hash(answer.user_password, 5);
        return answer;
      })
      .then(answer => {
        console.log(answer)
        superagent
          .post(api_server_uri)
          .send(answer)
          .then(res => console.log(res))
          .catch(err => console.error('__err from signIn()__', err))
      }); // S3ND 1T T0 B4CK 3ND
  } catch (error) {
    console.log('error', error);
  }
}

function headerCLIJ() {
  console.clear();
  console.log(chalk.keyword('orange')('===================\n=   CLI JOURNAL   =\n===================\n'));
}

module.exports = { greetingMenu, signUp };
