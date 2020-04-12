// eslint-disable-next-line no-unused-vars
const { QueryInterface, DataTypes } = require('sequelize');

const tableName = 'users';

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} dataTypes
   */
  up: async (queryInterface, dataTypes) => {
    await queryInterface.createTable(
      tableName,
      {
        id: {
          type: dataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: dataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: dataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: dataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: dataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: dataTypes.DATE,
          allowNull: false,
        },
        deleted_at: {
          type: dataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      { engine: 'InnoDB', charset: 'utf8', collate: 'utf8_general_ci' }
    );

    await queryInterface.addIndex(tableName, ['id']);
    await queryInterface.addIndex(tableName, ['email'], { unique: true });
    await queryInterface.addIndex(tableName, ['created_at']);
    await queryInterface.addIndex(tableName, ['deleted_at']);
  },

  /**
   * @param {QueryInterface} queryInterface
   */
  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};
