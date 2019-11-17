/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Middleware from './Middleware';

let socketId: string;
const connectedUsers: { [key: string]: boolean } = {};

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    this.socketIo.on('connection', socket => {
      socketId = socket.id;
      connectedUsers[socket.id] = true;

      socket.on('disconnect', () => {
        if (connectedUsers[socket.id]) {
          delete connectedUsers[socket.id];
        }
      });

      this.socketIo.sockets.emit('connectedUsers', connectedUsers);
    });

    return (req: Request, res: Response, next: NextFunction) => {
      req.socketIo = this.socketIo;
      req.socketId = socketId;
      req.connectedUsers = connectedUsers;

      next();
    };
  }
}
