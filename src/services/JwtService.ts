// eslint-disable-next-line no-unused-vars
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import configApp from '../config/app';

class JwtService {
  instance() {
    return jwt;
  }

  encode(payload: any, options?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(
          jwt.sign(payload, configApp.key, { expiresIn: '7d', ...options })
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  decode(token: string, options?: VerifyOptions): Promise<string | object> {
    return new Promise((resolve, reject) => {
      try {
        resolve(jwt.verify(token, configApp.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new JwtService();
