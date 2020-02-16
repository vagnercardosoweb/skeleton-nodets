const charset = process.env.DB_ENCODING || 'utf8';

module.exports = {
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  storage: process.env.DB_STORAGE,
  encoding: charset,
  timezone: process.env.DB_TIMEZONE || '+03:00',

  migrationStorageTableName: 'migrations',

  define: {
    engine: 'InnoDB',
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    charset,
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
  },
};
