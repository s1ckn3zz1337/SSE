import {User} from '../../../objects/User';
import * as crypto from '../../../services/cryptoService'
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

const DEFAULT_USERNAME = 'username';
const DEFAULT_PASSWORD = 'password';
describe('Test User Class', () => {
    it('Should hash the clear text password on object creation', () => {
        const newUser = new User("null", DEFAULT_USERNAME, DEFAULT_PASSWORD, "email", []);
        const pwdHash = crypto.saltHashPassword(DEFAULT_PASSWORD, DEFAULT_USERNAME);
        expect(pwdHash).to.equal(newUser.password);
    });
});