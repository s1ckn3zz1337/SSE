export class Env {
    public static readonly webContentDir = '/static';
    public static readonly port = 443;
    // hange pepper on deployment
    public static readonly pepper = 'CHANGE_ME_ON_DEPLYOMENT!!!';
    public static readonly mongoDB: MongoConfig = {
        // https://linuxconfig.org/basic-example-on-how-to-link-docker-containers
        host: 'mongo',
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