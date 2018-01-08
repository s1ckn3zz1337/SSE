import * as mongoDB from "mongoose";

export class Env {
    public static readonly webContentDir = '/static';
    public static readonly port = 443;
    public static readonly mongoDB: MongoConfig = {
        host: '0.0.0.0',
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