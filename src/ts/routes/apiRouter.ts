import * as Express from "express";
import { Response, Request, NextFunction } from "express";
import * as AuthService from "../services/authService";
import * as GateKeeper from "../handler/gatekeeper";

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
    const body = req.body;
    res.send(body);
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

