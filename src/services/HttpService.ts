// eslint-disable-next-line no-unused-vars
import https, { RequestOptions } from 'https';

export default abstract class HttpService {
  protected createRequest(options: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = https.request(options, function request(res) {
        const chunks: any[] = [];

        res.on('data', chunk => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const chunked = Buffer.concat(chunks);
          resolve(JSON.parse(chunked.toString()));
        });

        res.on('error', err => {
          reject(err);
        });
      });

      request.end();
    });
  }
}
