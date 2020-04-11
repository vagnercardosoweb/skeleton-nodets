const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-unused-vars
const { QueryInterface } = require('sequelize');

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {*} Sequelize
   */
  up: (queryInterface, Sequelize) => {
    const users = [];

    for (let i = 1; i <= 10; i += 1) {
      users.push({
        name: `Name ${i}`,
        email: `email${i}@gmail.com`,
        password: bcrypt.hashSync(`password${i}`, 12),
        created_at: Sequelize.fn('NOW'),
        updated_at: Sequelize.fn('NOW'),
      });
    }

    return Promise.all([
      queryInterface.bulkDelete('users', null, {}),
      queryInterface.bulkInsert('users', users, {}),
    ]);
  },

  /**
   * @param {QueryInterface} queryInterface
   */
  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
