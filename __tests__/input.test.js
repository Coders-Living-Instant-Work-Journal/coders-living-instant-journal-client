const inquirer = require('inquirer')
jest.mock('inquirer')

const { greetingMenu, signUp } = require('../lib/input')
const { greeting, signUpPrompts, signInPrompts } = require('../lib/prompts')

describe('greetingMenu module', () => {
  describe('signUp()', () => {
    it('mocks the function call properly', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({ abc: 'def' })
      await expect(inquirer.prompt()).resolves.toEqual({ abc: 'def' });
    });
    it('Properly hashes password before sending to API', async () => {
      mockInput = {
        new_user_email: 'k@f.com',
        new_user_name: 'an dn',
        new_user_password: 'password'
      }
      inquirer.prompt = jest.fin().mockResolvedValue(mockInput)
      await expect(inquirer.prompt()).resolves
    })
  });
  describe('signIn()', () => {
    it('', () => {
      
    });
    
  });
  
});
