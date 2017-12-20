import { Response, Request, NextFunction } from "express";

export function gateKeeperUser(req: Request, res: Response, next: NextFunction) {
    // add authentication logic for user here
    console.log('user login');
    next();
}

export function gateKeeperAdmin(req: Request, res: Response, next: NextFunction) {
    // add authentication logic for admin here
    console.log('admin login');
    next()
}