/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/// <reference types="express" />
/// <reference types="express-serve-static-core" />

import express from 'express';
import { Server as SocketServer } from 'socket.io';

declare global {
  namespace Express {
    export interface Response {
      sentry?: string;
      error(err: any, status?: number): Response;
      success(data: any, status?: number): Response;
    }

    export interface Request {
      user?: Object;
      socketIo?: SocketServer;
      socketId?: string;
      connectedUsers?: Object;
      allowedRoute?: boolean;
    }

    namespace Multer {
      interface File {
        newName: string;
      }
    }
  }
}
