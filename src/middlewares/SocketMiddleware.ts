/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Socket as SocketConnected } from 'socket.io';
import Middleware from './Middleware';

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    let socketConnected: SocketConnected;

    this.socketIo.on('connection', client => {
      socketConnected = client;

      // console.log(`Socket connection: ${client.id}`);

      client.on('disconnect', () => {
        // console.log(`Socket disconnect: ${client.id}`);
      });
    });

    return (req: Request, res: Response, next: NextFunction) => {
      req.socketIo = this.socketIo;

      if (socketConnected) {
        req.socketConnected = socketConnected;
      }

      next();
    };
  }
}
