// import credentials from config
import { Env } from "../config";
import * as scheme from '../database/schemes';

'use strict';
const mongoose = require('mongoose');

// connect database
const init = () => {
    mongoose.connect('mongodb://' +
        Env.mongoDB.user + ':' +
        Env.mongoDB.password + '@' + 
        Env.mongoDB.host + ':' +
        Env.mongoDB.port +'/' +
        Env.mongoDB.database, {
        useMongoClient: true }, function (err:string) {
            if (err) throw err;
            console.log("MongoDB connected!");
    });
};

init();

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