// Dotenv
import 'dotenv/config';

import http, { Server as HttpServer } from 'http';
import express, { Application } from 'express';
import socketIo, { Server as SocketServer } from 'socket.io';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

// Middlewares
import helmet from 'helmet';
import AppMiddleware from './middlewares/AppMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import HeaderMiddleware from './middlewares/HeaderMiddleware';
import MethodOverrideMiddleware from './middlewares/MethodOverrideMiddleware';
import RouterMiddleware from './middlewares/RouterMiddleware';
import SocketMiddleware from './middlewares/SocketMiddleware';
import ErrorMiddleware from './middlewares/ErrorMiddleware';

// Services
import ViewService from './services/ViewService';
import DatabaseService from './services/DatabaseService';

// Configs
import configSentry from './config/sentry';
import configView from './config/view';

// Routes
import routes from './routes';

class App {
  public application: Application;
  public server: HttpServer;
  public socketIo: SocketServer;

  public constructor() {
    this.application = express();
    this.server = http.createServer(this.application);
    this.socketIo = socketIo(this.server);

    this.sentry();
    this.services();
    this.middlewares();

    this.application.use(routes);
    this.application.use(new RouterMiddleware().dispatch());
    this.application.use(new ErrorMiddleware(this.application).dispatch());
  }

  private sentry(): void {
    Sentry.init(configSentry);
  }

  private services(): void {
    if (configView.enable) {
      new ViewService(this.application);
    }

    DatabaseService.connectSequelize();
    // DatabaseService.connectMongoose();
  }

  private middlewares(): void {
    const middlewares = [
      helmet(),
      express.json(),
      express.urlencoded({ extended: true }),
      AppMiddleware,
      SessionMiddleware,
      HeaderMiddleware,
      MethodOverrideMiddleware,
      SocketMiddleware,
    ];

    if (configSentry.dsn && process.env.NODE_ENV === 'production') {
      middlewares.unshift(Sentry.Handlers.requestHandler());
    }

    middlewares.map((middleware: any) => {
      try {
        const handle = new middleware(this.application, this.socketIo);
        this.application.use(handle.dispatch());
      } catch (e) {
        this.application.use(middleware);
      }
    });
  }
}

export default new App().server;
