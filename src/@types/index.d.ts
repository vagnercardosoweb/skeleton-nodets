/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/// <reference types="express" />
/// <reference types="express-serve-static-core" />
/// <reference types="node" />

import * as express from 'express';
import { Server as SocketServer } from 'socket.io';
import { Schema, StringSchema } from 'yup';

declare module 'yup' {
  export interface StringSchema<T extends string | null | undefined = string>
    extends Schema<T> {
    cpf(message?: string): StringSchema<T>;
    cnpj(message?: string): StringSchema<T>;
    phone(message?: string): StringSchema<T>;
    completeName(message?: string): StringSchema<T>;
  }
}

declare global {
  // namespace NodeJS {
  //   export interface ProcessEnv {
  //     [key: string]: string;
  //     NODE_ENV: 'development' | 'production' | 'test';
  //     AWS_API_VERSION: string;
  //     AWS_ACCESS_KEY_ID: string;
  //     AWS_SECRET_ACCESS_KEY: string;
  //     AWS_COGNITO_REGION: string;
  //     AWS_COGNITO_USER_POOL_ID: string;
  //     AWS_COGNITO_CLIENT_ID: string;
  //   }
  // }

  namespace Express {
    export interface Response {
      sentry?: string;
      error(err: any, status?: number): Response;
      success(data: any, status?: number): Response;
    }

    export interface Request {
      userId?: number | string;
      userToken?: string;
      socketIo: SocketServer;
      socketId: string;
      connectedUsers: Object;
      allowedRoute?: boolean;
      originalMethod?: string;
    }

    namespace Multer {
      interface File {
        newName: string;
      }
    }
  }
}
