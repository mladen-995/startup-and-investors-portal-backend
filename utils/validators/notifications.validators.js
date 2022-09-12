const { body, param } = require("express-validator");
const { NOTIFADVISIBILITYTYPES } = require("../consts.util");
const { ApplicationError } = require("../errors.util");

module.exports = {
    createNotif: [
        body(["title", "text", "isEmailNotification", "visibility"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        // @TODO
        // add validators if pairValues exist
        let notifVisibilityType;
        Object.keys(NOTIFADVISIBILITYTYPES).forEach((type) => {
            if (NOTIFADVISIBILITYTYPES[type].name === req.body.visibility) {
                notifVisibilityType = NOTIFADVISIBILITYTYPES[type];
            }
        });
        if (!notifVisibilityType) {
            throw new ApplicationError("Wrong visibility type value!", 422);
        }
        if (notifVisibilityType.hasPair) {
            if (!req.body.visibilityPairObject) {
                throw new ApplicationError("visibilityPairObject field is required for this visibility type!", 422);
            }
            if (notifVisibilityType.isPairArray) {
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
    notifDeleteRequest: [
        param("notificationId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteNotif: [
        param("notificationId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getNotification: [
        param("notificationId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
