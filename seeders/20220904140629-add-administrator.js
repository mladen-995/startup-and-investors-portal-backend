'use strict';
const db = require("../models");
const rolesService = require("../services/roles.service")
const { ROLENAMES } = require("../utils/consts")

module.exports = {
  async up (queryInterface, Sequelize) {
    const adminRole = await rolesService.getRoleByName(ROLENAMES.ADMINISTARTOR)
    await db.Users.create({
      username: "administrator",
      password: "administrator1",
      firstName: "Admin",
      lastName: "Adminovic",
      email: "admin@admin.com",
      roleId: adminRole.id,
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
