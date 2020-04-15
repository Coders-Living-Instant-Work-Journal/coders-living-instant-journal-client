
const inquirer = require('inquirer')
jest.mock('inquirer')

const { greetingMenu, signUp } = require('../lib/input')
const { greeting, signUpPrompts, signInPrompts } = require('../lib/prompts')

// USER
describe('signUp() module', () => {
  describe('Register a new user', () => {
    it('passes a new user to the API', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({ abc: 'def' })
      await expect(inquirer.prompt()).resolves.toEqual({ abc: 'def' });
    });
    it('Properly hashes password before sending to API', async () => {
      mockInput = {
        new_user_email: 'g@g.com',
        new_user_name: 'g unit',
        new_user_password: 'g2345'
      }
      inquirer.prompt = jest.fin().mockResolvedValue(mockInput)
      await expect(inquirer.prompt()).resolves
    })
    it('will reject an pre-existing email', () => {

    });
    it('stores id.txt and jwt.txt', () => {
      // is this test needed
    });
  });
});
describe('signIn() module', () => {
  describe('Sign into account for returning user', () => {
    it('passes sign in data to the API', () => {
      // expect a mock send in the right format
    });
    it('will receive existing entries that match the user ID', () => {

    });
  });
});
describe('Journals', () => {
  describe('', () => {

  });
});

// CRUD
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
