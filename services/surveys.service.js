const db = require("../models");
const { Op } = require("sequelize");

async function createSurvey(userId, title, public, transaction){
    return db.Surveys.create({
        title,
        public,
        createdBy: userId,
    }, { 
        transaction: transaction,
    }); 
}

async function createSurveyQuestion(userId, surveyId, question, transaction){
    return db.SurveyQuestions.create({
        surveyId,
        question,
        createdBy: userId,
    }, { 
        transaction: transaction,
    }); 
}

async function getUserSurveyByUserIdAndSurveyId(userId, surveyId) {
    return db.UserSurveys.findOne({
        where: {
            surveyId,
            createdBy: userId,
        },
    }); 
}

async function getUserSurveysBySurveyId(surveyId) {
    return db.UserSurveys.findAll({
        where: {
            surveyId,
        },
    }); 
}

async function createUserSurvey(userId, surveyId, rejectsToAnswer) {
    return db.UserSurveys.create({
        surveyId,
        rejectsToAnswer,
        createdBy: userId,
    }); 
}

async function getSurveyQuestions(surveyId) {
    return db.SurveyQuestions.findAll({
        where: {
            surveyId,
        },
    }); 
}

async function getSurveyQuestionById(id) {
    return db.SurveyQuestions.findOne({
        where: {
            id,
        },
    }); 
}

async function getSurveyById(id) {
    return db.Surveys.findOne({
        where: {
            id,
        },
    }); 
}

async function createUserSurveyAnswer(userId, userSurveyId, surveyQuestionId, answer, transaction) {
    return db.UserSurveyAnswers.create({
        userSurveyId,
        surveyQuestionId,
        answer,
        createdBy: userId,
    }, { 
        transaction: transaction,
    });
}

async function getAnsweredUserSurveysForUserId(userId) {
    return db.UserSurveys.findAll({
        where: {
            createdBy: userId,
        },
    }); 
}

async function getSurveysWithIdNotInArray(notIds, filter, pagination) {
    filter.id = {[Op.notIn]: notIds };
    return db.Surveys.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.SurveyQuestions,
            as: "surveyQuestions",
        },
    }); 
}

async function getSurveysWithIdInArray(ids, filter, pagination) {
    filter.id = ids;
    return db.Surveys.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.SurveyQuestions,
            as: "surveyQuestions",
        },
    }); 
}

async function getSurveyQuestionAnswers(surveyQuestionId) {
    return db.UserSurveyAnswers.findAll({
        where: {
            surveyQuestionId,
        },
    }); 
}

async function getUserSurveyAnswersByUserSurveyId(userSurveyId) {
    return db.UserSurveyAnswers.findAll({
        where: {
            userSurveyId,
        },
    }); 
}

async function getAllSurveys(filter, pagination) {
    return db.Surveys.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.SurveyQuestions,
            as: "surveyQuestions",
        },
    }); 
}

module.exports = {
    createSurvey,
    createSurveyQuestion,
    createUserSurvey,
    getUserSurveyByUserIdAndSurveyId,
    getSurveyQuestions,
    createUserSurveyAnswer,
    getAnsweredUserSurveysForUserId,
    getSurveysWithIdNotInArray,
    getSurveyQuestionAnswers,
    getSurveyQuestionById,
    getSurveysWithIdInArray,
    getAllSurveys,
    getSurveyById,
    getUserSurveyAnswersByUserSurveyId,
    getUserSurveysBySurveyId,
};
