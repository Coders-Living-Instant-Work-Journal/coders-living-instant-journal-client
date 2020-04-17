
const inquirer = require('inquirer')
// import password from '@inquirer/password';

const gap = new inquirer.Separator()

// QUESTIONS

const greeting = [
  {
    type: 'list',
    name: 'signup_or_in',
    message: 'What would you like to do?',
    choices: ['SIGN UP', gap, 'SIGN IN', gap, 'EXIT', gap]
  }
]
const createPrompt = [
  {
    type: 'input',
    name: 'create_category_prompt',
    message: 'Please enter a category.'
  },
  {
    type: 'input',
    name: 'create_text_prompt',
    message: 'Type your new entry here.'
  }
]

const categoryDatePrompt = [
  {
    type: 'input',
    name: 'category_prompt',
    message: 'Please enter an existing category.'
  },
  {
    type: 'input',
    name: 'day_selector',
    message: 'Please select how many days ago you would like to see entries from.',
    validate: function (value) {
      if (/[0-5][0-9]|[0-9]/.test(value)) return true
      return 'Please enter a number.'
    }
  }
]

const categoryPrompt = [
  {
    type: 'input',
    name: 'category_prompt',
    message: 'Please enter an existing category.'
  }
]

const updateDelete = [
  {
    type: 'list',
    name: 'update_delete',
    message: 'What would you like to do?',
    choices: ['UPDATE ENTRY', gap, 'DELETE ENTRY', gap, 'START MENU', gap, 'EXIT', gap]
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
    message: 'Please type in your updated entry',
    default: ''
  }
]

const entryFilter = [
  {
    type: 'list',
    name: 'entry_filters',
    message: 'How would you like to filter your entries?',
    choices: ['DISPLAY ALL', gap, 'CATEGORY', gap, 'DATE', gap, 'CATEGORY AND DATE', gap, 'EXIT', gap]
  }
]

const journalList = [
  {
    type: 'list',
    name: 'name_journal',
    message: 'Which journal would you like to change to.',
    choices: []
  }
]

const entryList = [
  {
    type: 'list',
    name: 'entry_list',
    message: 'Which entry would you like to view/edit?',
    choices: []
  }
]

const datePrompt = [
  {
    type: 'input',
    name: 'day_selector',
    message: 'Please select how many days ago you would like to see entries from.',
    validate: function (value) {
      if (/[0-5][0-9]|[0-9]/.test(value)) return true
      return 'Please enter a number.'
    }
  }
]

const journalPrompts = [
  {
    type: 'list',
    name: 'journal_options',
    message: 'What would you like to do?',
    choices: ['CHANGE JOURNAL NAME', gap, 'MAKE DEFAULT', gap, 'SEND EMAIL NOW', gap, 'DELETE JOURNAL', gap, 'EXIT', gap]
  }
]

const signUpPrompts = [
  {
    type: 'list',
    name: 'oauth',
    message: 'Choose who to sign-up with.',
    choices: ['GITHUB', gap, 'EXIT', gap]
  }
]

const confirmOauth = [
  {
    type: 'list',
    name: 'oauth',
    message: 'Press enter after you have authorized in browser.',
    choices: ['ENTER']
  }
]

const createJournalPrompt = [
  {
    type: 'imput',
    name: 'new_journal',
    message: 'Give your new journal a name!'
  }
]

const crudPrompts = [
  {
    type: 'list',
    name: 'crud',
    message: 'What would you like to do?',
    choices: ['CREATE ENTRY', gap, 'CREATE JOURNAL', gap, 'LIST ENTRIES', gap, 'LIST JOURNALS', gap, 'EMAIL SETTINGS', gap, 'SIGN OUT', gap, 'EXIT', gap]
  }
]

const updateJournalPrompt = [
  {
    type: 'input',
    name: 'update_journal',
    message: 'Give your journal a new name!'
  }
]

const emailPrompt = [
  {
    type: 'input',
    name: 'email',
    message: 'Your external account does not have an email attached to it. Please enter an email!',
    validate: function (value) {
      var pass = value.match(
        /^[A-z0-9_.-]*@[A-z0-9_.-]+\.(net|com|org)$/i
      )
      if (pass) return true
      return 'Please enter a valid email address.'
    }
  }
]

const emailCrudPrompts = [
  {
    type: 'list',
    name: 'email_crud',
    message: 'What would you like to do?',
    choices: ['CREATE EMAIL PROFILE', gap, 'VIEW EMAIL PROFILES', gap, 'START MENU', gap, 'EXIT', gap]
  }
]

const createEmailProfilePrompt = [
  {
    type: 'input',
    name: 'create_profile',
    message: 'Type profile name here.'
  },
  //will need logic to map out name to journal ID 
    {
    type: 'input',
    name: 'profile_journal',
    message: 'Which journal would you like to add?'
  },  
  {
    type: 'input',
    name: 'profile_category',
    message: 'Which category which you like to include?'
  },
  {
    type: 'input',
    name: 'profile_email',
    message: 'What email would you like these notes sent to?'
  },
  {
    //HOW TO WE WANT TO PROVIDE OPTIONS? list with options? expects number  
    type: 'input',
    name: 'profile_frequency',
    message: 'How often would you like these sent?'
  },
  {
    //how do we want to format this, expects number?? 
    type: 'input',
    name: 'profile_time',
    message: 'What time of day would you like these emails sent?'
  },
  {
    //logic taken from date prompt
    type: 'input',
    name: 'profile_range',
    message: 'Please select how many days of entries you\'d like included.',
    validate: function (value) {
      if (/[0-5][0-9]|[0-9]/.test(value)) return true
      return 'Please enter a number.'
    }
  }
]

const updateEmailProfilePrompt = [
  {
    type: 'input',
    name: 'update_profile',
    message: 'Which profile would you like to update?'
  },
  //will need logic to map out name to journal ID 
  {
    type: 'input',
    name: 'update_profile_journal',
    message: 'Which journal would you like to update?'
  },
  {
    type: 'input',
    name: 'update_profile_category',
    message: 'Which category which you like to update?'
  },
  {
    type: 'input',
    name: 'update_profile_email',
    message: 'What email would you like these notes sent to?'
  },
  {
    //HOW TO WE WANT TO PROVIDE OPTIONS? list with options? expects number  
    type: 'input',
    name: 'update_profile_frequency',
    message: 'How often would you like these sent?'
  },
  {
    //how do we want to format this, expects number?? 
    type: 'input',
    name: 'update_profile_time',
    message: 'What time of day would you like these emails sent?'
  },
  {
    //logic taken from date prompt
    type: 'input',
    name: 'update_profile_range',
    message: 'Please select how many days of entries you\'d like included.',
    validate: function (value) {
      if (/[0-5][0-9]|[0-9]/.test(value)) return true
      return 'Please enter a number.'
    }
  }
]
const viewEmailProfilesPrompt = [
  {
    type: 'list',
    name: 'view_profile',
    message: 'Which profile would you like to view?',
    choices: []

  }
]

const emailProfileOptionsPrompt = [
  {
    type: 'list',
    name: 'profile_options',
    message: 'What would you like to do?',
    choices: ['UPDATE PROFILE', gap, 'DELETE PROFILE', gap, 'START MENU', gap, 'EXIT']
  }
]

const deleteEmailProfilePrompt = [
  {
    type: 'list',
    name: 'delete_profile',
    message: 'Which email profile would you like to delete?',
    choices: []
  }
]

const sendEmailNowPrompt = [
  {
    type: 'input',
    name: 'email',
    message: 'Email to send to?'
  },
  {
    type: 'input',
    name: 'category',
    message: 'Which category to send?'
  },
  {
    type: 'input',
    name: 'daysBack',
    message: 'How many days back?',
    validate: function (value) {
      if (/[0-9][0-9]|[0-9]/.test(value)) return true
      return 'Please enter a number.'
    }
  },
]


module.exports = { greeting, confirmOauth, signUpPrompts, crudPrompts, entryFilter, datePrompt, entryList, updateDelete, updatePrompt, categoryPrompt, createPrompt, categoryDatePrompt, gap, journalList, createJournalPrompt, journalPrompts, updateJournalPrompt, emailPrompt, emailCrudPrompts, createEmailProfilePrompt, viewEmailProfilesPrompt, updateEmailProfilePrompt, deleteEmailProfilePrompt, emailProfileOptionsPrompt, sendEmailNowPrompt}
