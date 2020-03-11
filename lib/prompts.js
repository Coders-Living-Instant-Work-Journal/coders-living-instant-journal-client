
const inquirer = require('inquirer');
// import password from '@inquirer/password';

const gap = new inquirer.Separator();

// QUESTIONS

const greeting = [
  {
    type: 'list',
    name: 'signup_or_in',
    message: "What would you like to do?",
    choices: ['SIGN UP', gap, 'SIGN IN', gap, 'EXIT', gap]
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

const categoryDatePrompt = [
  {
    type: 'input',
    name: 'category_prompt',
    message: "Please enter an existing category."
  },
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
    choices: ['UPDATE ENTRY', gap, 'DELETE ENTRY' , gap, 'START MENU' , gap, 'EXIT' , gap]
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
    choices: ['DISPLAY ALL', gap, 'CATEGORY', gap, 'DATE', gap, 'CATEGORY AND DATE', gap, 'JOURNAL', gap, 'EXIT', gap]
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
        /^[A-z ,.'-]+$/i
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
        /^[A-z0-9_.-]*@[A-z0-9_.-]+\.(net|com|org)$/i
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
    choices: ['CREATE ENTRY', gap, 'LIST ENTRIES', gap, 'EDIT ENTRY', gap, 'DELETE ENTRY', gap, 'SIGN OUT', gap, 'EXIT', gap]
  }
]

module.exports = { greeting, signUpPrompts, signInPrompts, crudPrompts, entryFilter, datePrompt, entryList, updateDelete, updatePrompt, categoryPrompt, createPrompt, categoryDatePrompt, gap }
