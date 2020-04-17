const { greetingMenu, signUp, signOut, startMenu, createEntry, selectFilter, filterCategoryDate, selectCategory, filterDate, getEntries, entryPromptConstructor, listEntries, displayEntry, updateEntry, deleteEntry, postAPI, putAPI, signUpApi, storeToken, signIn, dateHandler, exitHandler } = require('../../lib/input')
const base64 = require('base-64')
const bcrypt = require('bcrypt')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('file-system')
const superagent = require('superagent')
let jwt
const api_server_uri = 'http://localhost:3000'
jest.mock('inquirer')

describe('Input module', () => {
  describe('signIn()', () => {

  })
  describe('signOut()', () => {

  })
})
