import {saltHashPassword} from '../services/cryptoService';
import {stringify} from "querystring";
export class User {
    constructor(public id: string, public username: string, public password: string) {
        this.id = id;
        this.username = username;
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