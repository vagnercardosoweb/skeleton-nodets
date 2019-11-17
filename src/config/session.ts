import { createHash } from '../helpers';

// Options for
// https://www.npmjs.com/package/express-session

export default {
  name: `sess_${createHash('name').slice(0, 25)}`,
  secret: `secret_${createHash('secret').slice(0, 25)}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
  },
};
