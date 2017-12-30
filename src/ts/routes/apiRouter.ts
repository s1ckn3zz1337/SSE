import * as Express from "express";
import {Response as Res, Request as Req, NextFunction as Next} from "express";
import * as AuthService from "../services/authService";
import * as GateKeeper from "../handler/gatekeeper";
import {User} from "../objects/User";
import {Keygen} from "../services/keygen/keygen";
import {KeyPair} from "../objects/model"

export const apiRouter = Express.Router();

apiRouter.post('/login', (req: Req, res: Res, next: Next) => {
    AuthService.isAuthenticated('example data').then((result) => {
        res.send(result)
    }).catch(err => {
        res.statusCode = 403;
        res.send(err)
    })
});

apiRouter.post('/register', (req: Req, res: Res) => {
    // dummy impl
    let username = getUsername(req);
    let password = getPassword(req);
    let email = getEmail(req);
    if (username && password) {
        let user = new User(undefined, username, password, email, []);
        user.register().then(data => {
            res.send({statusCode: 201, message: 'Successfully registered!', id: data.id});
        }).catch(error => {
            res.statusCode = 500;
            res.send({statusCode: 500, message: 'Internal Server error', error: error});
        })
    } else {
        res.statusCode = 400;
        res.send({statusCode: 400, message: 'Cannot process request, missing data...'})
    }
});

// we could also use a new router here for better route managment
apiRouter.use('/admin', GateKeeper.gateKeeperAdmin);
apiRouter.use('/user', GateKeeper.gateKeeperUser);


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

function getUsername(req: Req): string {
    return req.params["username"];
}

function getPassword(req: Req): string {
    return req.params["password"];
}

function getEmail(req: Req): string {
    return req.params["email"];
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