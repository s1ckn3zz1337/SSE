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
           dbService.registerUser(this).then(response => {
                this.id = response.id;
                return resolve(this);
            }).catch(err =>{
                   return reject(err);
           });
        });

    }


    login() {

    }

    checkCredentials() {
        // do some logic here, aka prepare data
    }
}