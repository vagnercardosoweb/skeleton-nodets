import { Model, Sequelize, DataTypes } from 'sequelize';
import PasswordService from '../services/PasswordService';

export class UserModel extends Model {
  static configure(sequelize: Sequelize) {
    this.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.VIRTUAL,
        password_hash: DataTypes.STRING,
      },
      { sequelize, tableName: 'users' }
    );

    this.addHook('beforeSave', async (user: any) => {
      if (user.password) {
        user.password_hash = await PasswordService.hash(user.password);
      }
    });

    return this;
  }

  // static associate(models) {}

  checkPassword(password: string) {
    return PasswordService.verify(password, (<any>this).password_hash);
  }
}
