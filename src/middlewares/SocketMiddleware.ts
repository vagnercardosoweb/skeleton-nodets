import Middleware from './Middleware';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      this.socketIo.on('connection', client => {
        // console.log(`Socket connection: ${client.id}`);

        client.on('disconnect', () => {
          // onsole.log(`Socket disconnect: ${client.id}`);
        });
      });

      req.socketIo = this.socketIo;

      next();
    };
  }
}
