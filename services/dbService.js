'use strict';
const mongoose = require('mongoose');

const init = () => {
  // connect to db here
};

// call init, will be executed once when this file is loaded by require, require will keep this single instance and will
// return it on all next requires
init();

module.exports = {
    save: data =>{
        // so something here
        // then return promise

    },

    load: data => {

    },

    create: data => {

    },

    delete: data => {

    }
};