import {saltHashPassword} from '../services/cryptoService';
import {stringify} from "querystring";
import {IUser, KeyRing} from "./Model"
import * as dbService from '../services/dbService'

import {logFactory} from "../config/ConfigLog4J";

const log = logFactory.getLogger('.User.ts');

export class User implements IUser {

    public password: string;
    // better would be to stor the keyrings as ids -> otherwise why the hell do we need KeyRing object and table?:
    constructor(public id: string, public username: string, password: string, public email: string, public keyrings: KeyRing[], private fromdb?:boolean) {
        if(this.fromdb == false){
            this.password = saltHashPassword(password, username);
        }else{
            this.password = password;
        }
        this.fromdb = undefined;
    }

    register() {
        return new Promise<User>((resolve, reject) => {
            dbService.registerUser(this).then(response => {
                this.id = response.id;
                return resolve(this);
            }).catch(err => {
                return reject(err);
            });
        });

    }


    login() {
        return new Promise<User>((resolve, reject) => {
            dbService.getUserByName(this.username).then(response => {
                if (this._checkCredentials(response.password)) {
                    this.id = response.id;
                    this.keyrings = response.keyrings;
                    this.password = undefined;
                    return resolve(this);
                }
                log.error(`${this.username} passwords did not match`);
                // expose the id of the user object
                return reject(new Error(`password for user with id: ${response.id}, username: ${this.username} did not match`));
            }).catch(err => {
                log.error(`${this.username} wrong login: ${JSON.stringify(err)}`);
                return reject(new Error('internal server error, propably did not find user'));
            })
        });
    }

    _checkCredentials(password: string) {
        return password === this.password
        // do some logic here, aka prepare data
    }

    addKeyRing(ring: KeyRing): Promise<KeyRing> {
        if (ring.id) {
            return dbService.addExistingKeyRing(this, ring);
        } else {
            return dbService.addNewKeyRing(this, ring);
        }
    }
}