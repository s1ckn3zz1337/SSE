import * as Express from "express";
import { Response, Request, NextFunction } from "express";

export const userRouter = Express.Router({ mergeParams: true });

