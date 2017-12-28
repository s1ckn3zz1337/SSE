import { saltHashPassword } from '../services/cryptoService';
import { stringify } from "querystring";
import { IUser } from "./Model"

export class User implements IUser {

    public password: string;

    constructor(public id: string, public username: string, password: string) {
        this.password = saltHashPassword(password, username);
    }

    register() {
        return new Promise((resolve, reject) => {
            // todo add registration flow here
        });
    }

    login() {

    }

    checkCredentials() {
        // do some logic here, aka prepare data
    }
}