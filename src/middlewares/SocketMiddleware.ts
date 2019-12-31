// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction, RequestHandler } from 'express';

// eslint-disable-next-line no-unused-vars
import { IApp } from '../app';

let socketId: string;
const connectedUsers: { [key: string]: boolean } = {};

export default function SocketMiddleware(app: IApp): RequestHandler {
  app.socketIo.on('connection', socket => {
    socketId = socket.id;
    connectedUsers[socket.id] = true;

    socket.on('disconnect', () => {
      if (connectedUsers[socket.id]) {
        delete connectedUsers[socket.id];
      }
    });

    app.socketIo.sockets.emit('connectedUsers', connectedUsers);
  });

  return (req: Request, _: Response, next: NextFunction) => {
    req.socketIo = app.socketIo;
    req.socketId = socketId;
    req.connectedUsers = connectedUsers;

    next();
  };
}
