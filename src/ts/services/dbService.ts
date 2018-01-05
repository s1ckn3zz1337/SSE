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
import {KeyEntityDocument, KeyRingDocument} from "../database/schemes";
import {reporter} from "gulp-typescript";

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
            if (err)
                log.error('Error while creating mongoose connection' + err);
            else
                log.info('MongoDB connected!');
        }
    );
};

export function getUserById(userid: string): Promise<User> {
    // todo why do we need a KeyRing sheme in the db, if we are storing everything in the User object? 
    return scheme.User.findById(userid).populate({path: "keyrings", populate: {path: "keyEntities", model: "KeyEntity"}}).exec()
        .then(result => User.getFromDocument(result))
        .catch(reject => {
            log.error(JSON.stringify(reject));
            return reject;
        });
}

export function getUserByName(username: string): Promise<User> {
    return scheme.User.find({'username': username})
        .then(response => User.getFromDocuments(response)[0])
        .catch(err => {
            log.error(JSON.stringify(err));
            return err;
        });
};

export function registerUser(data: User): Promise<User> {
    const newUser = new scheme.User({
        username: data.username,
        email: data.email,
        password: data.password,
    });

    return scheme.User.findOne({'username': data.username})
        .then(response => {
            if (response) {
                return Promise.reject('User already exists');
            } else {
                return newUser.save().then(response => {
                    log.info("Saved user");
                    data.id = response.id;
                    log.info(JSON.stringify(response));
                    return data;
                });
            }
        }).catch(err => {
            log.error(`Could not create user: ${JSON.stringify(err)}`);
            return err;
        });
};

export function deleteUser(key: string) {
    return scheme.User.findByIdAndRemove(key);
}

function resetAll() {
    scheme.KeyRing.remove({}, () => {console.log("ring")});
    scheme.User.remove({}, () => {console.log("user")});
    scheme.KeyEntity.remove({}, () => {console.log("entity")});
    console.log("Deleted all");
}

//(()=> resetAll())();

export function getKeyRingById(id: string): Promise<KeyRing> {
    return scheme.KeyRing.findOne({_id: id}).populate("keyEntities").exec()
        .then(resolve => KeyRing.getFromDocument(resolve));
}

/** TODO keyRing and key should probably both have a name and a description? */
function createNewKeyRing(data: KeyRing): Promise<KeyRingDocument> {
    const newKeyRing = new scheme.KeyRing({
        name: data.name,
        description: data.description,
        publicKey: data.publicKey
    });
    return newKeyRing.save();
}

export function addExistingKeyRing(userId: string, data: KeyRing): Promise<KeyRing> {
    log.info("Adding ring: " + data.name + " to user: " + userId);
    return scheme.User.findByIdAndUpdate({'_id': userId}, {$push: {keyrings: data.id}}, {"new": true})
        .then(resolve => data);
}

export function addNewKeyRing(userId: string, data: KeyRing): Promise<KeyRing> {
    return createNewKeyRing(data)
        .then((onfullfil) => {
            data.id = onfullfil.id;
            return addExistingKeyRing(userId, data);
        });
};

export function deleteKeyRing(data: KeyRing) {
    return scheme.KeyRing.findByIdAndRemove(data.id);
};

function createNewKeyEntity(keyEntity: KeyEntity): Promise<KeyEntityDocument> {
    let newKeyEntity = new scheme.KeyEntity({
        keyName: keyEntity.keyName,
        keyEncryptedPassword: keyEntity.keyEncryptedPassword,
        keyDescription: keyEntity.keyDescription,
        keyURL: keyEntity.keyURL
    });
    return newKeyEntity.save();
}

function addExistingKeyEntity(ringId: string, data: KeyEntity): Promise<KeyEntity> {
    return scheme.KeyRing.findByIdAndUpdate(ringId, {$push: {keyEntities: data.id}}, {"new": true})
        .then(resolve => data);
}

export function addNewKeyEntity(userId: string, ringId: string, keyEntity: KeyEntity): Promise<KeyEntity> {
    return new Promise<KeyEntity>((resolve, reject) => {
        getUserById(userId).then( user => {
            if(user.keyrings.find(value =>{
                    return value.id == ringId;
                })){
                return createNewKeyEntity(keyEntity).then( resolve => {
                    keyEntity.id = resolve.id;
                    console.log("RingId: "+ringId);
                    return addExistingKeyEntity(ringId, keyEntity)
                })
            }else{
                reject(new Error('userId doesnt have the provided key id, something is wrong, maybe hack attemnt'));
            }
        });

    });
}

export function deleteKeyEntity(keyEntity: KeyEntity) {
    return scheme.KeyEntity.findByIdAndRemove(keyEntity.id)
        .then(res => KeyEntity.getFromDocument(res));
}