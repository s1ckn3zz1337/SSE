import * as crypto from 'crypto'

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password:string, salt:string){
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

export function saltHashPassword(userpassword:string, username:string){
    const salt = username; /** use username as salt for the hash */
    return sha512(userpassword, username);
}