import {saltHashPassword} from '../services/cryptoService';
import {stringify} from "querystring";
import * as dbService from '../services/dbService'
import {KeyRing, IKeyRing} from "./KeyRing";

import {logFactory} from "../config/ConfigLog4J";
import {UserDocument} from '../database/schemes';

const log = logFactory.getLogger('.User.ts');

export class User implements IUser {

    public password: string;

    // better would be to stor the keyrings as ids -> otherwise why the hell do we need KeyRing object and table?:
    constructor(public id: string, public username: string, password: string, public email: string, public keyrings: KeyRing[], fromdb?: boolean) {
        if (fromdb == false) {
            this.password = saltHashPassword(password, username);
        } else {
            this.password = password;
        }
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
            return dbService.addExistingKeyRing(this.id, ring);
        } else {
            return dbService.addNewKeyRing(this.id, ring);
        }
    }

    getKeyEntityById(entId: string) {
        return this.keyrings.find(ring => {
            return ring.getKeyEntity(entId) != null;
        });
    }

    public static getFromDocuments(userDocs: UserDocument[]): User[] {
        let users = new Array(userDocs.length);
        for (let i = 0; i < userDocs.length; i++) {
            let userDoc = userDocs[i];
            users[i] = User.getFromDocument(userDoc);
        }
        return users;
    }

    public static getFromDocument(userDoc: UserDocument): User {
        return new User(userDoc.id, userDoc.username, userDoc.password, userDoc.email, KeyRing.getFromDocuments(userDoc.keyrings), true);
    }
}

export interface IUser {
    id: string,
    username: string,
    email: string,
    password: string,
    keyrings: IKeyRing[]
}