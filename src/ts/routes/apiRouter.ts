import * as Express from "express";
import * as session from "express-session";
import {Response as Res, Request as Req, NextFunction as Next} from "express";
import * as GateKeeper from "../handler/gatekeeper";
import * as dbService from '../services/dbService'
import {Keygen} from "../services/keygen/keygen";
import {logFactory} from "../config/ConfigLog4J";
import {KeyPair, KeyRing, User} from "../objects/Model";
import {KeyEntity} from "../objects/KeyEntity";
import {error} from "util";
const log = logFactory.getLogger('.apiRouter.ts');

export const apiRouter = Express.Router();

apiRouter.use('/login', verifyLoginRequestParameter);

apiRouter.post('/login', (req: Req, res: Res, next: Next) => {
    const username = getUsername(req);
    const password = getPassword(req);
    log.debug(`/login req: ${username} pwd: ${password}`);
    const user = new User(undefined, username, password, undefined, [], false);
    log.debug(`/login req: user: ${JSON.stringify(user)}`);
    user.login().then(user => {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.send(user);
    }).catch(err => {
        log.error(`/login Error: ${err.message} stack: ${err.stack}`);
        res.status(403);
        // expose the error message -> we will expose the user id
        res.send({statusCode: 403, message: err.message});
    });
});

apiRouter.use('/register', verifyRequestParameter);

apiRouter.post('/register', (req: Req, res: Res) => {
    log.info("Register called");
    const username = getUsername(req);
    const password = getPassword(req);
    const email = getEmail(req);
    const user = new User(undefined, username, password, email, [], false);
    user.register().then(data => {
        log.info(JSON.stringify(data));
        res.status(201).send({message: 'Successfully registered!', id: data.id});
    }).catch(error => {
        log.error("POST " + req.url, error);
        res.sendStatus(500);
    })
});

// implement A7 - insecure Admin interface
apiRouter.use('/admin', GateKeeper.gateKeeperUser);

apiRouter.use('/user/:uid', GateKeeper.gateKeeperUser);

apiRouter.get('/user/:uid/keyring', (req: Req, res: Res, next: Next) => {
    // todo this should return all keyrings for the user???
    const userId = req.params['uid'];
    dbService.getUserById(userId).then(user => {
        res.send(user.keyrings || []);
    }).catch(error => {
        log.error('GET ' + req.url, error);
        res.sendStatus(500);
    });
});

/**
 * Create new key ring for user
 */
apiRouter.post('/user/:uid/keyring', (req: Req, res: Res) => {
    let userId = getUserId(req);
    let ringName = getName(req);
    let ringDescription = getDescription(req);
    // create and validate new keyring here
    Keygen.generateNewRSAKey((keyPair: KeyPair) => {
        //TODO should we expose the keyRingId? is it the "glboal" keyRing id or just the users?
        //TODO store the public key on the server --> the user is able to add new keys to the ring without using his private key all the time [public key can be generated from private key, but key.public exists already]
        dbService.addNewKeyRing(userId, new KeyRing(undefined, ringName, ringDescription, keyPair.public, [])).then(fulfilled => {
            res.send(keyPair.private);
        }, rejected => {
            log.error("Error at creating new key ring: " + rejected);
            res.sendStatus(500);
        })
    });
});

apiRouter.get('/user/:uid/keyring/:kid', (req: Req, res: Res) => {
    dbService.getKeyRingById(getKeyRingId(req)).then(keyring => {
        res.send(keyring);
    }).catch(error => {
        log.error('GET ' + req.url + ": " + error);
        res.send({statusCode: 500, message: 'Internal Server error', error: error});
    });
});

apiRouter.post('/user/:uid/keyring/:kid/key', (req: Req, res: Res, next) => {
    let kid = getKeyRingId(req);
    let name = getName(req);
    let description = getDescription(req);
    let url = getUrl(req);
    let user = getUsername(req);
    let password = getPassword(req);
    let publicKey = getPublicKey(req);
    let encryptedPassword = Keygen.encrypt(password, publicKey);
    //let privateKey = ``
    //let decryptPassword = Keygen.decrypt(encryptedPassword, privateKey);

    dbService.addNewKeyEntity(kid, new KeyEntity(undefined, name, encryptedPassword, description, url))
        .then(fulfilled => {
            res.sendStatus(200);
        }).catch(rejected => {
            res.sendStatus(500);
        });
});

apiRouter.get('/user/:uid/keyring/:kid/key/:keyid', (req: Req, res: Res) => {
    // todo this should return the key with the desired id from the keyring with the desired id
    //
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
    return res.status(400).send({message: 'missing request parameter'});
}

/** from params */
function getUserId(req: Req): string {
    return req.params['uid'];
}

/** from params */
function getKeyRingId(req: Req): string {
    return req.params['kid'];
}

/** from body */
function getUsername(req: Req): string {
    return req.body["username"];
}

/** from body */
function getPassword(req: Req): string {
    return req.body["password"];
}

/** from body */
function getEmail(req: Req): string {
    return req.body["email"];
}

/** from body */
function getName(req: Req): string {
    return req.body['name'];
}

/** from body */
function getDescription(req: Req): string {
    return req.body['description'];
}
/** from body */
function getUrl(req: Req): string {
    return req.body['url'];
}

function getPublicKey(req: Req): string {
    return req.body["public-key"];
}

/** from body */
function getKeyEnteties(req: Req): KeyEntity[] {
    const entities: KeyEntity[] = req.body['keyEntities'];
    return entities;
}