import { createHash } from '../helpers';
import configApp from './app';

// Options for
// https://www.npmjs.com/package/express-session

export default {
  name: `sess_${createHash('name', configApp.key).slice(0, 25)}`,
  secret: `secret_${createHash('secret', configApp.key).slice(0, 25)}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
  },
};
