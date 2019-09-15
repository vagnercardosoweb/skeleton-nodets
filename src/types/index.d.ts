/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/// <reference types="express" />
/// <reference types="express-serve-static-core" />

import express from 'express';
import { Server as SocketServer, Socket as SocketConnected } from 'socket.io';

declare global {
  namespace Express {
    export interface Response {
      error(err: any, status?: number): Response;
      success(data: any, status?: number): Response;
    }

    export interface Request {
      auth?: Object;
      socketIo?: SocketServer;
      socketConnected?: SocketConnected;
      originalMethod?: string;
    }

    namespace Multer {
      interface File {
        newName: string;
      }
    }
  }
}
