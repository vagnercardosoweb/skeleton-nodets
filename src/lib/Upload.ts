import fs from 'fs';
import { basename, dirname, extname } from 'path';
// eslint-disable-next-line no-unused-vars
import sharp, { Sharp } from 'sharp';
import { promisify } from 'util';

import { uuid } from '../helpers';

export interface IUploadFIle extends Express.Multer.File {
  name?: string;
  extension?: string;
}

export default class Upload {
  private static allowedMimeTypes: [];

  static async file(
    file: IUploadFIle,
    path: string,
    name?: string
  ): Promise<IUploadFIle> {
    if (!file.buffer) {
      throw new Error('File passed not valid format multer.');
    }

    this.validateMimeTypes(file.mimetype);
    await this.validateFile(file, path, name);

    await promisify(fs.writeFile)(`${file.path}/${file.name}`, file.buffer);

    return file;
  }

  static async image(
    file: IUploadFIle,
    path: string,
    name?: string,
    width?: number,
    height?: number,
    format?: string
  ): Promise<IUploadFIle | boolean> {
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

    // width = width || metadata.width;
    // height = height || metadata.height;
    width = <number>width > <number>metadata.width ? metadata.width : width;
    height =
      <number>height > <number>metadata.height ? metadata.height : height;
    format = format || metadata.format;
    format = <string>(format === 'jpeg' ? 'jpg' : format);

    await image
      .resize(width, height, {
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, {})
      .toFile(
        `${file.path}/${(file.name as string).replace(
          <string>file.extension,
          `.${format}`
        )}`
      );

    return file;
  }

  static mimeTypes(types?: string | Array<string>): Upload {
    if (typeof types === 'string') {
      (types as any) = [types];
    } else if (!Array.isArray(types)) {
      throw new Error(
        `${typeof types} format is not valid! I expect the format: string or array.`
      );
    }

    (types as []).map((type) => this.allowedMimeTypes.push(type));

    return this;
  }

  private static async validateFile(
    file: IUploadFIle,
    path: string,
    name?: string
  ): Promise<IUploadFIle> {
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

  private static validateMimeTypes(mimeType: string): boolean {
    if (this.allowedMimeTypes.length > 0) {
      if (!this.allowedMimeTypes.includes(<never>mimeType)) {
        throw new Error(`Mime Type ${mimeType} not allowed for upload.`);
      }
    }

    this.allowedMimeTypes = [];

    return true;
  }

  private static async mkdir(folder: string): Promise<boolean> {
    try {
      await promisify(fs.access)(folder);
    } catch (e) {
      await promisify(fs.mkdir)(folder, { recursive: true, mode: 0o755 });
    }

    return true;
  }
}
