import fs from 'fs';
import { promisify } from 'util';
import { basename, dirname, extname } from 'path';
import { Sharp } from 'sharp';

import { uuid } from '../helpers';

export interface MulterFileInterface extends Express.Multer.File {
  name?: string;
  extension?: string;
}

class UploadService {
  protected allowedMimeTypes: [];

  constructor() {
    this.allowedMimeTypes = [];
  }

  async file(
    file: MulterFileInterface,
    path: string,
    name?: string
  ): Promise<MulterFileInterface> {
    try {
      if (!file.buffer) {
        throw new Error('File passed not valid format multer.');
      }

      this.validateMimeTypes(file.mimetype);
      await this.validateFile(file, path, name);

      await promisify(fs.writeFile)(`${file.path}/${file.name}`, file.buffer);

      return file;
    } catch (e) {
      throw e;
    }
  }

  async image(
    file: MulterFileInterface,
    path: string,
    name?: string,
    width?: number,
    height?: number,
    format?: string
  ): Promise<MulterFileInterface | boolean> {
    try {
      const sharp = require('sharp');

      if (typeof sharp !== 'function') {
        throw new Error(
          "Upload image require 'https://github.com/lovell/sharp', install to continue."
        );
      }

      if (!file.buffer) {
        throw new Error('File passed not valid format multer.');
      }

      if (!file.mimetype.match(/image\//gi)) {
        return false;
      }

      this.validateMimeTypes(file.mimetype);
      await this.validateFile(file, path, name);

      const image: Sharp = sharp(file.buffer);
      const metadata = await image.metadata();

      width = width || metadata.width;
      height = height || metadata.height;
      format = format || metadata.format;
      format = format === 'jpeg' ? 'jpg' : format;

      await image
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(format, {})
        .toFile(
          `${file.path}/${file.name.replace(file.extension, `.${format}`)}`
        );

      return file;
    } catch (e) {
      throw e;
    }
  }

  mimeTypes(types?: string | Array<string>): UploadService {
    if (typeof types === 'string') {
      (types as any) = [types];
    } else if (!Array.isArray(types)) {
      throw new Error(
        `${typeof types} format is not valid! I expect the format: string or array.`
      );
    }

    (types as []).map(type => this.allowedMimeTypes.push(type));

    return this;
  }

  private async validateFile(
    file: MulterFileInterface,
    path: string,
    name: string
  ): Promise<MulterFileInterface> {
    file.extension = extname(file.originalname);

    if (path.match(/^(.*)\.[a-zA-Z0-9]{2,13}$/gi)) {
      file.name = basename(path).replace(file.extension, '');
      file.path = dirname(path);
    } else {
      file.path = path;
    }

    await this.mkdir(file.path);

    if (typeof name === 'string' && name.trim()) {
      file.name = name.trim();
    } else if (!name && !file.name) {
      file.name = uuid();
    }

    file.name = `${file.name}${file.extension}`;

    return file;
  }

  private validateMimeTypes(mimeType: string): boolean {
    if (this.allowedMimeTypes.length > 0) {
      if (!this.allowedMimeTypes.includes(<never>mimeType)) {
        throw new Error(`Mime Type ${mimeType} not allowed for upload.`);
      }
    }

    this.allowedMimeTypes = [];

    return true;
  }

  private async mkdir(folder: string): Promise<boolean> {
    try {
      await promisify(fs.access)(folder);
    } catch (e) {
      await promisify(fs.mkdir)(folder, { recursive: true, mode: 0o755 });
    }

    return true;
  }
}

export default new UploadService();
