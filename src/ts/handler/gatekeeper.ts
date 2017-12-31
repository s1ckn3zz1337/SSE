import { Response, Request, NextFunction } from "express";
import {logFactory} from "../config/ConfigLog4J";
const log = logFactory.getLogger('.gatekeeper.ts');

function _isAuthenticated(req:Request){
    return req.session && req.session.userId && req.session.username
}

export function staticAuth(req: Request, res: Response, next:NextFunction){
    if(_isAuthenticated(req)){
        return next();
    }
    if(req.url !== '/index.html'){
        return res.redirect('/index.html');
    }
    return res.end();
    /*
    res.statusCode = 401;
    return res.send({message: 'could not verify session', statusCode: 401});*/
}

export function gateKeeperUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params['uid'];
    if(_isAuthenticated(req)){
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

