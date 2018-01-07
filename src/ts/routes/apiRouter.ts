import * as Express from "express";
import {Response as Res, Request as Req, NextFunction as Next} from "express";
import * as GateKeeper from "../handler/gatekeeper";
import * as dbService from '../services/dbService'
import {logFactory} from "../config/ConfigLog4J";
import {User} from "../objects/User";
import {KeyPair, KeyRing} from "../objects/Model";
import {KeyEntity} from "../objects/KeyEntity";

const log = logFactory.getLogger('.apiRouter.ts');

export const apiRouter = Express.Router();

apiRouter.use('/login', verifyLoginRequestParameter);

apiRouter.post('/login', (req: Req, res: Res, next: Next) => {
    log.info(`POST /login ${req.ip} called`);
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
    log.info(`POST /register ${req.ip} called`);
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

apiRouter.use('/user/:uid', GateKeeper.gateKeeperUser);

// USE USER AUTHENTICATION INSTEAD OF ADMIN -> USER WILL BE ABLE TO PERFORM ADMIN CMDS

apiRouter.get('/user', GateKeeper.gateKeeperUser);
apiRouter.get('/user', ((req, res) => {
    log.info(`ADMIN: GET /user ${req.ip} called`);
    dbService.listUsers().then( users => {
        res.send(users);
    }).catch( err => {
        log.error('GET /user', err);
        res.sendStatus(500);
    })
}));

apiRouter.get('/user/:uid/keyring', (req: Req, res: Res) => {
    log.info(`GET /user/:uid/keyringr ${req.ip} called`);
    /*
        Normally we would use the userId provided in the session, not in the request params
        -> This is a vulnerability, because EVERY user with a valid session can access other users keyrings
        by providing their id in the request.
     */
    const userId = getUserId(req);
    dbService.getUserById(userId).then(user => {
        res.send(user.keyrings || []);
    }).catch(error => {
        log.error('GET ' + req.url, error);
        res.sendStatus(500);
    });
});

apiRouter.delete('/user/:uid', (req: Req, res: Res) => {
    log.info(`ADMIN: DELETE /user/:uid ${req.ip} called`);
    const userId = getUserId(req);
    dbService.deleteUser(userId).then(response => {
        return res.sendStatus(200);
    }).catch(err => {
        log.error('Error while removing User' + err);
        return res.sendStatus(500);
    });
});



/**
 * Create new key ring for user
 */
apiRouter.post('/user/:uid/keyring', (req: Req, res: Res) => {
    const userId = getUserId(req);
    const ringName = getName(req);
    const ringDescription = getDescription(req);
    const publicKey = getPublicKey(req);
    dbService.addNewKeyRing(userId, new KeyRing(undefined, ringName, ringDescription, publicKey, [])).then(fulfilled => {
        res.statusCode = 201;
        res.send(fulfilled.id);
    }, rejected => {
        log.error("Error at creating new key ring: " + rejected);
        res.sendStatus(500);
    })
});

apiRouter.get('/user/:uid/keyring/:kid', (req: Req, res: Res) => {
    dbService.getKeyRingById(getKeyRingId(req)).then(keyring => {
        res.send(keyring);
    }).catch(error => {
        log.error('GET ' + req.url + ": " + error);
        res.send({statusCode: 500, message: 'Internal Server error', error: error});
    });
});

apiRouter.delete('/user/:uid/keyring/:kid', (req: Req, res: Res) => {
    log.info('DELETE ' + req.url);
    dbService.deleteKeyRing(getKeyRingId(req)).then(keyring => {
        res.sendStatus(200);
    }).catch(error => {
        log.error('GET ' + req.url + ": " + error);
        res.send({statusCode: 500, message: 'Internal Server error', error: error});
    });
});

apiRouter.post('/user/:uid/keyring/:kid/key', (req: Req, res: Res, next) => {
    const userId = getUserId(req);
    const kid = getKeyRingId(req);
    const name = getName(req);
    const description = getDescription(req);
    const url = getUrl(req);
    const password = getPassword(req);
    dbService.addNewKeyEntity(userId, kid, new KeyEntity(undefined, name, password, description, url))
        .then(fulfilled => {
            res.sendStatus(200);
        }).catch(rejected => {
        res.sendStatus(500);
    });
});

apiRouter.delete('/user/:uid/keyring/:kid/key/:eid', (req: Req, res: Res) => {
    const userId = getUserId(req);
    const entId = getKeyEntityId(req);
    dbService.getUserById(userId).then( user => {
        if(user.getKeyEntityById(entId) != null){
            dbService.deleteKeyEntity(new KeyEntity(entId, undefined, undefined, undefined, undefined)).then(keyring => {
                return res.sendStatus(200);
            })
        }else{
            log.error('/DELETE ' + userId + 'ringid: ' +  entId + ' failen, id not found on provided user');
            return res.sendStatus(400);
        }
    }).catch(error => {
        log.error('GET ' + req.url + ": " + error);
        return res.send({statusCode: 500, message: 'Internal Server error', error: error});
    });
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

function getKeyEntityId(req: Req):string {
    return req.params['eid'];
}

/** from body */
function getUrl(req: Req): string {
    return req.body['url'];
}

function getPublicKey(req: Req): string {
    return req.body["publicKey"];
}

/** from body */
function getKeyEnteties(req: Req): KeyEntity[] {
    const entities: KeyEntity[] = req.body['keyEntities'];
    return entities;
}