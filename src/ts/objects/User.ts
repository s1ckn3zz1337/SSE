import {saltHashPassword} from '../services/cryptoService';
import {stringify} from "querystring";
import {IUser} from "./Model"
import * as dbService from '../services/dbService'

import {logFactory} from "../config/ConfigLog4J";

const log = logFactory.getLogger('.User.ts');

export class User implements IUser {

    public password: string;

    constructor(public id: string, public username: string, password: string) {
        this.password = saltHashPassword(password, username);
    }

    register() {
        return new Promise((resolve, reject) => {
            const registeredUser = dbService.registerUser(this).then(response => {
                if(response.hasOwnProperty('id')){
                }
                this.id = response.hasOwnProperty()
            });
            if (registeredUser) {
                this.id = registeredUser.getPropertyValue('id');
                log.debug(`created User with the ID: ${this.id}`);
                return resolve(this);
            }
            log.error('Could not register...');
            return reject('did not work');
        });

    }


    login() {

    }

    checkCredentials() {
        // do some logic here, aka prepare data
    }
}