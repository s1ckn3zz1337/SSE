import * as crypto from 'crypto';
import {logFactory} from "../config/ConfigLog4J";
const log = logFactory.getLogger('.cryptoService.ts');
/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function (password: string, salt: string) {
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

export function saltHashPassword(userpassword: string, username: string){
    log.info('name: ' + username + ' password: ' + userpassword);
    const sha513 = sha512(userpassword, username);
    return sha513;
}

