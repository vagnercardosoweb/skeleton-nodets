import bcrypt from 'bcryptjs';

class PasswordService {
  instance() {
    return bcrypt;
  }

  hash(password: string, salt?: string | number): Promise<string> {
    return bcrypt.hash(password, salt || 12);
  }

  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default new PasswordService();
