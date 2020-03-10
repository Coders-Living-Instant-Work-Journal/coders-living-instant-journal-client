
const inquirer = require('inquirer');
const chalk = require('chalk');
const { greeting, signUpPrompts, signInPrompts, crudPrompts, entryFilter, datePrompt, entryList, updateDelete, updatePrompt } = require('./prompts');
const bcrypt = require('bcrypt');
const superagent = require('superagent');

const api_server_uri = 'http://localhost:3000';

// AUTH CHECK

// If already signed in, minimist is used to quickly add journal entries or call entries explicitly quickly
// If not signed in, offer the Sign Up/In screen for ease of account work and returns to 

// GREETING

function greetingMenu() {
  headerCLIJ();
  try {
    inquirer.prompt(greeting)
      .then(answer => {
        switch (answer.signup_or_in) {
          case 'SIGN UP': signUp(); break;
          case 'SIGN IN': signIn(); break;
          case 'EXIT': exitHandler();
          default: null;
        }
      });
  } catch (error) {
    console.error('error', error);
  }
}

// START MENU

function startMenu() {
  headerCLIJ();
  try {
    console.log(chalk.keyword('orange')('----- START MENU -----\n'));
    inquirer.prompt(crudPrompts)
      .then(answer => {
        switch (answer.crud) {
          case 'CREATE ENTRY': createEntry(); break;
          case 'LIST ENTRIES': selectFilter(); break;
          case 'EDIT ENTRY': editEntry(); break;
          case 'DELETE ENTRY': deleteEntry(); break;
          case 'EXIT': exitHandler();
          default: startMenu(); break;
        }
      })
  } catch (error) {
    console.error('error', error);
  }
}

// CRUD FUNCTIONS

// CREATE

function createEntry() {
  headerCLIJ();
  try {
    console.log(chalk.keyword('orange')('----- CREATE ENTRY -----\n'));
    superagent
      .post(`${api_server_uri}/create`)
      .send()
      .catch(error => console.error(error))
  } catch (error) {
    console.error('error', error);
  }
}

// READ

function selectFilter() {
  headerCLIJ();
  console.log(chalk.keyword('orange')('----- SELECT FILTER -----\n'));
  inquirer.prompt(entryFilter)
    .then(answer => {
      switch (answer.entry_filters) {
        case 'DISPLAY ALL': getEntries(); break;
        case 'CATEGORIES': getCategories(); break;
        case 'DATE': getDate(); break;
        case 'JOURNAL': getJournals(); break;
        case 'EXIT': exitHandler(); break;
        default: break;
      }
    })
}

function getCategories() {
  // get request of categories by filtering json on category property within each journal

  // should send { category: selected category }
  getEntries(filter);
}

function getDate() {
  headerCLIJ();
  console.log(chalk.keyword('orange')('----- SELECT DAYS -----\n'));
  inquirer.prompt(datePrompt)
    .then(answer => {
      let endDate = new Date()
      let startDate = new Date(endDate.setDate(endDate.getDate() - answer.day_selector));
      endDate = new Date()
      getEntries({ startDate: startDate, endDate: endDate })
    })
}

function getJournals() {
  // get request of journals by filtering json on journal property within each user

  getEntries(filter);
}

function getEntries(filter) {
  console.log(filter)
  superagent
    .get(`${api_server_uri}/read`)
    .query(filter)
    .then(res => entryPromptConstructor(res.body))
    .catch(err => console.error(err))
}

function entryPromptConstructor(entries) {
  entryList[0].choices = [];
  console.log(entries)
  entries.forEach(entry => {
    entryList[0].choices.push(`${entry.date} ${entry.category} ${entry._id}`)
    entryList[0].choices.push(new inquirer.Separator());
  })
  entryList[0].choices.push('EXIT', new inquirer.Separator())
  listEntries(entries);
}

function listEntries(entries) {
  headerCLIJ();
  console.log(chalk.keyword('orange')('----- SELECT ENTRY -----\n'));
  inquirer.prompt(entryList)
    .then(answer => {
      const entry = entries.filter(obj => obj._id === answer.entry_list.split(' ')[2])
      displayEntry(entry);
    })
}

function displayEntry(entry) {
  headerCLIJ();
  console.log(chalk.keyword('orange')('----- ENTRY -----\n'));
  console.log(`id:       ${entry[0]._id}`)
  console.log(`date:     ${entry[0].date}`)
  console.log(`category: ${entry[0].category}`)
  console.log(`entry: \n${entry[0].text}`)
  inquirer.prompt(updateDelete)
    .then(answer => {
      switch (answer.update_delete) {
        case 'UPDATE ENTRY': updateEntry(entry[0]); break;
        case 'DELETE ENTRY': deleteEntry(entry._id); break;
        case 'START MENU': startMenu(); break;
        case 'EXIT': exitHandler(); break;
        default: break;
      }
    })
}

// UPDATE

function updateEntry(entry) {
  updatePrompt[0].default = entry.category;
  updatePrompt[1].default = entry.text;
  inquirer.prompt(updatePrompt)
    .then(answer => {
      if (answer.update_category !== entry.category && answer.update_entry !== entry.text) {
        postAPI({ category: answer.update_category, id: entry._id, text: answer.update_entry })
      } else if (answer.update_category !== entry.category) {
        postAPI({ category: answer.update_category, id: entry._id })
      } else if (answer.update_entry !== entry.text) {
        postAPI({ text: answer.update_entry, id: entry._id })
      } else {
        console.log('updateEntry() __unexpected ELSE hit__'); // REMOVE THIS LATER
      }
    })
}

// POST TO API

function postAPI(entry) {
  console.log(entry)
  superagent
    .put(`${api_server_uri}/update`)
    .send(entry)
    .then(res => {
      console.log(res.text)
    })
    .catch(error => console.error(error))
}

// SIGN UP

function signUp() {
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
          .then(res => {
            console.log(res);
            logStatus = true;
          })
          .catch(err => console.error('__err from signUp()__', err))
      });
  } catch (error) {
    console.log('error', error);
  }
}

// SIGN IN

function signIn() {
  headerCLIJ();
  try {
    console.log(chalk.keyword('orange')('----- SIGN IN -----\n'));
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
          .then(res => {
            console.log(res)
            logStatus = true;
          })
          .catch(err => console.error('__err from signIn()__', err))
      });
  } catch (error) {
    console.log('error', error);
  }
}

// TODO: Create function that compares web token with server
let logStatus = false;
if (logStatus) {
  greetingMenu();
} else {
  startMenu();
}

function headerCLIJ() {
  console.clear();
  console.log(chalk.keyword('orange')('===================\n=   CLI JOURNAL   =\n===================\n'));
}

function exitHandler() {
  console.clear();
  process.exit();
}

module.exports = { greetingMenu, signUp };
