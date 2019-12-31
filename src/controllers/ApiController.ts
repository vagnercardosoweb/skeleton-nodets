// eslint-disable-next-line no-unused-vars
import { Response } from 'express';

class ApiController {
  async index(_: any, res: Response) {
    return res.success({
      date: new Date(),
      company: 'VCWeb Networks',
      developer: [
        {
          name: 'Vagner dos Santos Cardoso',
          email: 'dev@vcwebnetworks.com.br',
        },
      ],
    });
  }
}

export default new ApiController();
