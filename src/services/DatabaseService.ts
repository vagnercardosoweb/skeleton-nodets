import mongoose, { Mongoose } from 'mongoose';
import { Sequelize } from 'sequelize';

// @ts-ignore
import config from '../config/database';
import * as models from '../models';

class DatabaseService {
  public sequelize: Sequelize;
  public mongo: Mongoose;

  connectSequelize() {
    try {
      this.sequelize = new Sequelize(config);
      this.afterConnectSequelize();
      this.loadModelsSequelize();
    } catch (err) {
      throw err;
    }
  }

  async connectMongoose() {
    try {
      if (process.env.MONGO_URL) {
        this.mongo = await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useFindAndModify: true,
        });
      }
    } catch (err) {
      throw err;
    }
  }

  private loadModelsSequelize() {
    Object.values(models)
      .map(model => model.configure(this.sequelize))
      .map(
        (model: any) =>
          typeof model.associate === 'function' &&
          model.associate(this.sequelize.models)
      );
  }

  private afterConnectSequelize() {
    (<any>this.sequelize).afterConnect(async (connection: Sequelize) => {
      const { dialect, encoding, timezone } = config;

      if (dialect === 'mysql') {
        connection.query(`SET NAMES \`${encoding}\``);
        connection.query(`SET time_zone = \`${timezone}\``);
      } else if (dialect === 'pgsql') {
        connection.query(
          `SET client_encoding TO \`${encoding.toUpperCase()}\``
        );
        connection.query(`SET timezone TO \`${timezone}\``);
      }
    });
  }
}

export default new DatabaseService();
