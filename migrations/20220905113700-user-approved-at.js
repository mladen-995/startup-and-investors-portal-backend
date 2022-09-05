'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "approved_date", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "approved_date");
  }
};
