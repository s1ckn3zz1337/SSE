// import credentials from config
import {Env} from "../config/config";
import {logFactory} from "../config/ConfigLog4J";
import * as scheme from '../database/schemes';
import * as mongoose from "mongoose";
import {MongoError} from "mongodb";
import {User} from "../objects/User";
import {KeyRing} from "../objects/KeyRing";
import {KeyEntity} from "../objects/KeyEntity";
import {KeyEntityDocument, KeyRingDocument} from "../database/schemes";

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
    return scheme.User.findById(userid).populate({
        path: "keyrings",
        populate: {path: "keyEntities", model: "KeyEntity"}
    }).exec()
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

export function findUser(userName: any) {
    return new Promise<Array<User>>((resolve, reject) => {
        /*

        if(myUser == '' || myUser == undefined) {
            return resolve();
        }

        if(myUser == "\'\\\'; return \\\'\\\' == \\\'\'" ||
            myUser == "\';return \\'\\' == \\''") {
            myUser = '';
        }*/

        scheme.User.find(userName).then( res => {//{'username' : {$regex : ".*" + myUser + ".*"}}).then(res => {
            console.log(res);
            const users = new Array<User>();
            res.forEach(one => {
                users.push(User.getFromDocument(one))
            });
            return resolve(users);
        }).catch(err => {
            return reject(err);
        });
    });
}

export function listUsers() {
    return new Promise<Array<User>>((resolve, reject) => {
        scheme.User.find({}).populate({
            path: "keyrings",
            populate: {path: "keyEntities", model: "KeyEntity"}
        }).exec()
            .then(res => {
                const users = new Array<User>();
                res.forEach(one => {
                    users.push(User.getFromDocument(one))
                });
                return resolve(users);
            }).catch(err => {
                log.error('listUsers: ', err);
                return reject(err);
            })
    })
}

export function deleteUser(key: string) {
    return scheme.User.findByIdAndRemove(key);
}

export function deleteKeyRings(ids: Array<string>) {
    return scheme.KeyRing.remove({id: ids});
}

function resetAll() {
    scheme.KeyRing.remove({}, () => {
        console.log("ring")
    });
    scheme.User.remove({}, () => {
        console.log("user")
    });
    scheme.KeyEntity.remove({}, () => {
        console.log("entity")
    });
    console.log("Deleted all");
}

//(()=> resetAll())();

export function getKeyRingById(id: string): Promise<KeyRing> {
    return scheme.KeyRing.findOne({_id: id}).populate("keyEntities").exec()
        .then(resolve => KeyRing.getFromDocument(resolve));
}

function createNewKeyRing(data: KeyRing): Promise<KeyRingDocument> {
    console.dir(data);
    const newKeyRing = new scheme.KeyRing({
        name: data.name,
        description: data.description,
        publicKey: data.publicKey,
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
        })
        .catch(err =>{
            log.error("Error at creating new key ring: " + err);
            return Promise.reject(err);
        });
};

export function deleteKeyRing(id: string) {
    return scheme.KeyRing.findByIdAndRemove(id);
};

function createNewKeyEntity(keyEntity: KeyEntity): Promise<KeyEntityDocument> {
    let newKeyEntity = new scheme.KeyEntity({
        keyName: keyEntity.keyName,
        keyEncryptedPassword: keyEntity.keyEncryptedPassword,
        keyDescription: keyEntity.keyDescription,
        keyURL: keyEntity.keyURL,
        keyUsername: keyEntity.keyUsername
    });
    return newKeyEntity.save();
}

function addExistingKeyEntity(ringId: string, data: KeyEntity): Promise<KeyEntity> {
    return scheme.KeyRing.findByIdAndUpdate(ringId, {$push: {keyEntities: data.id}}, {"new": true})
        .then(resolve => data);
}

export function addNewKeyEntity(userId: string, ringId: string, keyEntity: KeyEntity): Promise<KeyEntity> {
    return getUserById(userId).then(user => {
        let userHasKeyring = user.keyrings.find(value => {
            return value.id == ringId;
        });
        if (userHasKeyring) {
            return createNewKeyEntity(keyEntity).then(resolve => {
                keyEntity.id = resolve.id;
                return addExistingKeyEntity(ringId, keyEntity);
            });
        } else {
            return Promise.reject('userId doesnt have the provided key id, something is wrong, maybe hack attemnt');
        }
    });
}

export function deleteKeyEntity(keyId: string) {
    return scheme.KeyEntity.findByIdAndRemove(keyId)
        .then(res => KeyEntity.getFromDocument(res));
}

/*export function getKeyEntity(keyEntity: KeyEntity) {
    return scheme.KeyEntity.(keyEntity.id)
        .then(res => KeyEntity.getFromDocument(res));
}*/

export function getKeyEntity(id: string): Promise<KeyEntity> {
    return scheme.KeyEntity.findOne({_id: id}).then(resolve => KeyEntity.getFromDocument(resolve));
}