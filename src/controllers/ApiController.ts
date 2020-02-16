// eslint-disable-next-line no-unused-vars
import { Response } from 'express';

import packageJson from '../../package.json';

class ApiController {
  async index(_: any, res: Response) {
    return res.success({
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
      license: packageJson.license,
      maintainers: packageJson.maintainers,
    });
  }
}

export default new ApiController();
