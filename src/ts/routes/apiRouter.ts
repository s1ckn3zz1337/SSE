import * as Express from "express";
import { Response, Request, NextFunction } from "express";
import * as AuthService from "../services/authService";
import * as GateKeeper from "../handler/gatekeeper";

export const router = Express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send({ test: 'Test' });
});

router.get('/auth', (req: Request, res: Response, next: NextFunction) => {
    AuthService.isAuthenticated('example data').then((result) => {
        res.send(result)
    }).catch(err => {
        res.statusCode = 403;
        res.send(err)
    })
});

// we could also use a new router here for better route managment
router.use('/admin', GateKeeper.gateKeeperAdmin);
router.use('/user', GateKeeper.gateKeeperUser);

router.get('/admin', (req: Request, res: Response, next: NextFunction) => {
    res.send('you are an admin!');
});

router.get('/user', (req: Request, res: Response, next: NextFunction) => {
    res.send('you are a user!');
});