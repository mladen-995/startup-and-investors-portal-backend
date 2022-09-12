const { body, param } = require("express-validator");
const { DISCUSSIONVISIBILITYTYPES } = require("../consts.util");
const { ApplicationError } = require("../errors.util");

module.exports = {
    createDiscussion: [
        body(["title", "text", "visibility"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        // @TODO
        // add validators if pairValues exist
        let discussionsVisibilityType;
        Object.keys(DISCUSSIONVISIBILITYTYPES).forEach((type) => {
            if (DISCUSSIONVISIBILITYTYPES[type].name === req.body.visibility) {
                discussionsVisibilityType = DISCUSSIONVISIBILITYTYPES[type];
            }
        });
        if (!discussionsVisibilityType) {
            throw new ApplicationError("Wrong visibility type value!", 422);
        }
        if (discussionsVisibilityType.hasPair) {
            if (!req.body.visibilityPairObject) {
                throw new ApplicationError("visibilityPairObject field is required for this visibility type!", 422);
            }
            if (!Array.isArray(req.body.visibilityPairObject) || req.body.visibilityPairObject.length === 0) {
                throw new ApplicationError("visibilityPairObject must be an array for this visibility type!", 422);
            }
        }
        return next();
    }
    ],
    createDiscussionReply: [
        body("text")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        param("parentId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    archiveDiscussion: [
        param("discussionId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    discussionDeleteRequest: [
        param("discussionId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteDiscussion: [
        param("discussionId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getDiscussionReplies: [
        param("parentId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getDiscussion: [
        param("discussionId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
