const lodash = require("lodash");
const db = require("../models");
const { validationResult } = require("express-validator");
const surveysController = require("../controllers/surveys.controller");

async function createSurvey(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { title, public, questions } = req.body;
        await surveysController.createSurvey(req.userId, title, public, questions, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function rejectSurvey(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const surveyId = req.params.surveyId;
        await surveysController.rejectSurvey(req.userId, surveyId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getSurveyQuestions(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const surveyId = req.params.surveyId;
        const questions = await surveysController.getSurveyQuestions(surveyId);
        res.status(200).json({
            success: true,
            data: questions,
        });
    } catch(err) {
        next(err);
    }
}

async function answerSurvey(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { answersObjects } = req.body;
        const surveyId = req.params.surveyId;
        await surveysController.answerSurvey(req.userId, surveyId, answersObjects, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function getSurveys(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["title", "public", "requestedDeletion", "isArchived"];
        const filter = lodash.pick(req.query, filterParams);
        const { showAnswered, showUnanswered } = req.query;
        const surveys = await surveysController.getSurveys(req.userId, filter, pagination, showAnswered, showUnanswered);
        res.status(200).json({
            success: true,
            data: surveys,
        });
    } catch(err) {
        next(err);
    }
}

async function getSurvey(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const surveyId = req.params.surveyId;
        const survey = await surveysController.getSurvey(req.userId, surveyId);
        res.status(200).json({
            success: true,
            data: survey,
        });
    } catch(err) {
        next(err);
    }
}

async function getSurveyQuestionAnswers(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const questionId = req.params.questionId;
        const answers = await surveysController.getSurveyQuestionAnswers(req.userId, questionId);
        res.status(200).json({
            success: true,
            data: answers,
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createSurvey,
    rejectSurvey,
    getSurveyQuestions,
    answerSurvey,
    getSurveys,
    getSurvey,
    getSurveyQuestionAnswers,
};
