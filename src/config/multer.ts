import multer, { Options } from 'multer';
import { extname, resolve } from 'path';
import { createRandomBytes } from '../helpers';

export function MulterAutomaticTmpUploads() {
  return multer({
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
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
