/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import crypto, { HexBase64Latin1Encoding, BinaryLike } from 'crypto';
import { promises as fs } from 'fs';
import os from 'os';
import { stringify, ParsedUrlQueryInput } from 'querystring';

import configView from './config/view';
import View from './lib/View';

export function existsOrError(value?: any, message?: string): void {
  if (!value) throw new Error(message);
  if (Array.isArray(value) && value.length === 0) throw new Error(message);
  if (typeof value === 'string' && !value.trim()) throw new Error(message);
}

export function notExistsOrError(value: any, message: string): any {
  try {
    existsOrError(value, message);
  } catch (err) {
    return;
  }

  throw new Error(message);
}

export function equalsOrError(a?: any, b?: any, message?: string): any {
  if (a !== b) throw new Error(message);
}

export function uuid(a?: any): string {
  return a
    ? // eslint-disable-next-line no-bitwise
      (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

export async function createTmpFile(
  data: any,
  extension: string
): Promise<string> {
  if (!data || !extension) {
    throw new Error('createTmpFile: arguments invalids.');
  }

  extension = extension.replace('.', '');
  const filePath = `${os.tmpdir()}/${uuid()}-${Date.now()}.${extension}`;
  await fs.writeFile(`${filePath}`, data);

  return filePath;
}

export function createHash(
  value: BinaryLike,
  key: BinaryLike,
  algorithm = 'sha256',
  encoding: HexBase64Latin1Encoding = 'hex'
): string {
  return crypto.createHmac(algorithm, key).update(value).digest(encoding);
}

export function createHashMd5(value: BinaryLike): string {
  return crypto.createHash('md5').update(value).digest('hex');
}

export function createRandomBytes(length?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes((length || 16) / 2, (err, hash) => {
      if (err) return reject(err);

      return resolve(hash.toString('hex'));
    });
  });
}

export function createRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

export function createRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isValidaDate(date: any): boolean {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

export function createDateInstance(
  date?: Date | string | number,
  check: boolean = true
): Date {
  date = date || Date.now();

  if (date instanceof Date) {
    date = date.getTime();
  } else if (Number.isNaN(Number(date)) && (date as string).trim()) {
    const dateSplit = date.toString().split(' ');
    const dateTime = typeof dateSplit[1] !== 'undefined' ? dateSplit[1] : '';

    if (dateSplit[0].match(/^\d{2}\/\d{2}\/\d{4}$/gi)) {
      const dateReverse = dateSplit[0].split('/').reverse().join('/');

      date = `${dateReverse} ${dateTime}`;
    } else if (dateSplit[0].match(/^\d{4}\/\d{2}\/\d{2}$/gi)) {
      date = `${dateSplit[0]} ${dateTime}`;
    }
  } else if (!Number.isNaN(Number(date))) {
    date = Number(date);
  }

  const newDate = new Date(date);

  if (check && !isValidaDate(newDate)) {
    throw new Error(`Invalid date ${date}`);
  }

  return newDate;
}

export function calculateAge(date: Date | string | number): number {
  const birthday = +createDateInstance(date);
  // eslint-disable-next-line no-bitwise
  return ~~((Date.now() - birthday) / 3.15576e10);
}

export function convertToTitleCase(string: string): string {
  if (!string) {
    return '';
  }

  string = string.toString();

  return string.replace(/\w\S*/g, function replace(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function convertToCamelCaseString(value: string): string {
  return String(value)
    .toLowerCase()
    .replace(/^([A-Z])|[\s-_](\w)/g, (_, p1, p2) => {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    });
}

export function convertToCamelCaseObject(obj?: any): object | boolean {
  if (typeof obj !== 'object') {
    return false;
  }

  const newObj: { [key: string]: string } = {};

  Object.keys(obj).map((key) => {
    newObj[convertToCamelCaseString(key)] = obj[key];

    return newObj;
  });

  return newObj;
}

export function validateCpf(cpf: string | number): boolean {
  cpf = String(cpf).replace(/\.|-|\s/gi, '');

  if (cpf.length !== 11) {
    return false;
  }

  for (let i = 0; i <= 9; i++) {
    if (cpf === String(i).repeat(11)) {
      return false;
    }
  }

  const calculate = (mod: number) => {
    let sum = 0;

    for (let i = 0; i <= mod - 2; i++) {
      sum += Number((cpf as string).charAt(i)) * (mod - i);
    }

    return String(sum % 11 < 2 ? 0 : 11 - (sum % 11));
  };

  if (calculate(10) !== cpf.charAt(9) || calculate(11) !== cpf.charAt(10)) {
    return false;
  }

  return true;
}

export function validateCnpj(cnpj: string | number): boolean {
  cnpj = String(cnpj).replace(/\.|-|\/|\s/gi, '');

  if (cnpj.length !== 14) {
    return false;
  }

  for (let i = 0; i <= 14; i++) {
    if (cnpj === String(i).repeat(14)) {
      return false;
    }
  }

  const calculate = (length: number) => {
    let sum = 0;
    let position = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += Number((cnpj as string).charAt(length - i)) * position--;

      if (position < 2) {
        position = 9;
      }
    }

    return String(sum % 11 < 2 ? 0 : 11 - (sum % 11));
  };

  if (calculate(12) !== cnpj.charAt(12) || calculate(13) !== cnpj.charAt(13)) {
    return false;
  }

  return true;
}

export function validateEmail(value: string): boolean {
  const regex = new RegExp(
    // eslint-disable-next-line no-control-regex
    /^((([a-z]|\d|[!#\\$%&'\\*\\+\-\\/=\\?\\^_`{\\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\\$%&'\\*\\+\-\\/=\\?\\^_`{\\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
  );

  return regex.test(value);
}

export function onlyNumber(value: any): string | number {
  return String(value).replace(/[^\d]/gi, '');
}

export function removeAccents(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, '');
}

export function normalizeMoney(value: string): number {
  return Number(value.replace(/[^0-9-]/g, '')) / 100;
}

export function formatMoneyBrl(value: number): string {
  const formatter = global.Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

export function getImageGravatar(
  email: string,
  params?: ParsedUrlQueryInput
): string {
  const md5 = createHashMd5(email);
  const query = params ? `?${stringify(params)}` : '';
  return `https://www.gravatar.com/avatar/${md5}${query}`;
}

export function renderView(template: string, context: object): string {
  const nunjucks = View.nunjucks(configView.path, configView.nujunks);

  return nunjucks.render(`${template}.njk`, context || {});
}

export function rangeNumber(size: number, start: number = 0): Array<number> {
  return [...Array(size).keys()].map((i) => i + start);
}

export function rangeCharacters(
  startChar: string,
  endChar: string
): Array<string> {
  return String.fromCharCode(
    ...rangeNumber(
      endChar.charCodeAt(0) - startChar.charCodeAt(0) + 1,
      startChar.charCodeAt(0)
    )
  );
}

export function validateSequenceValue(value: any): boolean {
  const numbers = rangeNumber(9);
  const characters = rangeCharacters('a', 'z');
  const valueLower = String(value).toLowerCase();
  const reverseArray = (arr: Array<any>) => arr.reverse().join('');

  if (
    numbers.join('').indexOf(valueLower) ||
    reverseArray(numbers).indexOf(valueLower)
  ) {
    return true;
  }

  return !!(
    characters.join('').indexOf(valueLower) ||
    reverseArray(characters).indexOf(valueLower)
  );
}

export function validateCompleteName(value: string): boolean {
  return (value || '').split(' ', 2).length === 2;
}

export function bytesToSize(bytes: number, decimals: number = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
