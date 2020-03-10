
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
const createPrompt = [
  {
    type: 'input',
    name: 'create_category_prompt',
    message: "Please enter a category."
  },
  {
    type: 'input',
    name: 'create_text_prompt',
    message: "Type your new entry here."
  }
]

const categoryPrompt = [
  {
    type: 'input',
    name: 'category_prompt',
    message: "Please enter an existing category."
  }
]

const updateDelete = [
  {
    type: 'list',
    name: 'update_delete',
    message: "What would you like to do?",
    choices: ['UPDATE ENTRY', new inquirer.Separator(), 'DELETE ENTRY' , new inquirer.Separator(), 'START MENU' , new inquirer.Separator(), 'EXIT' , new inquirer.Separator()]
  }
]

const updatePrompt = [
  {
    type: 'input',
    name: 'update_category',
    message: 'Please type in your updated category',
    default: ''
  },
  {
    type: 'input',
    name: 'update_entry',
    message: "Please type in your updated entry",
    default: ''
  }
]

const entryFilter = [
  {
    type: 'list',
    name: 'entry_filters',
    message: "How would you like to filter your entries?",
    choices: ['DISPLAY ALL', new inquirer.Separator(), 'CATEGORIES', new inquirer.Separator(), 'DATE', new inquirer.Separator(), 'JOURNAL', new inquirer.Separator(), 'EXIT']
  }
]

const entryList = [
  {
    type: 'list',
    name: 'entry_list',
    message: "Which entry would you like to view/edit?",
    choices: []
  }
]

const datePrompt = [
  {
    type: 'input',
    name: 'day_selector',
    message: "Please select how many days ago you would like to see entries from.",
    validate: function (value) {
      if(/[0-5][0-9]|[0-9]/.test(value)) return true;
      return 'Please enter a number.'
    }
  }
]

const signUpPrompts = [
  {
    type: 'input',
    name: 'new_user_email',
    message: "Please enter your email address.",
    validate: function (value) {
      var pass = value.match(
        /^[A-z0-9_.-]*@[A-z0-9_.-]+\.(net|com|org)$/i
      );
      if (pass) return true;
      return 'Please enter a valid email address.';
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
    message: "Please enter a password."
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

const crudPrompts = [
  {
    type: 'list',
    name: 'crud',
    message: "What would you like to do?",
    choices: ['CREATE ENTRY', new inquirer.Separator(), 'LIST ENTRIES', new inquirer.Separator(), 'EDIT ENTRY', new inquirer.Separator(), 'DELETE ENTRY', new inquirer.Separator(), 'EXIT', new inquirer.Separator()]
  }
]

module.exports = { greeting, signUpPrompts, signInPrompts, crudPrompts, entryFilter, datePrompt, entryList, updateDelete, updatePrompt, categoryPrompt, createPrompt }
