import * as Schema from "../database/schemes"
import * as Mongoose from "mongoose";
import { IKeyRing } from "./KeyRing";

/*export class User implements IUser {

    public keyrings: IKeyRing[] = [];

    constructor(public _id: string, public username: string, public password: string, public email: string) {
    }

    register() {

    }

    login() {
        // do some logic here, aka prepare data
    }

    checkCredentials() {
        // do some logic here, aka prepare data
    }
}*/

export interface IUser extends Mongoose.Document {
    username: String,
    email: String,
    password: String,
    keyrings: IKeyRing[]
}