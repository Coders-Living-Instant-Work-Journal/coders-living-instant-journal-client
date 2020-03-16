
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const fs = require('file-system')
const superagent = require('superagent');
let jwt;
const api_server_uri = 'http://localhost:3000';
jest.mock('inquirer')

const { greetingMenu, signUp, signOut, startMenu, createEntry, selectFilter, filterCategoryDate, selectCategory, filterDate, getEntries, entryPromptConstructor, listEntries, displayEntry, updateEntry, deleteEntry, postAPI, putAPI, signUpApi, storeToken, signIn, dateHandler, exitHandler } = require('../../lib/input')
const { greeting, signUpPrompts, signInPrompts } = require('../../lib/prompts')


// CRUD
xdescribe('CRUD', () => {
  describe('Create', () => {
    describe('Journals set up module', () => {
      it('passes journal creation to the API', () => {
        // expect properly formatted post
      });
      it('checks for journals in the API', () => {
        // expect properly formatted get
      });
    });
    describe('Entry creation module', () => {
      it('creates a properly formed entry', () => {

      });
      it('passes the entry to the the API', () => {

      });
    });
  });
  describe('Read', () => {
    describe('Sort by filter module', () => {
      it('should properly sort the entries', () => {

      });
    });
    describe('should render the entry properly', () => {

    });
  });
  describe('Update', () => {
    describe('updateEntry()', () => {
      it('properly forms the new entry object', () => {

      });
    });
    describe('putApi()', () => {
      it('mocks the object being sent to the API', () => {

      });
    });
  });
  describe('Delete', () => {
    describe('deleteEntry()', () => {
      it('mocks the route to the API for a specific ID of an entry', () => {

      });
    });
  });
});
