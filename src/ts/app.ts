import * as path from "path";
import { Env } from "./config";
import * as bodyParser from "body-parser";
import * as http from "http";
import { router } from "./routes/apiRouter";
import { STATUS_CODES } from "http";
import * as express from "express";
import { Request, Response, NextFunction } from "express";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// static content setup
app.use(express.static(path.join(__dirname, Env.webContentDir)));

// here we set the routes
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send({ message: 'Error - Not Found', statusCode: 404 })
});

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(Env.port || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
console.log('listening');
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string | number) {
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
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}


module.exports = app;
