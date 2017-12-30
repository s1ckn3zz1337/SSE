import * as path from "path";
import {Env} from "./config/config";
import {logFactory} from "./config/ConfigLog4J";
import * as bodyParser from "body-parser";
import * as http from "http";
import {apiRouter} from "./routes/apiRouter";
import * as express from "express";
import * as session from "express-session";
import {Request as Req, Response as Res, NextFunction as Next} from "express";
import * as dbService from "./services/dbService";

const log = logFactory.getLogger('.server');

export class Server {

  private app: express.Application;
  private port = this.normalizePort(Env.port || '3000');
  private httpServer: http.Server;

  public static boostrap(): Server {
    return new Server();
  }

  private constructor() {
    this.app = express();
    this.config();
    this.connenctToDatabase();
    this.setRoutes();
    this.errorHandling();
  }

  private config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(express.static(path.join(__dirname, Env.webContentDir)));
    this.app.use(session({
        secret: 'adfiSHDFuhas7',
        resave: false,
        saveUninitialized: true
    }));
    this.app.set('port', this.port);
    this.httpServer = http.createServer(this.app);
    this.httpServer.listen(this.port);
    this.httpServer.on('error', this.getErrorHandler());
    this.httpServer.on('listening', this.getListeningHandler());
    log.info('listening on ' + this.port);
  }

  private errorHandling() {
    /*
    //simulate error at every second call
    let toggleSimulation = true;
    this.app.use((req: Req, res: Res, next: Next) => {
      toggleSimulation = !toggleSimulation;
      if (toggleSimulation) {
        const err: any = new Error('Simulated error, refresh again');
        err.status = 404;
        return next(err);
      } else {
        return next();
      }
    });
    */
    this.app.use((err: any, req: Req, res: Res, next: Next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      if(err.originalErr){
          log.error(JSON.stringify(err.originalErr));
      }
      // render the error page
      res.status(err.status || 500);
      res.send(err.message);
    });
  }

  private setRoutes() {
    this.app.use('/api', apiRouter);
    this.app.use('/', (req:Req, res:Res, next: Next) => {
        if(req.session && req.session.username) {
          res.redirect('/dashboard.html');
        } else {
          res.redirect('/index.html');
        }
    });
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
    let httpServer = this.httpServer;
    return () => {
      const addr = httpServer.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    }
  }

}


Server.boostrap();