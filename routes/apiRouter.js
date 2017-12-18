'use strict';
const router = require('express').Router();
const authService = require('../services/authService');
const gateKeeper = require('../handler/gatekeeper');


router.get('/', (req, res, next) => {
    res.send({test:'Test'});
});

router.get('/auth', (req, res, next) => {
    authService.isAuthenticated('example data').then((result) => {
        res.send(result)
    }).catch(err => {
        res.statusCode = 403;
        res.send(err)
    })
});

// we could also use a new router here for better route managment
router.use('/admin', gateKeeper.gateKeeperAdmin);
router.use('/user', gateKeeper.gateKeeperUser);

router.get('/admin', (req, res, next)=>{
    res.send('you are an admin!');
});

router.get('/user', (req, res, next)=>{
    res.send('you are a user!');
});


module.exports = router;
