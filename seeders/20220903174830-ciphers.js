'use strict';
const db = require("../models");
const { CYPHERTYPES } = require("../utils/consts");

module.exports = {
  async up (queryInterface, Sequelize) {
    const cipherTypeBussinesTypes = await db.CipherTypes.findOne({
      name: CYPHERTYPES.BUSINESSTYPES,
    });
    await db.Ciphers.bulkCreate([{
      name: "Poljoprivreda, šumarstvo i ribarstvo",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Rudarstvo",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Prerađivačka industrija",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Snabdevanje električnom energijom, gasom, parom i klimatizacija",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Snabdevanje vodom; upravljanje otpadnim vodama, kontrolisanje procesa uklanjanja otpada i slične aktivnosti",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Građevinarstvo",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Trgovina na veliko i trgovina na malo; popravka motornih vozila i motocikala",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Saobraćaj i skladištenje",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Usluge smeštaja i ishrane",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Informisanje i komunikacije",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Finansijske delatnosti i delatnost osiguranja",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Poslovanje nekretninama",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Stručne, naučne, inovacione i tehničke delatnosti",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Administrativne i pomoćne uslužne delatnosti",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Obrazovanje",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Zdravstvena i socijalna zaštita",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Umetnost; Zabava i rekreacija",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Ostale uslužne delatnosti",
      cipherTypeId: cipherTypeBussinesTypes.id,
    }, {
      name: "Delatnost domaćinstva kao poslodavca; Delatnost domaćinstava koja proizvode robu i usluge za sopstvene potrebe",
      cipherTypeId: cipherTypeBussinesTypes.id,
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
