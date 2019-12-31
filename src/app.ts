/* eslint-disable no-unused-vars */
import './env';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import express, { Application } from 'express';
import helmet from 'helmet';
import http, { Server as HttpServer } from 'http';
import { Mongoose } from 'mongoose';
import { Environment } from 'nunjucks';
import { resolve } from 'path';
import { Sequelize } from 'sequelize';
import socketIo, { Server as SocketServer } from 'socket.io';

// @ts-ignore
import configDatabase from './config/database';
import configSentry from './config/sentry';
import configView from './config/view';
import { Database, View } from './lib';
import * as middlewares from './middlewares';
import * as models from './models';

export interface IApp {
  app: Application;
  server: HttpServer;
  socketIo: SocketServer;
  nunjucks?: Environment;
  mongoose?: Mongoose;
  sequelize?: Sequelize;
}

class App implements IApp {
  public app: Application;
  public server: HttpServer;
  public socketIo: SocketServer;
  public nunjucks?: Environment;
  public mongoose?: Mongoose;
  public sequelize?: Sequelize;

  public constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.socketIo = socketIo(this.server);

    this.initSentry();
    this.initNunjucks();
    this.initMongoose();
    this.initSequelize();
    this.initMiddlewares();
  }

  private initSentry(): void {
    if (process.env.NODE_ENV === 'production') {
      Sentry.init(configSentry);
    }
  }

  private initNunjucks(): void {
    this.nunjucks = View.nunjucks(resolve(configView.path, 'template'), {
      ...configView.nujunks,
      express: this.app,
    });
  }

  private async initMongoose(): Promise<void> {
    const { MONGO_URL } = process.env;

    if (MONGO_URL) {
      this.mongoose = await Database.mongoose(MONGO_URL);
    }
  }

  private async initSequelize(): Promise<void> {
    this.sequelize = Database.sequelize({
      ...configDatabase,
      models: Object.values(models),
    });
  }

  private initMiddlewares(): void {
    const allMiddlewares = [
      helmet(),
      express.json(),
      express.urlencoded({ extended: true }),
      ...Object.values(middlewares),
    ];

    if (configSentry.dsn && process.env.NODE_ENV === 'production') {
      allMiddlewares.unshift(
        Sentry.Handlers.requestHandler({ serverName: true })
      );
    }

    allMiddlewares.forEach((middleware: any) => {
      if (typeof middleware !== 'function') {
        return;
      }

      try {
        this.app.use(middleware(this));
      } catch (e) {
        this.app.use(middleware);
      }
    });
  }
}

export default new App().server;
