'use strict';

const config = {
    env: {
        webContentDir: 'static',
        port: 3000,
        mongoDB: {
            host: 'examplehost',
            port: '1337',
            user: 'root',
            pass: 'pwdMaybeCrypted?'
        }
    }
};

module.exports = config;
