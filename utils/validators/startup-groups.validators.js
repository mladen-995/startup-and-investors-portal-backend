const { body, param } = require("express-validator");
const { checkIfStringIsUUID4 } = require("../helper");
const { ApplicationError } = require("../errors");

module.exports = {
    createStartupGroup: [
        body(["name", "description", "startupIds"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        if (!Array.isArray(req.body.startupIds) && req.body.visibilityPairObject.length > 0) {
            throw new ApplicationError("startupIds must be an array!", 422);
        }
        req.body.startupIds.forEach((startupId) => {
            if(!checkIfStringIsUUID4(startupId)) {
                throw new ApplicationError("startupIds must be an array of UUID4 strings!", 422);
            }
        });
        return next();
    }
    ],
    deleteStartupGroup: [
        param("groupId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getStartupGroup: [
        param("groupId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
