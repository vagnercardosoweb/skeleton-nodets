import { Application, RequestHandler, ErrorRequestHandler } from 'express';
import { Server as SocketServer } from 'socket.io';

export default abstract class Middleware {
  public application: Application;
  public socketIo: SocketServer;

  public constructor(application?: Application, socketIo?: SocketServer) {
    this.application = application;
    this.socketIo = socketIo;
  }

  public abstract dispatch(
    params?: Object
  ): RequestHandler | ErrorRequestHandler;
}
