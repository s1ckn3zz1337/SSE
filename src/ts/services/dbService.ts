// import credentials from config
import {Env} from "../config/config";
import {logFactory} from "../config/ConfigLog4J";
import {Logger} from "typescript-logging";
import * as scheme from '../database/schemes';
import {error} from "util";
import * as mongoose from "mongoose";
import {MongoError} from "mongodb";
import {User} from "../objects/User";
import {KeyRing} from "../objects/KeyRing";
import {KeyEntity} from "../objects/Model";
import {runInNewContext} from "vm";
import {KeyRingDocument} from "../database/schemes";

const log = logFactory.getLogger(".dbService.ts");

export function initDBConnection() {
    mongoose.connect('mongodb://' +
        Env.mongoDB.user + ':' +
        Env.mongoDB.password + '@' +
        Env.mongoDB.host + ':' +
        Env.mongoDB.port + '/' +
        Env.mongoDB.database, {
            useMongoClient: true
        }, function (err: MongoError) {
            if (err) log.error('Error while creating mongoose connection' + err);
            else {
                log.info('MongoDB connected!');
            }
        }
    );
};

export function getUser(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
        scheme.User.find({'username': username}).then(response => {
            if (response && response.length > 0) {
                return resolve(new User(response[0]._id, response[0].username, response[0].password, response[0].email, response[0].keyrings)); // return first elem as this should be the matched user
            } else {
                log.error(`Could not find user with the username ${username}`);
                return reject(new Error('could not find matching user'));
            }
        }).catch(err => {
            log.error(JSON.stringify(err));
            return reject(err);
        });
    });
};

export function registerUser(data: User): Promise<User> {
    const newUser = new scheme.User({
        username: data.username,
        password: data.password,
    });

    return new Promise((resolve, reject) => {
        scheme.User.find({'username': data.username}).then(response => {
            if (response && response.length > 0) {
                log.error('Failed creating User - already exists');
                return reject('User already exists');
            }
            newUser.save().then(response => {
                data.id = response.id;
                return resolve(data);
            });
        }).catch(err => {
            log.error(`Could not create user, something went wrong :( ${JSON.stringify(err)}`);
            return reject(err);
        });
    });
};

export function deleteUser(data: User) {
    scheme.User.findByIdAndRemove(data.id).then(res => {
        return true;
    }).catch(err => {
        log.error('Error while removing User' + err);
    });

};

export function getKeyRing(id: string) {
    return new Promise<KeyRing>((resolve, reject) => {
        scheme.KeyRing.findById(id, (err: any, res: scheme.KeyRingDocument) => {
            if (err) {
                return reject(err);
            } else if (!res) {
                return reject("No KeyRing found");
            } else {
                return resolve(KeyRing.getFromDocument([res])[0]);
            }
        });
    });
}

/** TODO keyRing and key should probably both have a name and a description? */
export function createNewKeyRing(data: KeyRing): Promise<KeyRing> {
    const newKeyRing = new scheme.KeyRing({
        description: data.description,
        keyEntites: data.keyEntites
    });

    return new Promise((resolve, reject) => {
        newKeyRing.save().then(resolved => {
            data.id = resolved.id;
            resolve(data);
        }, rejected => {
            reject(rejected);
        });
    });
}

export function addExistingKeyRing(user: User, data: KeyRing): Promise<KeyRing> {
    return new Promise<KeyRing>((resolved, rejected) => {
        scheme.User.findByIdAndUpdate({'_id': user.id}, {$push: {keyrings: data}}, {"new": true}, (err, result) => {
            if (result) {
                return resolved(data);
            } else {
                log.info("Could not update keyRing of user " + err);
                return rejected(err);
            }
        });
    });
}

export function addNewKeyRing(user: User, data: KeyRing): Promise<KeyRing> {
    return new Promise<KeyRing>((resolved, rejected) => {
        createNewKeyRing(data).then(fulfilled => {
            addExistingKeyRing(user, fulfilled).then(resolve => {
                resolved(resolve);
            }, reject => {
                rejected(reject);
            });
        }, reject => {
            log.info("Could not create new keyRing to update " + reject);
            rejected(undefined);
        });
    });
};

export function deleteKeyRing(data: KeyRing) {
    return new Promise((resolve, reject) => {
        scheme.KeyRing.findByIdAndRemove(data.id, (err, res) => {
            if (res) {
                return resolve(res);
            } else {
                return reject(err);
            }
        });
    });
};

export function addKeyEntity(keyRing: KeyRing, keyEntity: KeyEntity) {
    const newKeyEntity = new scheme.KeyEntity({
        keyName: keyEntity.keyName,
        keyEncryptedPassword: keyEntity.keyEncryptedPassword,
        keyDescription: keyEntity.keyDescription,
        keyURL: keyEntity.keyURL
    });
    return new Promise((resolve, reject) => {
        scheme.KeyRing.update({'_id': keyRing.id}, {$push: {keyEntites: newKeyEntity}}, {
            safe: true,
            multi: true
        }).then(res => {
            log.info('KeyEntity created ' + newKeyEntity.keyName);
            return resolve(true);
        }).catch(err => {
            log.error('Failed creating new KeyEntity ' + newKeyEntity.keyName);
            return reject(err);
        });
    });
};

export function deleteKeyEntity(data: KeyEntity) {
    return new Promise((resolve, reject) => {
        scheme.KeyEntity.findByIdAndRemove(data.id).then(res => {
            return resolve(true);
        }, err => {
            log.error("Error while removing KeyEntity " + err.toString());
            return reject(err);
        });
    });
};