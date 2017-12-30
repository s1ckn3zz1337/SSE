import { Response, Request, NextFunction } from "express";
import {message} from "gulp-typescript/release/utils";

export function gateKeeperUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params['uid'];
    if(req.session && req.session.userId && req.session.username){
        if(userId){
            if(req.session.userId == userId){
                return next()
            }
        }
        return next();
    }
    throw new Error('could not veerify session')
}

export function gateKeeperAdmin(req: Request, res: Response, next: NextFunction) {
    // add authentication logic for admin here
    console.log('admin login');
    next()
}