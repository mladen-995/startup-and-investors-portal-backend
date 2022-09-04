'use strict';
const db = require("../models");
module.exports = {
  async up (queryInterface, Sequelize) {
    const country = await db.Countries.create({
      name: "Srbija",
    });
    const city = await db.Cities.create({
      name: "Belgrade",
      countryId: country.id,
    });
    const municipality1 = await db.Municipalities.create({
      name: "Stari grad",
      cityId: city.id,
    });
    const municipality2 = await db.Municipalities.create({
      name: "Zvezdara",
      cityId: city.id,
    });
    const street1 = await db.Streets.create({
      name: "Kralja Petra",
      municipalityId: municipality1.id,
    });
    const street2 = await db.Streets.create({
      name: "Gospodar Jevremova",
      municipalityId: municipality1.id,
    });
    const street3 = await db.Streets.create({
      name: "Bulevar kralja Aleksandra",
      municipalityId: municipality2.id,
    });
    const street4 = await db.Streets.create({
      name: "Vojvode Savatija",
      municipalityId: municipality2.id,
    });
    for (let i = 1; i <= 30; i++) {
      await db.StreetNumbers.create({
        name: i,
        streetId: street1.id
      });
      await db.StreetNumbers.create({
        name: i,
        streetId: street2.id
      });
      await db.StreetNumbers.create({
        name: i,
        streetId: street3.id
      });
      await db.StreetNumbers.create({
        name: i,
        streetId: street4.id
      });
    }
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
