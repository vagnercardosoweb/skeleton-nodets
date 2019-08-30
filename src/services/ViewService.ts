import twig from 'twig';
import nunjucks from 'nunjucks';
import { Application } from 'express';
import config from '../config/view';

export default class ViewService {
  protected application: Application;

  constructor(application: Application) {
    this.application = application;

    this.configure();
  }

  configure(): void {
    const { engine } = config;

    switch (engine) {
      case 'twig':
      case 'html':
        this.twig();
        break;

      case 'nunjucks':
      case 'njk':
        this.nunjucks();
        break;

      default:
        throw new Error('There is no other view engine configured.');
    }
  }

  private nunjucks(): void {
    const { path, engine, options, filters } = config;

    // Configure engine
    const env = nunjucks.configure(path, {
      ...options,
      express: this.application,
    });

    this.application.set('view engine', engine);

    // Filters
    [filters].map((item: { [key: string]: any }) => {
      Object.keys(item).map(key => {
        env.addFilter(key, item[key]);
      });
    });
  }

  private twig() {
    const { path, engine, options, functions, filters } = config;

    // Configure engine
    this.application.set('views', path);
    this.application.set('view engine', engine);

    if (engine === 'html') {
      this.application.engine('html', twig.__express);
    }

    this.application.set('twig options', options);

    // Function && Filters
    [functions, filters].map((item: { [key: string]: any }) => {
      Object.keys(item).map(key => {
        if (functions.hasOwnProperty(key)) {
          twig.extendFunction(key, item[key]);
        }

        if (filters.hasOwnProperty(key)) {
          twig.extendFilter(key, item[key]);
        }
      });
    });
  }
}
