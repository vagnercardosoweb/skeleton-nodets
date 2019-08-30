import * as Yup from 'yup';
import { validateCpf, validateCnpj, onlyNumber } from '../helpers';

Yup.string.prototype.cpf = function(message?: string) {
  message = message || '${path} must be valid cpf.';

  return this.test({
    name: 'cpf',
    message,
    exclusive: true,
    test: validateCpf,
  });
};

Yup.string.prototype.cnpj = function(message?: string) {
  message = message || '${path} must be valid cnpj.';

  return this.test({
    name: 'cpf',
    message,
    exclusive: true,
    test: validateCnpj,
  });
};

Yup.string.prototype.phone = function(message?: string) {
  message = message || '${path} must be a valid phone number dd + number';

  return this.transform((value: string | number) =>
    this.isType(value) ? onlyNumber(value) : value
  ).test({
    name: 'phone',
    message,
    exclusive: true,
    test(value: string) {
      return String(value).length > 10 && String(value).length < 13;
    },
  });
};

export default Yup;
