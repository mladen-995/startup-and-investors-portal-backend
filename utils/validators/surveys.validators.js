const { body, param } = require("express-validator");
const { ApplicationError } = require("../errors");
const { checkIfStringIsUUID4 } = require("../helper");

module.exports = {
    createSurvey: [
        body(["title", "public", "questions"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        if (!Array.isArray(req.body.questions)) {
            throw new ApplicationError("Questions must be an array of strings!", 422);
        }
        req.body.questions.forEach((question) => {
            if (typeof question !== "string"){
                throw new ApplicationError("Questions must be an array of strings!", 422);
            }
        });
        return next();
    }
    ],
    rejectSurvey: [
        param("surveyId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getSurveyQuestions: [
        param("surveyId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    answerSurvey: [
        param("surveyId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("answersObjects")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

        function(req, res, next) {
            if (!Array.isArray(req.body.answersObjects)) {
                throw new ApplicationError("answersObjects must be an array!", 422);
            }
            if (req.body.answersObjects.length === 0) {
                throw new ApplicationError("answersObjects must be a non empty array!", 422);
            }
            req.body.answersObjects.forEach((answerObject) => {
                if (typeof answerObject.answer !== "string"){
                    throw new ApplicationError("Answer must be a string!", 422);
                }
                if (!checkIfStringIsUUID4(answerObject.questionId)){
                    throw new ApplicationError("QuestionId must be an UUID!", 422);
                }
            });
            return next();
        }
    ],
    getSurveyQuestionAnswers: [
        param("questionId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getDiscussionReplies: [
        param("parentId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    getSurvey: [
        param("surveyId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
