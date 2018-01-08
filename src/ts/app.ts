import * as path from "path";
import {Env} from "./config/config";
import {logFactory} from "./config/ConfigLog4J";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import {apiRouter} from "./routes/apiRouter";
import * as gatekeeper from './handler/gatekeeper'
import * as express from "express";
import * as session from "express-session";
import {Request as Req, Response as Res, NextFunction as Next} from "express";
import * as dbService from "./services/dbService";

const log = logFactory.getLogger('.server');

export class Server {

    public app: express.Application;
    private port = this.normalizePort(Env.port || '443');
    private httpServer: http.Server;
    private httpsServer: https.Server;

    public static bootstrap(port?:number, debug?:boolean): Server {
        return new Server(port, debug);
    }

    public shutdown(): void {
        this.httpsServer.close();
    }

    private constructor(port?: number, debug?:boolean) {
        this.app = express();
        this.config(port);
        this.connenctToDatabase();
        this.setRoutes();
        this.errorHandling();
    }

    private config(port?: number) {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));

        // create HTTP Server for redirect
        this.httpServer = http.createServer(function (req, res) {
            res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
            res.end();
        }).listen(80);

        // bind the auth before we init the static directories
        // -> otherwise the session management won't work properly :(
        this.app.use(session({
            secret: Math.random().toString(36),
            cookie: {secure: false, httpOnly: true},
            resave: false,
            saveUninitialized: false,
            //https://expressjs.com/de/advanced/best-practice-security.html
            name: "differentSessionName"
        }));
        this.app.use('/dashboard.html', gatekeeper.staticAuth);
        this.app.use('/admin.html', gatekeeper.staticAuth);
        this.app.use(express.static(path.join(__dirname, Env.webContentDir)));
        this.port = (port != null) ? port : this.port;
        this.app.set('port', this.port);
        let ssl = {
            key: fs.readFileSync('ssl/sse.key'),
            cert: fs.readFileSync('ssl/sse.pem')
        };
        this.httpsServer = https.createServer(ssl, this.app);
        this.httpsServer.listen(this.port);
        this.httpsServer.on('error', this.getErrorHandler());
        this.httpsServer.on('listening', this.getListeningHandler());
        log.info('listening on ' + this.port);
    }

    private errorHandling() {
        this.app.use((err: any, req: Req, res: Res, next: Next) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            if (err.originalErr) {
                log.error(JSON.stringify(err.originalErr));
            }
            // render the error page
            res.status(err.status || 500);
            res.send(err.message);
        });
    }

    private setRoutes() {
        this.app.use('/api', apiRouter);
        /*
        this.app.use('/admin.html')
        this.app.use('/dashboard.html', (req: Req, res: Res, next: Next) => {
            if (req.session && req.session.username) {
                if(req.url !== req.path){
                    res.redirect(req.url);
                }
                res.end();
            } else {
                res.redirect('/index.html');
            }
        });*/
    }

    private connenctToDatabase() {
        dbService.initDBConnection();
    }

    /**
     * Normalize a port into a number, string, or false.
     */
    private normalizePort(val: string | number) {
        const port = parseInt(val as string, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    private getErrorHandler() {
        let port = this.port;
        // do not add this  in the handler, since the "this" changes depending on the caller
        return (error: any) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    log.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    log.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
    }

    private getListeningHandler() {
        let httpServer = this.httpsServer;
        return () => {
            const addr = httpServer.address();
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
        }
    }

}


//Server.boostrap();