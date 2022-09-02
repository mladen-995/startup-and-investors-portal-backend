const { body, param } = require("express-validator");
const { NEWSVISIBILITYTYPES } = require("../consts");
const { ApplicationError } = require("../errors");

module.exports = {
    createNews: [
        body(["title", "text", "visibility"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        // @TODO
        // add validators if pairValues exist
        // expiryDate > NOW
        let newsVisibilityType;
        Object.keys(NEWSVISIBILITYTYPES).forEach((type) => {
            if (NEWSVISIBILITYTYPES[type].name === req.body.visibility) {
                newsVisibilityType = NEWSVISIBILITYTYPES[type];
            }
        });
        if (!newsVisibilityType) {
            throw new ApplicationError("Wrong visibility type value!", 422);
        }
        if (newsVisibilityType.hasPair) {
            if (!req.body.visibilityPairObject) {
                throw new ApplicationError("visibilityPairObject field is required for this visibility type!", 422);
            }
            if (newsVisibilityType.isPairArray) {
                if (!Array.isArray(req.body.visibilityPairObject) && req.body.visibilityPairObject.length > 0) {
                    throw new ApplicationError("visibilityPairObject must be an array for this visibility type!", 422);
                }
            }
        }
        return next();
    }
    ],
    archiveNews: [
        param("newsId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    newsDeleteRequest: [
        param("newsId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getSingleNews: [
        param("newsId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteNews: [
        param("newsId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
