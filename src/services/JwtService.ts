import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import config from '../config/app';

class JwtService {
  instance() {
    return jwt;
  }

  encode(payload: any, options?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(jwt.sign(payload, config.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }

  decode(token: string, options?: VerifyOptions): Promise<string | object> {
    return new Promise((resolve, reject) => {
      try {
        resolve(jwt.verify(token, config.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new JwtService();
