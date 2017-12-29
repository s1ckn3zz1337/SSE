// import credentials from config
import { Env } from "../config/config";
import { logFactory } from "../config/ConfigLog4J";
import { Logger } from "typescript-logging";
import * as scheme from '../database/schemes';
import { error } from "util";
import * as mongoose from "mongoose";
import { MongoError } from "mongodb";
import { User } from "../objects/User";
import { KeyRing } from "../objects/Keyring";
import { KeyEntity } from "../objects/Model";

const log = logFactory.getLogger(".dbService.ts");

export class MongoDBConnection {

    private log: Logger;

    constructor() {
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
    }
}

// database services
export class DbService {

    private log: Logger; 

    public getUser(data:User) {

        scheme.User.find({ 'username' : data.username }, function (err,user) {
            if (err) log.error('Error while loading User' + err);
            else {
                return user;
            }
        });
    }

    public registerUser(data:User) {
        var myUser = new scheme.User({
            username: data.username,
            password: data.password,
        });

        scheme.User.find({ '_id' : data.username }, function (err, user) {
            if (user.length){
                log.error('Failed creating User - already exists');
            } else {
                myUser.save();
                log.info('User ' + myUser.username + ' created');
            }
        });

        // second query only for returning created user object with database id - delete if not needed
        scheme.User.find({ 'username' : myUser.username }, function (err,user) {
            if (err) log.error('Error while loading User' + err);
            else {
                return user;
            }
        });
    }

    public deleteUser(data:User) {
        scheme.User.findByIdAndRemove(data.id, function (err, res) {
            if (err) log.error('Error while removing User' + err);
            else {
                return true;
            }
        });
    }

    public saveKeyRing(data:KeyRing) {

    }
    
    public deleteKeyRing(data:KeyRing) {
        scheme.KeyRing.findByIdAndRemove(data.schemaId, function (err, res) {
            if (err) log.error('Error while removing KeyRing' + err);
            else {
                return true;
            }
        });
    }

    public saveKeyRingEntity(data:KeyEntity) {

    }

    public deleteKeyEntity(data:KeyEntity) {
        scheme.KeyEntity.findByIdAndRemove(data.keyId, function (err, res) {
            if (err) log.error('Error while removing KeyEntity' + err);
            else {
                return true;
            }
        });
    }
};