import * as Express from "express";
import * as session from "express-session";
import {Response as Res, Request as Req, NextFunction as Next} from "express";
import * as AuthService from "../services/authService";
import * as GateKeeper from "../handler/gatekeeper";
import {User} from "../objects/User";
import {Keygen} from "../services/keygen/keygen";
import {KeyPair} from "../objects/Model"
import {logFactory} from "../config/ConfigLog4J";
const log = logFactory.getLogger('.apiRouter.ts');

export const apiRouter = Express.Router();

apiRouter.use('/login', verifyLoginRequestParameter);

apiRouter.post('/login', (req: Req, res: Res, next: Next) => {
    const username = getUsername(req);
    const password = getPassword(req);
    log.debug(`/login req: ${username} pwd: ${password}`);
    const user = new User(undefined, username, password, undefined, [], false);
    log.debug(`/login req: user: ${JSON.stringify(user)}`);
    user.login().then( user => {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.send(user);
    }).catch( err => {
        log.error(`/login Error: ${err.message} stack: ${err.stack}`);
        res.statusCode = 403;
        // expose the error message -> we will expose the user id
        res.send({statusCode: 403, message: err.message});
    });
});

apiRouter.use('/register', verifyRequestParameter);

apiRouter.post('/register', (req: Req, res: Res) => {
    const username = getUsername(req);
    const password = getPassword(req);
    const email = getEmail(req);
    const user = new User(undefined, username, password, email, [], false);
    user.register().then(data => {
        log.info(JSON.stringify(data));
        res.send({statusCode: 201, message: 'Successfully registered!', id: data.id});
    }).catch(error => {
        res.statusCode = 500;
        res.send({statusCode: 500, message: 'Internal Server error', error: error});
    })
});

// we could also use a new router here for better route managment
apiRouter.use('/admin', GateKeeper.gateKeeperAdmin);
apiRouter.use('/user/:uid', GateKeeper.gateKeeperUser);


apiRouter.get('/user/:uid/keyring', (req: Req, res: Res, next: Next) => {
    // show keyring for the user with the user id
    const userId = req.params['uid'];
    res.send('you are a user! with the id' + userId);
});

apiRouter.post('/user/:uid/keyring', (req: Req, res: Res) => {
    let userId = getUserId(req);
    let kid = getKeyRingId(req);
    let ringName = getKeyRingName(req);
    // create and validate new keyring here
    Keygen.generateNewRSAKey((key: KeyPair) => {
        //TODO should we expose the keyRingId? is it the "glboal" keyRing id or just the users?
        let filename = getKeyRingName(req) + "-" + getKeyRingId(req) + "-" + "-keyring.pem";
        res.attachment(filename);
        //TODO store the public key on the server --> the user is able to add new keys to the ring without using his private key all the time [public key can be generated from private key, but key.public exists already]
        res.send(key.private);
    });
});

apiRouter.post('/user/:uid/keyring/:kid', (req: Req, res: Res) => {
    // create and validate new pass for the desired keyring
});

apiRouter.get('/admin', (req: Req, res: Res, next: Next) => {
    res.send('you are an admin!');
    next();
});

function verifyLoginRequestParameter(req: Req, res: Res, next: Next) {
    if (getUsername(req) && getPassword(req)) {
        return next();
    }
    res.statusCode = 400;
    return res.send({statusCode: 400, message: 'missing request parameter'});
}

function verifyRequestParameter(req: Req, res: Res, next: Next) {
    if (getUsername(req) && getPassword(req) && getEmail(req)) {
        return next();
    }
    res.statusCode = 400;
    return res.send({statusCode: 400, message: 'missing request parameter'});
}

function getUsername(req: Req): string {
    return req.body["username"];
}

function getPassword(req: Req): string {
    return req.body["password"];
}

function getEmail(req: Req): string {
    return req.body["email"];
}

function getUserId(req: Req): string {
    return req.params['uid'];
}

function getKeyRingId(req: Req): string {
    return req.params['kid'];
}

function getKeyRingName(req: Req): string {
    return req.params['k-name'];
}