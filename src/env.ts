import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  encoding: 'utf-8',
});
