import * as mondoDB from "mongoose";

export class Env {
    public static webContentDir = 'static';
    public static port = 3000;
    public static mongoDB: MongoConfig = {
        host: 'examplehost',
        port: '1337',
        user: 'root',
        pass: 'pwdMaybeCrypted?'
    }
}

export interface MongoConfig {
    host: string,
    port: number | string,
    user: string,
    pass: string
}