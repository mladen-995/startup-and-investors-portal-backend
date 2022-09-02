const surveysService = require("../services/surveys.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const utilHelper = require("../utils/helper");
const { ApplicationError } = require("../utils/errors");
const { ROLENAMES } = require("../utils/consts");

async function createSurvey(userId, title, public, questions, transaction) {
    const survey = await surveysService.createSurvey(userId, title, public, transaction);
    for (const question of questions) {
        await surveysService.createSurveyQuestion(userId, survey.id, question, transaction);
    }
}

async function rejectSurvey(userId, surveyId) {
    const existingUserSurvey = await surveysService.getUserSurveyByUserIdAndSurveyId(userId, surveyId);
    if (existingUserSurvey) {
        throw new ApplicationError("User already answered this survey!", 422);
    }
    await surveysService.createUserSurvey(userId, surveyId, true);
}

async function getSurveyQuestions(surveyId) {
    return surveysService.getSurveyQuestions(surveyId);
}

async function answerSurvey(userId, surveyId, answersObjects, transaction) {
    const existingUserSurvey = await surveysService.getUserSurveyByUserIdAndSurveyId(userId, surveyId);
    if (existingUserSurvey) {
        throw new ApplicationError("User already answered this survey!", 422);
    }
    const questions = await surveysService.getSurveyQuestions(surveyId);
    const questionIds = questions.map(question => question.id);
    const userQuestionIds = answersObjects.map(answersObject => answersObject.questionId);
    const surveyAndUserQuestionsEqual = utilHelper.arraysHaveSameElements(questionIds, userQuestionIds);
    if (!surveyAndUserQuestionsEqual) {
        throw new ApplicationError("QuestionIds in answerObjects don't watch questionIds for the survey!!", 422);
    }
    // check if survey and questions exist
    const userSurvey = await surveysService.createUserSurvey(userId, surveyId, false, transaction);
    for (const answerObject of answersObjects) {
        await surveysService.createUserSurveyAnswer(userId, userSurvey.id, answerObject.questionId, answerObject.answer, transaction);
    }
}

async function getSurveys(userId, filter, pagination, showAnswered = false, showUnanswered = false) {
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            return surveysService.getAllSurveys(filter, pagination);
        }
        case ROLENAMES.STARTUP: {
            if ((showAnswered && showUnanswered) || (!showAnswered && !showUnanswered)) {
                return surveysService.getAllSurveys(filter, pagination);
            } else {
                const answeredSurveys = await surveysService.getAnsweredUserSurveysForUserId(userId);
                const answeredSurveysIds = answeredSurveys.map(answeredSurvey => answeredSurvey.surveyId);
                if (!showAnswered && showUnanswered) {
                    return surveysService.getSurveysWithIdNotInArray(answeredSurveysIds, filter, pagination);
                } else if (showAnswered && !showUnanswered) {
                    return surveysService.getSurveysWithIdInArray(answeredSurveysIds, filter, pagination);
                }
            }
        }
        // case ROLENAMES.ADMINISTARTOR: {
        //     return notifsService.getNotificationsForDeletion();
        // }
    }
}

async function getSurveyQuestionAnswers(userId, surveyQuestionId) {
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    const question = await surveysService.getSurveyQuestionById(surveyQuestionId);
    if (!question) {
        throw new ApplicationError("The question does not exist in database!", 422);
    }
    const survey = await surveysService.getSurveyById(question.surveyId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            if (!survey.public && survey.createdBy !== userId) {
                throw new ApplicationError("The survey is not public and the user is not the author!", 401);
            }
            break;
        }
        case ROLENAMES.STARTUP: {
            const userSurvey = await surveysService.getUserSurveyByUserIdAndSurveyId(userId, survey.id);
            if(!survey.public && !userSurvey) {
                throw new ApplicationError("The survey is not public and the user has not answered the survey yet!", 401);
            }
            break;
        }
        // case ROLENAMES.ADMINISTARTOR: {
        //     return notifsService.getNotificationsForDeletion();
        // }
    }
    const surveyQuestionAnswers = await surveysService.getSurveyQuestionAnswers(surveyQuestionId);
    return surveyQuestionAnswers.map(surveyQuestionAnswer => surveyQuestionAnswer.answer);
}

module.exports = {
    createSurvey,
    rejectSurvey,
    getSurveyQuestions,
    answerSurvey,
    getSurveyQuestionAnswers,
    getSurveys,
};
