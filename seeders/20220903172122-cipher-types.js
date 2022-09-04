'use strict';
const db = require("../models");
const { CYPHERTYPES } = require("../utils/consts");

module.exports = {
  async up (queryInterface, Sequelize) {
    await db.CipherTypes.bulkCreate([{
      name: CYPHERTYPES.BUSINESSTYPES,
      editableByAll: false,
    }, {
      name: CYPHERTYPES.AREASOFINTEREST,
      editableByAll: true,
    }, {
      name: CYPHERTYPES.PROFESSIONALSKILLS,
      editableByAll: true,
    }]);
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
