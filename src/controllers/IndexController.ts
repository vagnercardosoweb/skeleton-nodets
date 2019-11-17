// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

class IndexController {
  index(req: Request, res: Response) {
    return res.render('index');
  }
}

export default new IndexController();
