const { body, param } = require("express-validator");
const { NOTIFADVISIBILITYTYPES } = require("../consts.util");
const { ApplicationError } = require("../errors.util");

module.exports = {
    createAd: [
        body(["title", "text", "expiryDate", "visibility"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        // @TODO
        // add validators if pairValues exist
        // expiryDate > NOW
        let adVisibilityType;
        Object.keys(NOTIFADVISIBILITYTYPES).forEach((type) => {
            if (NOTIFADVISIBILITYTYPES[type].name === req.body.visibility) {
                adVisibilityType = NOTIFADVISIBILITYTYPES[type];
            }
        });
        if (!adVisibilityType) {
            throw new ApplicationError("Wrong visibility type value!", 422);
        }
        if (adVisibilityType.hasPair) {
            if (!req.body.visibilityPairObject) {
                throw new ApplicationError("visibilityPairObject field is required for this visibility type!", 422);
            }
            if (adVisibilityType.isPairArray) {
                if (!Array.isArray(req.body.visibilityPairObject) || req.body.visibilityPairObject.length === 0) {
                    throw new ApplicationError("visibilityPairObject must be an array for this visibility type!", 422);
                }
            } else {
                if (Array.isArray(req.body.visibilityPairObject)) {
                    throw new ApplicationError("visibilityPairObject must be an array for this visibility type!", 422);
                }
            }
        }
        return next();
    }
    ],
    adDeleteRequest: [
        param("adId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteAd: [
        param("adId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getAd: [
        param("adId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
