// import credentials from config
import {Env} from "../config/config";
import {logFactory} from "../config/ConfigLog4J";
import {Logger} from "typescript-logging";
import * as scheme from '../database/schemes';
import {error} from "util";
import * as mongoose from "mongoose";
import {MongoError} from "mongodb";
import {User} from "../objects/User";
import {KeyRing} from "../objects/Keyring";
import {KeyEntity} from "../objects/Model";
import {runInNewContext} from "vm";

const log = logFactory.getLogger(".dbService.ts");

const initDBConnection = () => {
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


const getUser = (username: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        scheme.User.find({'username': username}).then(response => {
            if (response && response.length > 0) {
                const user = new User(response[0]._id, response[0].username, response[0].password);
                return resolve(user); // return first elem as this should be the matched user
            }
            log.error(`Could not find user with the username ${username}`);
            return reject(new Error('could not find matching user'));
        }).catch(err => {
            log.error(JSON.stringify(err));
            return reject(err);
        });
    });
};

const registerUser = (data: User) :Promise<User> => {
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

const deleteUser = (data: User) => {
    scheme.User.findByIdAndRemove(data.id).then(res => {
        return true;
    }).catch(err => {
        log.error('Error while removing User' + err);
    });

};

const deleteKeyRing = (data: KeyRing) => {
    scheme.KeyRing.findByIdAndRemove(data.schemaId).then(res => {
        return true;
    }).catch(err => {
        log.error('Error while removing KeyRing' + err);
    });
};

const deleteKeyEntity = (data: KeyEntity) => {
    scheme.KeyEntity.findByIdAndRemove(data.keyId).then(res => {
        return true
    }).catch(err => {
        log.error(`Error while removing KeyEntity ${err}`);
        return null;
    });
};

export {getUser, registerUser, deleteUser, deleteKeyEntity, deleteKeyRing, initDBConnection};