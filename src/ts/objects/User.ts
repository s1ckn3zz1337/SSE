import {saltHashPassword} from '../services/cryptoService';
import {stringify} from "querystring";
export class User {
    constructor(public id: string, public username: string, public password: string) {
        this.password = saltHashPassword(password, username)
    }

    register() {
        return new Promise((resolve, reject)=>{
            // todo add registration flow here
        });
    }

    login() {

    }

    checkCredentials() {
        // do some logic here, aka prepare data
    }
}