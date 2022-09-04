'use strict';
const db = require("../models");

module.exports = {
  async up (queryInterface, Sequelize) {
    await db.Users.create({
      username: "administrator",
      password: "administrator1",
      firstName: "Admin",
      lastName: "Adminovic",
      email: "admin@admin.com",
      roleId: 1,
      approved: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
