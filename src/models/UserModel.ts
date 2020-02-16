// eslint-disable-next-line no-unused-vars
import { Model, Sequelize, DataTypes } from 'sequelize';

// eslint-disable-next-line no-unused-vars
import { IUser } from '../interfaces';
import { Password } from '../lib';

const tableName = 'users';

export default class UserModel extends Model implements IUser {
  public readonly id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at: Date | null;

  static configure(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: DataTypes.STRING,
        email: {
          type: DataTypes.STRING(100),
          unique: true,
          set(value: string): any {
            return (<any>this).setDataValue('email', value.toLowerCase());
          },
          validate: {
            isEmail: true,
          },
        },
        password: DataTypes.STRING,
      },
      {
        sequelize,
        tableName,
        paranoid: true,
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        indexes: [
          { fields: ['id'] },
          {
            unique: true,
            fields: ['email'],
          },
        ],
      }
    );

    this.addHook('beforeSave', async (user: UserModel) => {
      if (user.changed('password')) {
        user.password = await Password.create(user.password);
      }
    });

    return this;
  }

  // static associate(models) {}

  // static findByEmail(email) {...}

  verifyPassword(password: string): Promise<boolean> {
    return Password.verify(password, this.password);
  }
}
