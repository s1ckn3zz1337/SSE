import { saltHashPassword } from '../services/cryptoService';
import { stringify } from "querystring";

export class User {

    public password: string;

    constructor(public id: string, public username: string, password: string) {
        this.password = saltHashPassword(password, username)
    }

    register() {
    }

    login() {
    }

    checkCredentials() {
        // do some logic here, aka prepare data
    }
}