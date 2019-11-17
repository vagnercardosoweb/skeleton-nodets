// eslint-disable-next-line no-unused-vars
import mongoose, { Mongoose } from 'mongoose';
import { Sequelize } from 'sequelize';

// @ts-ignore
import config from '../config/database';
import * as models from '../models';

class DatabaseService {
  public sequelize: Sequelize;

  public mongo: Mongoose;

  connectSequelize() {
    this.sequelize = new Sequelize(config);
    this.loadModelsSequelize();
  }

  async connectMongoose() {
    const { MONGO_URL, MONGO_ENABLE } = process.env;

    if (MONGO_URL && String(MONGO_ENABLE) === 'true') {
      this.mongo = await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: true,
      });
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
}

export default new DatabaseService();
