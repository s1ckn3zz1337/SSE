import { Response, Request, NextFunction } from "express";
export function gateKeeperUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params['uid'];
    if(req.session && req.session.userId && req.session.username){
        if(userId){
            if(req.session.userId == userId){
                return next()
            }
        }else{
            return next();
        }
    }
    res.statusCode = 401;
    res.send({message: 'could not verify session', statusCode: 401});
}

export function gateKeeperAdmin(req: Request, res: Response, next: NextFunction) {
    // add authentication logic for admin here
    console.log('admin login');
    next()
}