import { Response, Request, NextFunction } from "express";
import {logFactory} from "../config/ConfigLog4J";
const log = logFactory.getLogger('.gatekeeper.ts');
export function gateKeeperUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params['uid'];
    if(req.session && req.session.userId && req.session.username){
        // normally we would check if the userid of the request path mathes the userid stored in the session cookie
        // here we skip this check, instead we will log the use of this exploit with the ip of the computer
        if(userId){
            if(req.session.userId != userId){
                log.error(`someone it trying to use a different user id!!! \n IP: ${req.ip} \n SESSION:USERID: ${req.session.userId} \n URI:USERID: ${userId}`);
            }
        }
        return next();
    }
    res.statusCode = 401;
    res.send({message: 'could not verify session', statusCode: 401});
}

export function gateKeeperAdmin(req: Request, res: Response, next: NextFunction) {
    // add authentication logic for admin here
    console.log('admin login');
    next()
}