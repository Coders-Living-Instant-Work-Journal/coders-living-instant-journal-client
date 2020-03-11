
const inquirer = require('inquirer');
const chalk = require('chalk');
const { gap, greeting, signUpPrompts, signInPrompts, crudPrompts, entryFilter, datePrompt, entryList, updateDelete, updatePrompt, categoryPrompt, createPrompt, categoryDatePrompt } = require('./prompts');
const bcrypt = require('bcrypt');
const superagent = require('superagent');

const api_server_uri = 'http://localhost:3000';

// AUTH CHECK

// If already signed in, minimist is used to quickly add journal entries or call entries explicitly quickly
// If not signed in, offer the Sign Up/In screen for ease of account work and returns to 

// GREET NEW AND EXISING USERS

function greetingMenu() {
  headerHandler();
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

// START MENU FOR REGISTERED USERS

function startMenu() {
  headerHandler();
  try {
    console.log(chalk.keyword('orange')('----- START MENU -----\n'));
    inquirer.prompt(crudPrompts)
      .then(answer => {
        switch (answer.crud) {
          case 'CREATE ENTRY': createEntry(); break;
          case 'LIST ENTRIES': selectFilter(); break;
          case 'EDIT ENTRY': selectFilter(); break;
          case 'DELETE ENTRY': selectFilter(); break;
          case 'EXIT': exitHandler();
          default: startMenu(); break;
        }
      })
  } catch (error) {
    console.error('error', error);
  }
}

// CRUD FUNCTIONS

// DELETE

function deleteEntry() {

}

// CREATE

function createEntry() {
  headerHandler();
  console.log(chalk.keyword('orange')('----- CREATE ENTRY -----\n'));
  inquirer.prompt(createPrompt)
    .then(answer => postAPI({ category: answer.create_category_prompt, text: answer.create_text_prompt }))

}

// READ

function selectFilter() {
  headerHandler();
  console.log(chalk.keyword('orange')('----- SELECT FILTER -----\n'));
  inquirer.prompt(entryFilter)
    .then(answer => {
      switch (answer.entry_filters) {
        case 'DISPLAY ALL': getEntries(); break;
        case 'CATEGORY': selectCategory(); break;
        case 'DATE': filterDate(); break;
        case 'CATEGORY AND DATE': filterCategoryDate(); break;
        // case 'JOURNAL': getJournals(); break;
        case 'EXIT': exitHandler(); break;
        default: break;
      }
    })
}

function filterCategoryDate() {
  headerHandler();
  console.log(chalk.keyword('orange')('----- ENTER A CATEGORY AND DATE -----\n'));
  inquirer.prompt(categoryDatePrompt)
    .then(answer => {
      const dateRange = dateHandler(answer)
      dateRange.category = answer.category_prompt;
      getEntries(dateRange)
    })
}

function selectCategory() {
  headerHandler();
  console.log(chalk.keyword('orange')('----- ENTER A CATEGORY -----\n'));
  // get request of categories by filtering json on category property within each journal
  inquirer.prompt(categoryPrompt)
    .then(answer => {
      getEntries({ category: answer.category_prompt })
    })
  // STRETCH: does text turn green after inputed category typed is a match?
  // STRETCH: list all categories if requested
}

function filterDate() {
  headerHandler();
  console.log(chalk.keyword('orange')('----- SELECT DAYS -----\n'));
  inquirer.prompt(datePrompt)
    .then(answer => {
      const dateRange = dateHandler(answer);
      getEntries(dateRange)
    })
}

function getJournals() {
  // get request of journals by filtering json on journal property within each user

  getEntries(filter);
}

// READ continued - queries api for entries based on filter

function getEntries(filter) {
  superagent
    .get(`${api_server_uri}/read`)
    .send(filter)
    .then(res => {
      entryPromptConstructor(res.body)
    })
    .catch(err => console.error('error', err))
}

function entryPromptConstructor(entries) {
  entryList[0].choices = [];
  entries.forEach(entry => {
    entryList[0].choices.push(`${entry.date} ${entry.category} ${entry._id}`)
    entryList[0].choices.push(gap);
  })
  entryList[0].choices.push('EXIT', gap);
  listEntries(entries);
}

function listEntries(entries) {
  headerHandler();
  console.log(chalk.keyword('orange')('----- SELECT ENTRY -----\n'));
  inquirer.prompt(entryList)
    .then(answer => {
      const entry = entries.filter(obj => obj._id === answer.entry_list.split(' ')[2])
      displayEntry(entry);
    })
}

function displayEntry(entry) {
  headerHandler();
  console.log(chalk.keyword('orange')('----- ENTRY -----\n'));
  console.log(`id:       ${entry[0]._id}`)
  console.log(`date:     ${entry[0].date}`)
  console.log(`category: ${entry[0].category}`)
  console.log(`entry: \n${entry[0].text}\n`)
  inquirer.prompt(updateDelete)
    .then(answer => {
      switch (answer.update_delete) {
        case 'UPDATE ENTRY': updateEntry(entry[0]); break;
        case 'DELETE ENTRY': deleteEntry({ id: entry[0]._id }); break;
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
        putAPI({ category: answer.update_category, id: entry._id, text: answer.update_entry })
      } else if (answer.update_category !== entry.category) {
        putAPI({ category: answer.update_category, id: entry._id })
      } else if (answer.update_entry !== entry.text) {
        putAPI({ text: answer.update_entry, id: entry._id })
      } else {
        console.log('No changes have been made'); // REMOVE THIS LATER
        exitHandler();
      }
    })
}

// DELETE

function deleteEntry(id) {
  superagent
    .delete(`${api_server_uri}/delete`)
    .send(id)
    .catch(err => console.error('error', err))
}

// POST TO API

function postAPI(entry) {
  superagent
    .post(`${api_server_uri}/create`)
    .send(entry)
    .catch(err => console.error('error', err))
}

// PUT TO API

function putAPI(entry) {
  superagent
    .put(`${api_server_uri}/update`)
    .send(entry)
    .then(res => {
      console.log(res.text)
    })
    .catch(err => console.error('error', err))
}

// SIGN UP

function signUp() {
  headerHandler();
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
          .catch(err => console.error('error', err))
      });
  } catch (error) {
    console.error('error', error);
  }
}

// SIGN IN

function signIn() {
  headerHandler();
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
          .catch(err => console.error('error', err))
      });
  } catch (err) {
    console.log('error', err);
  }
}

// TODO: Create function that compares web token with server
let logStatus = false;
logStatus ? greetingMenu() : startMenu();

// MISCELLANEOUS HANDLERS

function dateHandler(answer) {
  let endDate = new Date();
  let startDate = new Date(endDate.setDate(endDate.getDate() - answer.day_selector));
  endDate = new Date();
  return { startDate: startDate, endDate: endDate };
}

function headerHandler() {
  console.clear();
  clijBannerHandler();
  console.log(chalk.keyword('orange')('===================\n=   CLI JOURNAL   =\n===================\n'));
}

function clijBannerHandler() {
  console.log(chalk.yellow('\n ___   _      _   _______'));
  console.log(chalk.yellow('/ __| | |    |_| |___   _|'));
  console.log(chalk.yellow('| |   | |     _   _  | |'));
  console.log(chalk.yellow('| |_  | |__  | | | |_| |'));
  console.log(chalk.yellow('\\___| |____| |_| \\_____/\n'));
}

function exitHandler() {
  console.clear();
  process.exit();
}

module.exports = { greetingMenu, signUp };
