// import credentials from config
import { Env } from "../config/config";
import { logFactory } from "../config/ConfigLog4J";
import { Logger } from "typescript-logging";
import * as scheme from '../database/schemes';
import { error } from "util";
import * as mongoose from "mongoose";
import { MongoError } from "mongodb";

export class MongoDBConnection {

    private log: Logger;

    constructor() {
        let log = logFactory.getLogger(".mongoDBConnection");
        this.log = log;
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
export class DbService<T> {

    public save(data: T) {
        // so something here
        // then return promise
    }

    public load(data: T) {

    }

    public create(data: T) {

    }

    public delete(data: T) {

    }
};