import * as mongoDB from "mongoose";

export class Env {
    public static readonly webContentDir = '/static';
    public static readonly indexHtml = "/static/index.html";
    public static readonly port = 3000;
    public static readonly mongoDB: MongoConfig = {
        host: 'localhost',
        port: 27017,
        user: 'sseuser',
        password: 'Z2xQK8tASSDF8ZcU3XuSLzNY',
        database: 'sse'
    }
}

export interface MongoConfig {
    host: string,
    port: number | string,
    user: string,
    password: string,
    database: string
}