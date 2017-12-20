'use strict';
const mongoose = require('mongoose');

const init = () => {
    // connect to db here
};

// call init, will be executed once when this file is loaded by require, require will keep this single instance and will
// return it on all next requires
init();

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