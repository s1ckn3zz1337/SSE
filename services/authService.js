'use strict';
module.exports =  {
    isAuthenticated: data =>{
        return new Promise((resolve, reject) => {
            Math.random() > 0 ? resolve(data) : reject(data);
        });
    },
    isAdmin: data =>{
        return new Promise((resolve, reject) => {
            Math.random() > 0 ? resolve(data) : reject(data);
        });
    }
};