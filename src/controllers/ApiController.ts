// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

class ApiController {
  async index(req: Request, res: Response) {
    return res.success({
      date: new Date(),
      company: 'VCWeb Networks',
      developer: 'Vagner dos Santos Cardoso',
    });
  }
}

export default new ApiController();
