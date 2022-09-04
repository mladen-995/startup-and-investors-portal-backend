const { param, body } = require("express-validator");

module.exports = {
    getCiphers: [
        param("cipherTypeName")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getCipher: [
        param("cipherId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    createCipher: [
        body("name", "cipherTypeName")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteCipher: [
        param("cipherId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
