import { Router } from 'express';

import ApiController from './controllers/ApiController';
import IndexController from './controllers/IndexController';

const routes = Router();

routes.get('/', IndexController.index);
routes.get('/api*', ApiController.index);

export default routes;
