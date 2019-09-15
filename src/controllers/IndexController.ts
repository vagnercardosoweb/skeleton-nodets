// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

class ApiController {
  index(req: Request, res: Response) {
    return res.render('index');
  }
}

export default new ApiController();
