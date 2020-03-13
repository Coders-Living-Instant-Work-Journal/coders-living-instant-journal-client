const inquirer = require('inquirer');
const superagent = require('superagent');
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const fs = require('file-system')
const chalk = require('chalk');
const { gap, greeting, signUpPrompts, signInPrompts, crudPrompts, entryFilter, datePrompt, entryList, updateDelete, updatePrompt, categoryPrompt, createPrompt, categoryDatePrompt, journalList, createJournalPrompt, journalPrompts, updateJournalPrompt } = require('./prompts');

const api_server_uri = 'https://clij.herokuapp.com';

let jwt;


const themeColor = 'green';


// MAIN APP ENTRY FOR UNSIGNED UP & UNSIGNED IN USERS

function greetingMenu() {
  headerHandler();
  inquirer.prompt(greeting)
    .then(answer => {
      switch (answer.signup_or_in) {
        case 'SIGN UP': signUp(); break;
        case 'SIGN IN': signIn(); break;
        case 'EXIT': exitHandler(); break;
        default: null;
      }
    });
}

// SIGN UP

// ----- SIGN UP PROMPT

function signUp() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('-------- SIGN UP ---------\n'));
  inquirer.prompt(signUpPrompts)
    .then(async answer => {
      answer.new_user_password = await bcrypt.hash(answer.new_user_password, 5);
      return answer;
    })
    .then(answer => {
      signUpApi({ email: answer.new_user_email, password: answer.new_user_password, name: answer.new_user_name })        
    });
}

// ----- SEND NEW USER SIGN UP TO API

function signUpApi(user) {
  superagent
    .post(`${api_server_uri}/signup`)
    .send(user)
    .then(res => {
      jwt = res.body.token;
      storeToken(jwt, 'signed up')
      saveJournalApi('Work Journal');
    })
    .catch(err => {
      console.error('User already exists.')
  })
}

// ----- STORES TOKEN LOCALLY IN JWT.TXT

function storeToken(token, logState) {
  fs.writeFile('./jwt.txt', token, function (err) {
    if (err) throw err;
    console.log(`You have successfully ${logState}.\nType in clij to start your journey.`)
  })
}

// JOURNALS

// ----- SENDS NEW JOURNAL TO API

function saveJournalApi(journal) {
  superagent
    .post(`${api_server_uri}/createj`)
    .set('Authorization', jwt)
    .send({ name: journal })
    .then(res => exitHandler(res.text))
    .catch(err => console.error(err.response.body.error))
}


// ----- CHECK FOR JOURNALS - Queries API for list of journal entries associated with user



// SIGN IN

// ----- SIGN IN PROMPT

function signIn() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('-------- SIGN IN ---------\n'));
  inquirer.prompt(signInPrompts)
    .then(answer => {
      superagent
        .post(`${api_server_uri}/signin`)
        .set('Authorization', base64.encode(`${answer.user_email}:${answer.user_password}`))
        .then(res => {
          storeToken(res.body.token, 'signed in')
        })
        .catch(err => console.error(err.response.body.error))
    });    
}



// ----- CHECKS IF USER HAS JWT TOKEN 

if (fs.existsSync('jwt.txt')) {
  // Retrieves JWT token from jwt.txt
  fs.readFile('jwt.txt', function(err,data) {
      if  (err) throw err;
    jwt = data.toString();
  })
  startMenu();
} else {
  greetingMenu();
}

// SIGN OUT

// ----- SIGNS USER OUT BY DELETING JWT FILE

function signOut(message) {
   fs.unlink('jwt.txt', function (err) {
    if (err) throw err;
    if (message) console.log('Invalid Token')
    exitHandler('You have signed out')
  })
}

// START MENU FOR REGISTERED USERS

function startMenu() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------- START MENU -------\n'));
  inquirer.prompt(crudPrompts)
    .then(answer => {
      switch (answer.crud) {
        case 'CREATE ENTRY': createEntry(); break;
        case 'CREATE JOURNAL': createJournal(); break;
        case 'LIST ENTRIES': selectFilter(); break;
        case 'LIST JOURNALS': getJournals(); break;
        case 'SIGN OUT': signOut(); break;
        case 'EXIT': exitHandler(); break;
        default: startMenu(); break;
      }
    })
}

// PROMPTS USER TO CREATE A NEW JOURNAL
function createJournal() {
  inquirer.prompt(createJournalPrompt)
    .then(answer => saveJournalApi(answer.new_journal))
    .catch(err => console.error(err))
}

// retrieves journals from API
function getJournals() {
  superagent
    .get(`${api_server_uri}/readj`)
    .set('Authorization', jwt)
    .then(res => journalPromptConstructor(res.body))
    .catch(err => console.error(err))
}

// ----- ----- Creates journal List

function journalPromptConstructor(journals) {
  entryList[0].choices = [];
  journals.forEach(journal => {
    journalList[0].choices.push(`${journal.name}`)
    journalList[0].choices.push(gap);
  })
  journalList[0].choices.push('EXIT', gap);
  listJournals(journals,);
}

// ----- ----- Renders List

function listJournals(journals) {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT JOURNAL ------\n'));
  inquirer.prompt(journalList)
    .then(answer => {
      if(answer.journal_list === 'EXIT') {
        exitHandler()
      } else {
        const journal = journals.filter(obj => obj.name === answer.name_journal)
        journalOptions(journal[0]);
      }
    })
}

// PRESENTS USER WITH OPTION TO UPDATE, SELECT, OR DELETE JOURNAL
function journalOptions(journal) {
  headerHandler();
  console.log(chalk.keyword(themeColor)(`------ ${journal.name} ------\n`));
  inquirer.prompt(journalPrompts)
    .then(answer => {
      switch (answer.journal_options) {
        case 'CHANGE JOURNAL NAME': updateJournal(journal); break;
        case 'MAKE DEFAULT': selectJournal(journal); break;
        case 'DELETE JOURNAL': deleteJournal(journal); break;
        case 'EXIT': exitHandler(); break;
      }
    })
}

// DELETES JOURNAL
function deleteJournal(journal) {
  superagent
    .delete(`${api_server_uri}/deletej`)
    .set('Authorization', jwt)
    .send({ id:journal._id })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

// changes journal name
function updateJournal(journal) {
  headerHandler()
  console.log(chalk.keyword(themeColor)(`------ ${journal.name} ------\n`));
  inquirer.prompt(updateJournalPrompt)
    .then(answer => updateJournalApi(journal, answer.update_journal) )

}

// QUERIES API TO UPDATE JOURNAL NAME
function updateJournalApi(journal, name) {
  superagent
    .put(`${api_server_uri}/updatej`)
    .set('Authorization', jwt)
    .send({ id:journal._id, name:name })
    .then(res => exitHandler(res.text))
    .catch(err => console.error(err.response.body.error))
}

// QUERIES API TO CHANGE DEFAULT JOURNAL

async function selectJournal(journal) {
  await superagent
    .post(`${api_server_uri}/selectj`)
    .set('Authorization', jwt)
    .send({ jId:journal._id, name:journal.name })
    .then(res => exitHandler(res.text) )
    .catch(err => console.error(err))
}






// CRUD FUNCTIONS

// CREATE

function createEntry() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ CREATE ENTRY ------\n'));
  inquirer.prompt(createPrompt)
    .then(answer => postAPI({ category: answer.create_category_prompt, text: answer.create_text_prompt }))
}

function postAPI(entry) {
  superagent
    .post(`${api_server_uri}/create`)
    .set('Authorization', jwt)
    .send(entry)
    .then(res => exitHandler(`Entry successfully created with id:${res.body.entry._id}`))
    .catch(err => console.error(err.response.body.error))
}

// READ

// ----- PICK A WAY TO FILTER DISPLAY OF ENTRIES: ALL, CATEGORY, DATE, CATEGORY & DATE

function selectFilter() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT FILTER -----\n'));
  inquirer.prompt(entryFilter)
    .then(answer => {
      switch (answer.entry_filters) {
        case 'DISPLAY ALL': getEntries(); break;
        case 'CATEGORY': selectCategory(); break;
        case 'DATE': filterDate(); break;
        case 'CATEGORY AND DATE': filterCategoryDate(); break;
        case 'EXIT': exitHandler(); break;
        default: break;
      }
    })
}

// ----- ----- CATEGORY FILTER

function selectCategory() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('---- ENTER A CATEGORY ----\n'));
  inquirer.prompt(categoryPrompt)
    .then(answer => {
      getEntries({ category: answer.category_prompt })
    })
}

// ----- ----- DATE FILTER

function filterDate() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT DAYS -------\n'));
  inquirer.prompt(datePrompt)
    .then(answer => {
      const dateRange = dateHandler(answer);
      getEntries(dateRange)
    })
}

// ----- ----- CATEGORY & DATE FILTER

function filterCategoryDate() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('-- PICK CATEGORY & DATE --\n'));
  inquirer.prompt(categoryDatePrompt)
    .then(answer => {
      const dateRange = dateHandler(answer)
      dateRange.category = answer.category_prompt;
      getEntries(dateRange)
    })
}

// ----- DISPLAY ALL or AFTER FILTERING BY CATERGORY, DATE, or BOTH - queries api by filter

function getEntries(filter) {
  superagent
    .get(`${api_server_uri}/read`)
    .set('Authorization', jwt)
    .send(filter)
    .then(res => {
      if (res.body[0] === 'No entries found.' ) {
        exitHandler(res.body[0])
      } else {
        entryPromptConstructor(res.body)
      }
    })
    .catch(err => console.error(err.response.body.error))
}

// ----- ----- Creates List for Display All

function entryPromptConstructor(entries) {
  console.log(entries)
  entryList[0].choices = [];
  entries.forEach(entry => {
    entryList[0].choices.push(`${entry.date} ${entry.category} ${entry._id}`)
    entryList[0].choices.push(gap);
  })
  entryList[0].choices.push('EXIT', gap);
  listEntries(entries);
}

// ----- ----- Renders List for Display All

function listEntries(entries) {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT ENTRY ------\n'));
  inquirer.prompt(entryList)
    .then(answer => {
      if(answer.entry_list === 'EXIT') {
        exitHandler()
      } else {
        const entry = entries.filter(obj => obj._id === answer.entry_list.split(' ').pop())
        displayEntry(entry);
      }
    })
}

// ----- ----- Displays the selected Entry from Display All

function displayEntry(entry) {
  headerHandler();
  console.log(chalk.keyword(themeColor)('--------- ENTRY ----------\n'));
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
        exitHandler('No changes have been made'); 
      }
    })
}

function putAPI(entry) {
  superagent
    .put(`${api_server_uri}/update`)
    .set('Authorization', jwt)
    .send(entry)
    .then(res => exitHandler(res.text))
    .catch(err => console.error(err.response.body.error))
}

// DELETE

function deleteEntry(id) {
  superagent
    .delete(`${api_server_uri}/delete`)
    .set('Authorization', jwt)
    .send(id)
    .then(res => exitHandler(res.text))
    .catch(err => console.error(err.response.body.error))
}

// MISCELLANEOUS HANDLERS
// CREATES DATE RANGE FOR FILTER TO BE SENT TO API

function dateHandler(answer) {
  let endDate = new Date();
  let startDate = new Date(endDate.setDate(endDate.getDate() - answer.day_selector));
  endDate = new Date();
  return { startDate: startDate, endDate: endDate };
}

function headerHandler() {
  console.clear();
  clijBannerHandler();
}

function clijBannerHandler() {
  console.log(chalk.keyword(themeColor)('\n ___   _      _   _______'));
  console.log(chalk.keyword(themeColor)('/ __| | |    |_| |___   _|'));
  console.log(chalk.keyword(themeColor)('| |   | |     _   _  | |'));
  console.log(chalk.keyword(themeColor)('| |_  | |__  | | | |_| |'));
  console.log(chalk.keyword(themeColor)('\\___| |____| |_| \\_____/\n'));
}

function exitHandler(message) {
  console.clear();
  if (message) console.log(message);
  process.exit();
}

module.exports = { greetingMenu, signUp, signOut, startMenu, createEntry, selectFilter, filterCategoryDate, selectCategory, filterDate, getEntries, entryPromptConstructor, listEntries, displayEntry, updateEntry, deleteEntry, postAPI, putAPI, signUp, signUpApi, storeToken, signIn, dateHandler, exitHandler };
