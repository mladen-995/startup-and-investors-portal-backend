'use strict';
const db = require("../models");
const { ROLENAMES } = require("../utils/consts");

module.exports = {
  async up (queryInterface, Sequelize) {
    await db.Roles.bulkCreate([{
      name: ROLENAMES.ADMINISTARTOR,
    }, {
      name: ROLENAMES.STARTUP,
    }, {
      name: ROLENAMES.INVESTOR,
    }]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.resolve(true);
  }
};
