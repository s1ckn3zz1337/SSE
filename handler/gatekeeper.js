'use strict';
module.exports = {
    gateKeeperUser: (req, res, next) => {
        // add authentication logic for user here
        console.log('user login');
        next();
    },
    gateKeeperAdmin: (req, res, next) => {
        // add authentication logic for admin here
        console.log('admin login');
        next()
    }
};