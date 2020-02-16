// eslint-disable-next-line no-unused-vars
import { Response } from 'express';
import morgan from 'morgan';

const format = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const skip = (_: any, res: Response) =>
  format === 'combined' && res.statusCode < 400;

export default morgan(format, { skip });
