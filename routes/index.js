const express = require("express");
const users = require("./users.route");
const ads = require("./ads.route");
const news = require("./news.route");
const notifs = require("./notifications.route");
const discussions = require("./discussions.route");
const surveys = require("./surveys.route");
const categories = require("./categories.route");
const userValidators = require("../utils/validators/users.validators");
const adValidators = require("../utils/validators/ads.validators");
const notifValidators = require("../utils/validators/notifications.validators");
const newsValidators = require("../utils/validators/news.validators");
const discussionsValidators = require("../utils/validators/discussions.validators");
const surveysValidators = require("../utils/validators/surveys.validators");
const categoriesValidators = require("../utils/validators/categories.validators");
const errorHandleUtil = require("../utils/error-handle-util");
const userMiddleware = require("../middlewares/users.middleware");
const { addPagination } = require("../middlewares/search.middleware");
const router = express.Router();

router.post("/register-investor", userValidators.registerInvestor, users.registerInvestor);
router.post("/register-startup", userValidators.registerStartup, users.registerStartup);
router.put("/update-investor/:userId",userMiddleware.checkUser, userValidators.updateInvestor, users.updateInvestor);
router.put("/update-startup/:userId", userMiddleware.checkUser, userValidators.updateStartup, users.updateStartup);
router.put("/update-administrator/:userId", userMiddleware.checkUser, userValidators.updateAdministrator, users.updateAdministrator);
// check if user is investor
router.post("/ads", userMiddleware.checkUser, adValidators.createAd, ads.createAd);
// check if user is admin
router.post("/ads/delete-request/:adId", userMiddleware.checkUser, adValidators.adDeleteRequest, ads.adDeleteRequest);
router.delete("/ads/:adId", userMiddleware.checkUser, adValidators.deleteAd, ads.deleteAd);
router.get("/ads", userMiddleware.addUserIdToReqIfExists, addPagination, ads.getAds);
router.get("/ads/:adId", adValidators.getAd, ads.getAd);
// check if investor or startup
router.post("/news", userMiddleware.checkUser, newsValidators.createNews, news.createNews);
router.post("/news/archive/:newsId", userMiddleware.checkUser, newsValidators.archiveNews, news.archiveNews);
router.post("/news/delete-request/:newsId", userMiddleware.checkUser, newsValidators.newsDeleteRequest, news.newsDeleteRequest);
router.delete("/news/:newsId", userMiddleware.checkUser, newsValidators.deleteNews, news.deleteNews);
router.get("/news", userMiddleware.addUserIdToReqIfExists, addPagination, news.getNews);
router.get("/news/:newsId", newsValidators.getSingleNews, news.getSingleNews);
router.get("/news-for-author", userMiddleware.checkUser, addPagination, news.getNewsForAuthor);
// check if user is investor
router.post("/notifications", userMiddleware.checkUser, notifValidators.createNotif, notifs.createNotification);
// check if user is admin
router.post("/notifications/delete-request/:notificationId", userMiddleware.checkUser, notifValidators.notifDeleteRequest, notifs.notificationDeleteRequest);
router.delete("/notifications/:notificationId", userMiddleware.checkUser, notifValidators.deleteNotif, notifs.deleteNotification);
router.get("/notifications", userMiddleware.addUserIdToReqIfExists, addPagination, notifs.getNotifications);
router.get("/notifications/:notificationId", notifValidators.getNotification, notifs.getNotification);
// check if user is investor
router.post("/discussions", userMiddleware.checkUser, discussionsValidators.createDiscussion, discussions.createDiscussion);
router.post("/discussions-reply/:parentId", userMiddleware.checkUser, discussionsValidators.createDiscussionReply, discussions.createDiscussionReply);
// // check if user is admin
router.post("/discussions/delete-request/:discussionId", userMiddleware.checkUser, discussionsValidators.discussionDeleteRequest, discussions.discussionDeleteRequest);
router.delete("/discussions/:discussionId", userMiddleware.checkUser, discussionsValidators.deleteDiscussion, discussions.deleteDiscussion);
router.get("/discussions", userMiddleware.addUserIdToReqIfExists, addPagination, discussions.getDiscussions);
router.get("/discussions/:discussionId", discussionsValidators.getDiscussion, discussions.getDiscussion);
router.get("/discussions-for-author", userMiddleware.checkUser, addPagination, discussions.getDiscussionsForAuthor);
router.get("/discussions-replies/:parentId", userMiddleware.checkUser, discussionsValidators.getDiscussionReplies, discussions.getDiscussionReplies);
router.post("/surveys", userMiddleware.checkUser, surveysValidators.createSurvey, surveys.createSurvey);
router.post("/surveys/reject/:surveyId", userMiddleware.checkUser, surveysValidators.rejectSurvey, surveys.rejectSurvey);
router.get("/surveys-questions/:surveyId", userMiddleware.checkUser, surveysValidators.getSurveyQuestions, surveys.getSurveyQuestions);
router.post("/surveys/answer/:surveyId", userMiddleware.checkUser, surveysValidators.answerSurvey, surveys.answerSurvey);
router.get("/surveys", userMiddleware.checkUser, addPagination, surveys.getSurveys);
router.get("/surveys/:surveyId", surveysValidators.getSurvey, surveys.getSurvey);
router.get("/surveys/question-answers/:questionId", userMiddleware.checkUser, surveysValidators.getSurveyQuestionAnswers, surveys.getSurveyQuestionAnswers);
router.post("/categories", userMiddleware.checkUser, categoriesValidators.createCategory, categories.createCategory);
router.get("/categories", userMiddleware.checkUser, addPagination, categoriesValidators.getCategories, categories.getCategories);
router.get("/categories/:categoryId", userMiddleware.checkUser, categoriesValidators.getCategory, categories.getCategory);
router.delete("/categories/:categoryId", userMiddleware.checkUser, categoriesValidators.deleteCategory, categories.deleteCategory);
router.post("/login", users.login);

router.use(errorHandleUtil.handleInternalApiError);

module.exports = router;
