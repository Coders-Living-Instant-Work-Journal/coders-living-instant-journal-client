const inquirer = require('inquirer')
jest.mock('inquirer')

const { greetingMenu, signUp } = require('../lib/input')
const { greeting, signUpPrompts, signInPrompts } = require('../lib/prompts')

describe('signUp() module', () => {
  describe('Register a new user', () => {
    it('passes a new user to the API', () => {
      // expect a mock send in the right format
    });
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
  
});


// describe('greetingMenu module', () => {
//   describe('signUp()', () => {
//     it('mocks the function call properly', async () => {
//       inquirer.prompt = jest.fn().mockResolvedValue({ abc: 'def' })
//       await expect(inquirer.prompt()).resolves.toEqual({ abc: 'def' });
//     });
//     it('Properly hashes password before sending to API', async () => {
//       mockInput = {
//         new_user_email: 'k@f.com',
//         new_user_name: 'andn',
//         new_user_password: 'password'
//       }
//       inquirer.prompt = jest.fin().mockResolvedValue(mockInput)
//       await expect(inquirer.prompt()).resolves
//     })
//   });
// });
