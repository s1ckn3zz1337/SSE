import * as mondoDB from "mongoose";

export class Env {
    public static readonly webContentDir = '/static';
    public static readonly indexHtml = "/static/index.html";
    public static readonly port = 3000;
    public static readonly mongoDB: MongoConfig = {
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