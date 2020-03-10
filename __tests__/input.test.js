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
  });
  xdescribe('signIn()', () => {
    it('', () => {
      
    });
    
  });
  
});
