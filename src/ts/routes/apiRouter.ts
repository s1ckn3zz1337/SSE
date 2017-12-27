import * as Express from "express";
import { Response, Request, NextFunction } from "express";
import * as AuthService from "../services/authService";
import * as GateKeeper from "../handler/gatekeeper";
import {User} from "../objects/User";

export const router = Express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send({ test: 'Test' });
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    AuthService.isAuthenticated('example data').then((result) => {
        res.send(result)
    }).catch(err => {
        res.statusCode = 403;
        res.send(err)
    })
});

router.post('/register', (req: Request, res: Response)=>{
    // dummy impl
    const body = req.body || {};
    const username = body.username;
    const password = body.password;
    if(username && password){
        const user = new User("", username, password);
        user.register().then( data =>{
            res.send({statusCode: 201, message: 'Successfully registered!', id: user.id});
        }).catch(error =>{
            res.statusCode = 500;
            res.send({statusCode: 500, message: 'Internal Server error', error: error});
        })
    }else{
        res.statusCode = 400;
        res.send({statusCode: 400, message: 'Cannot process request, missing data...'})
    }
});

// we could also use a new router here for better route managment
router.use('/admin', GateKeeper.gateKeeperAdmin);
router.use('/user', GateKeeper.gateKeeperUser);


router.get('/user/:uid/keyring', (req: Request, res: Response, next: NextFunction) => {
    // show keyring for the user with the user id
    const userId = req.params['uid'];
    res.send('you are a user! with the id' + userId);
});

router.post('/user/:uid/keyring',(req: Request, res: Response)=>{
    // create and validate new keyring here
});

router.post('/user/:uid/keyring/:kid', (req: Request, res: Response)=>{
    // create and validate new pass for the desired keyring

});

router.get('/admin', (req: Request, res: Response, next: NextFunction) => {
    res.send('you are an admin!');
});

