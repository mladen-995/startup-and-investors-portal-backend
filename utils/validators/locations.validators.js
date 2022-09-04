const { param, body } = require("express-validator");

module.exports = {
    getCountry: [
        param("countryId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getCities: [
        param("countryId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getCity: [
        param("cityId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getMunicipalities: [
        param("cityId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getMunicipality: [
        param("municipalityId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getStreets: [
        param("municipalityId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getStreet: [
        param("streetId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getStreetNumbers: [
        param("streetId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getStreetNumber: [
        param("streetNumberId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    createCountry: [
        body("name")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteCountry: [
        param("countryId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    createCity: [
        body(["name", "countryId"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteCity: [
        param("cityId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    createMunicipality: [
        body(["name", "cityId"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteMunicipality: [
        param("municipalityId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    createStreet: [
        body(["name", "municipalityId"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteStreet: [
        param("streetId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    createStreetNumber: [
        body(["name", "streetId"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteStreetNumber: [
        param("streetNumberId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
