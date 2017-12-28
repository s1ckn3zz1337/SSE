import * as crypto from 'crypto';
import * as NodeRSA from "node-rsa";

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

export function saltHashPassword(userpassword: string, username: string) {
    const salt = username; /** use username as salt for the hash */
    return sha512(userpassword, username);
}

/** https://www.npmjs.com/package/node-rsa */
export function generateNewRSAKey(bits: number): NodeRSA {
    let key = new NodeRSA();
    key.generateKeyPair(bits);
    return key;
}

export function exportPublicKeyFromNodeRSA(key: NodeRSA) {
    return key.exportKey("pkcs8-public-pem");
}

export function exportPrivateKeyFromNodeRSA(key: NodeRSA) {
    return key.exportKey("pkcs8-private-pem");
}

export function getExportedKey(key: NodeRSA) {
    return {
        public: exportPublicKeyFromNodeRSA(key).toString(),
        private: exportPrivateKeyFromNodeRSA(key).toString()
    }
}

