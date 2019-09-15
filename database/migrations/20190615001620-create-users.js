// eslint-disable-next-line no-unused-vars
const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} dataTypes
   */
  up: (queryInterface, dataTypes) => {
    return queryInterface.createTable(
      'users',
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
          type: dataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
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
      },
      { engine: 'InnoDB', charset: 'utf8', collate: 'utf8_general_ci' }
    );
  },

  /**
   * @param {QueryInterface} queryInterface
   */
  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
