const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('file-system');
const {
  crudPrompts,
  createPrompt,
  greeting,
  signUpPrompts,
  journalList,
  journalPrompts,
  updateJournalPrompt,
  createJournalPrompt,
  entryFilter,
  entryList,
  updateDelete,
  updatePrompt,
  categoryPrompt,
  datePrompt,
  categoryDatePrompt,
  emailPrompt,
} = require('./prompts');
const {
  getEntries,
  getJournals,
  updateJournalApi,
  selectJournal,
  deleteJournal,
  saveJournalApi,
  postApi,
  putApi,
  deleteEntry,
  signUpOauth,
  exchangeToken,

} = require('./apiHandlers');
const { journalPromptConstructor, entryPromptConstructor } = require('./dynamicPrompts');
const exitHandler = require('./exit');
const { dateHandler } = require('./util');

const themeColor = 'green';
// START MENU FOR REGISTERED USERS
// MAIN APP ENTRY FOR UNSIGNED UP & UNSIGNED IN USERS

function greetingMenu(message) {
  headerHandler();
  if (message) {
    console.log(chalk.keyword('red')(`${message}\n`))
  }
  inquirer.prompt(greeting).then((answer) => {
    switch (answer.signup_or_in) {
      case 'SIGN UP':
        signUp(false);
        break;
      case 'SIGN IN':
        signUp(true);
        break;
      case 'EXIT':
        exitHandler();
        break;
      default:
        null;
    }
  });
}

function startMenu(message) {
  headerHandler();
  if (message) console.log(message + '\n');
  console.log(chalk.keyword(themeColor)('------- START MENU -------\n'));
  inquirer.prompt(crudPrompts).then((answer) => {
    switch (answer.crud) {
      case 'CREATE ENTRY':
        createEntry();
        break;
      case 'CREATE JOURNAL':
        createJournal();
        break;
      case 'LIST ENTRIES':
        selectFilter();
        break;
      case 'LIST JOURNALS':
        fetchAndDisplayMenu(getJournals, journalPromptConstructor, listJournals);
        break;
      case 'SIGN OUT':
        signOut();
        break;
      case 'EXIT':
        exitHandler();
        break;
      default:
        startMenu();
        break;
    }
  });
}

async function fetchAndDisplayMenu(
  fetchResource,
  promptConstructor,
  display,
  filter = {}
) {
  const resource = await fetchResource(filter);
  if (typeof resource[0] === 'string') {
    exitHandler(resource[0]);
  } else {
    promptConstructor(resource);
    display(resource);
  }
}

// PRESENTS USER WITH OPTION TO UPDATE, SELECT, OR DELETE JOURNAL
function journalOptions(journal) {
  headerHandler();
  console.log(chalk.keyword(themeColor)(`------ ${journal.name} ------\n`));
  inquirer.prompt(journalPrompts).then((answer) => {
    switch (answer.journal_options) {
      case 'CHANGE JOURNAL NAME':
        updateJournal(journal);
        break;
      case 'MAKE DEFAULT':
        selectJournal(journal);
        break;
      case 'DELETE JOURNAL':
        deleteJournal(journal);
        break;
      case 'START MENU':
        startMenu();
      case 'EXIT':
        exitHandler();
        break;
    }
  });
}

function entryMenuConstructor(command) {
  const promptInstructions = {
    CATEGORY: {
      message: '---- ENTER A CATEGORY ----\n',
      filterKey: 'category',
      prompt: categoryPrompt,
    },
    DATE: {
      message: '------ SELECT DAYS -------\n',
      filterKey: dateHandler,
      prompt: datePrompt,
    },
    'CATEGORY AND DATE': {
      message: '-- PICK CATEGORY & DATE --\n',
      filterKey: dateHandler,
      prompt: categoryDatePrompt,
    },
  };

  headerHandler();
  if (command === 'DISPLAY ALL') {
    fetchAndDisplayMenu(getEntries, entryPromptConstructor, listEntries);
  } else {
    const current = promptInstructions[command];

    console.log(chalk.keyword(themeColor)(current.message));
    inquirer.prompt(current.prompt).then((answer) => {
      let filterObject = {};

      //if the filterKey is a function , call it to retrieve the date range.
      if (typeof current.filterKey === 'function') {
        filterObject = current.filterKey(answer);
        //tack on the category if it exists -- this is the case where it's category and date.
        if (answer.category_prompt) filterObject.category = answer.category_prompt;
      } else {
        //TODO: category_prompt hard-coded.  :(
        filterObject[current.filterKey] = answer.category_prompt;
      }
      //once the filterObject is built, fetch and display the results
      fetchAndDisplayMenu(getEntries, entryPromptConstructor, listEntries, filterObject);
    });
  }
}

function selectFilter() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT FILTER -----\n'));
  inquirer.prompt(entryFilter).then((answer) => {
    entryMenuConstructor(answer.entry_filters);
  });
}

// ----- ----- Displays the selected Entry from Display All

function displayEntry(entry) {
  headerHandler();
  console.log(chalk.keyword(themeColor)('--------- ENTRY ----------\n'));
  console.log(`id:       ${entry[0]._id}`);
  console.log(`date:     ${entry[0].date}`);
  console.log(`category: ${entry[0].category}`);
  console.log(`entry: \n${entry[0].text}\n`);
  inquirer.prompt(updateDelete).then((answer) => {
    switch (answer.update_delete) {
      case 'UPDATE ENTRY':
        updateEntry(entry[0]);
        break;
      case 'DELETE ENTRY':
        deleteEntry({ id: entry[0]._id });
        break;
      case 'START MENU':
        startMenu();
        break;
      case 'EXIT':
        exitHandler();
        break;
      default:
        break;
    }
  });
}

// changes journal name
function updateJournal(journal) {
  headerHandler();
  console.log(chalk.keyword(themeColor)(`------ ${journal.name} ------\n`));
  inquirer
    .prompt(updateJournalPrompt)
    .then((answer) => updateJournalApi(journal, answer.update_journal));
}
// UPDATE

function updateEntry(entry) {
  updatePrompt[0].default = entry.category;
  updatePrompt[1].default = entry.text;
  inquirer.prompt(updatePrompt).then((answer) => {
    if (answer.update_category !== entry.category && answer.update_entry !== entry.text) {
      putApi({
        category: answer.update_category,
        id: entry._id,
        text: answer.update_entry,
      });
    } else if (answer.update_category !== entry.category) {
      putApi({ category: answer.update_category, id: entry._id });
    } else if (answer.update_entry !== entry.text) {
      putApi({ text: answer.update_entry, id: entry._id });
    } else {
      exitHandler('No changes have been made');
    }
  });
}
// ----- ----- Renders List for Display All

function listEntries(entries) {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT ENTRY ------\n'));
  inquirer.prompt(entryList).then((answer) => {
    if (answer.entry_list === 'EXIT') {
      exitHandler();
    } else if (answer.entry_list === 'START MENU') {
      startMenu();
    } else {
      const entry = entries.filter(
        (obj) => obj._id === answer.entry_list.split(' ').pop()
      );
      displayEntry(entry);
    }
  });
}

// ----- SIGNS USER OUT BY DELETING JWT FILE

function signOut(message) {
  fs.unlink('jwt.txt', function (err) {
    if (err) throw err;
    if (message) console.log('Invalid Token');
    exitHandler('You have signed out');
  });
}

// ----- SIGN UP PROMPT

function signUp(currentUser) {
  headerHandler();

  console.log(chalk.keyword(themeColor)(`-------- ${currentUser ? 'SIGN IN' : 'SIGN UP'} ---------\n`));
  inquirer
    .prompt(signUpPrompts)
    //TODO: dont always call the oauth functionality. only if they select oauth.
    .then((answer) => signUpOauth(answer.oauth))
    .then((credentials) => {
      credentials.currentUser = currentUser
      getEmail(credentials);
    })
    .catch((err) => {
      console.error('------Oauth handshake process failed!------');
      greetingMenu();
    });
}



async function getEmail(credentials) {
  if (!credentials.email && !credentials.currentUser) {
    headerHandler();
    console.log(chalk.keyword(themeColor)('--------- Email ----------\n'));
    const answer = await inquirer.prompt(emailPrompt);
    credentials.email = answer.email;
  }
  const exchangeState = await exchangeToken(credentials);
  if(exchangeState) {
    startMenu('Welcome new user!')
  } else {
    greetingMenu('User doesn\'t exist. Please sign up.')
  }
}


// ----- ----- Renders List

function listJournals(journals) {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ SELECT JOURNAL ------\n'));
  inquirer.prompt(journalList).then((answer) => {
    if (answer.name_journal === 'EXIT') {
      exitHandler();
    } else if (answer.name_journal === 'START MENU') {
      startMenu();
    } else {
      const journal = journals.find((obj) => obj.name === answer.name_journal);
      journalOptions(journal);
    }
  });
}
// CREATE

function createEntry() {
  headerHandler();
  console.log(chalk.keyword(themeColor)('------ CREATE ENTRY ------\n'));
  inquirer.prompt(createPrompt).then((answer) =>
    postApi({
      category: answer.create_category_prompt,
      text: answer.create_text_prompt,
    })
  );
}

// PROMPTS USER TO CREATE A NEW JOURNAL
function createJournal() {
  inquirer
    .prompt(createJournalPrompt)
    .then((answer) => saveJournalApi(answer.new_journal))
    .catch((err) => console.error(err));
}

// ----- PICK A WAY TO FILTER DISPLAY OF ENTRIES: ALL, CATEGORY, DATE, CATEGORY & DATE

function headerHandler() {
  console.clear()
  clijBannerHandler()
}

function clijBannerHandler() {
  console.log(chalk.keyword(themeColor)('\n ___   _      _   _______'));
  console.log(chalk.keyword(themeColor)('/ __| | |    |_| |___   _|'));
  console.log(chalk.keyword(themeColor)('| |   | |     _   _  | |'));
  console.log(chalk.keyword(themeColor)('| |_  | |__  | | | |_| |'));
  console.log(chalk.keyword(themeColor)('\\___| |____| |_| \\_____/\n'));
}

module.exports = {
  startMenu,
  greetingMenu,
};
