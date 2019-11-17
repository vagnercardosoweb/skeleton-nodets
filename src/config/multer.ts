// eslint-disable-next-line no-unused-vars
import multer, { Options } from 'multer';
import { extname } from 'path';
import { createRandomBytes } from '../helpers';
import configApp from './app';

export function MulterAutomaticTmpUploads() {
  return multer({
    storage: multer.diskStorage({
      destination: configApp.path.uploads,
      filename: async (_, file, callback) => {
        try {
          const hash = await createRandomBytes(16);
          file.newName = `${hash}${extname(file.originalname)}`;

          return callback(null, file.newName);
        } catch (e) {
          return callback(e, null);
        }
      },
    }),
  });
}

export default function(options: Options = {}) {
  return multer(options);
}
